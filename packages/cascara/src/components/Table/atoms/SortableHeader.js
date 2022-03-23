import React, { useCallback } from 'react';
import pt from 'prop-types';
import { Role } from 'reakit';
import cx from 'classnames';

import styles from '../Table.module.scss';
import { SORT_ORDER } from '../state/sortingReducer';

const propTypes = {
  attribute: pt.string,
  isSortAttribute: pt.bool,
  isSortable: pt.bool,
  label: pt.string,
  onSort: pt.func,
  sortState: pt.shape({
    attribute: pt.string,
    order: pt.string,
  }),
};

const SortableHeader = ({
  attribute,
  isSortable,
  isSortAttribute,
  label,
  sortState,
  onSort,
}) => {
  const isColumnSorted = sortState.attribute === attribute;
  const headerClass = cx(styles.HeadCell, {
    [styles.SortedColumn]: isColumnSorted,
  });
  const className = cx('SortArrow', {
    [styles.SortArrowDown]:
      isSortAttribute && sortState?.order === SORT_ORDER.DESCENDING,
    [styles.SortArrowUp]:
      isSortAttribute && sortState?.order === SORT_ORDER.ASCENDING,
    [styles.SortInactive]:
      !isSortAttribute || sortState?.order === SORT_ORDER.UNSORTED,
  });

  /** Handle SVG element click */
  const handleHeaderClick = useCallback(() => {
    if (isSortable) {
      onSort(attribute);
    }
  }, [attribute, isSortable, onSort]);

  return (
    <th className={headerClass} key={attribute} onClick={handleHeaderClick}>
      {label} {isSortable && <Role className={className} />}
    </th>
  );
};

SortableHeader.propTypes = propTypes;

export default SortableHeader;
