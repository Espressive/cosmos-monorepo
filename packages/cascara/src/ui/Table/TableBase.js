import React, { useCallback, useMemo, useReducer } from 'react';
// import pt from 'prop-types';
import styles from './Table.module.scss';
import { TABLE_SHAPE } from './__propTypes';
import TableProvider from './context/TableProvider';

import selectionReducer, {
  CLEAR,
  SELECT,
  UNSELECT,
} from './state/selectionReducer';

import TableHeader from './TableHeader';
import TableBody from './TableBody';

// [fix] FDS-284: uniqueIdAttribute is always derived as undefined even though is correctly passed
// NOTE: we could have an workaround by adding `number` to this list, but that would have not resolved the real bug.
const UUID_PRIORITY_KEYS = ['eid', 'uuid', 'id', 'sys_date_created', 'number'];

const inferUniqueID = (objectKeys) => {
  for (const key of UUID_PRIORITY_KEYS) {
    if (objectKeys.includes(key)) {
      return key;
    }
  }
  return undefined;
};

const inferDataDisplay = (data) =>
  Array.isArray(data) && data.length > 0
    ? Object.entries(data[0]).map(([attribute, value]) => {
        const dataType = typeof value;
        const column = {
          attribute,
          label: attribute,
          module: dataType,
        };

        switch (dataType) {
          case 'boolean':
            column.module = 'checkbox';
            break;
          case 'array':
            column.module = 'json';
            break;
          case 'object':
            column.module = 'json';
            break;
          default:
            column.module = 'text';
            break;
        }

        return column;
      })
    : undefined;

const TableBase = ({
  actions,
  data,
  dataConfig,
  dataDisplay,
  onAction,
  selections,
  uniqueIdAttribute,
  ...rest
}) => {
  // Row selection
  const isRowSelectable = Boolean(selections);
  const maxSelection = isRowSelectable ? selections?.max || 0 : 0;

  // Select all is not available when a max selection is greater than 0
  const isSelectAll = !maxSelection && selections?.UNSAFE_isSelectAll;

  const [selection, updateSelection] = useReducer(selectionReducer, []);

  // get a list of record IDs
  const recordIDs = useMemo(
    () =>
      data && uniqueIdAttribute
        ? data.map((record) => record[uniqueIdAttribute])
        : [],
    [data, uniqueIdAttribute]
  );

  /**
   * Select row(s)
   *
   * @param {String|Array[String]} rowID
   */
  const select = useCallback(
    (rowID) => {
      if (isRowSelectable && maxSelection && selection.length < maxSelection) {
        updateSelection({
          payload: rowID,
          type: SELECT,
        });

        onAction &&
          onAction({ name: 'select', selection: [...selection, rowID] });
      }
    },
    [isRowSelectable, maxSelection, onAction, selection]
  );

  /**
   * Unselect row(s)
   *
   * @param {String|Array[String]} rowID
   */
  const unselect = useCallback(
    (rowID) => {
      updateSelection({
        payload: rowID,
        type: UNSELECT,
      });

      onAction &&
        onAction({ name: 'unselect', selection: [...selection, rowID] });
    },
    [onAction, selection]
  );

  const clearSelection = useCallback(() => {
    updateSelection({ type: CLEAR });

    onAction && onAction({ name: 'selection.clear' });
  }, [onAction]);

  const selectAll = useCallback(() => {
    if (!maxSelection && isSelectAll) {
      updateSelection({
        payload: recordIDs,
        type: SELECT,
      });

      onAction && onAction({ name: 'selection.all', selection: recordIDs });
    }
  }, [isSelectAll, maxSelection, onAction, recordIDs]);

  // TODO: When we officially deprecate dataDisplay, the second or case can go away
  const display =
    dataDisplay ||
    dataConfig?.display ||
    // If no dataDisplay is being set, we should try to infer the type from values on the first object in `data` and then create a dataDisplay config with module types
    inferDataDisplay(data);

  // [fix] FDS-284: uniqueIdAttribute is always derived as undefined even though is correctly passed
  const uniqueID = uniqueIdAttribute
    ? uniqueIdAttribute
    : data
    ? inferUniqueID(Object.keys(data[0]))
    : undefined;

  // // FDS-142: new action props
  let actionButtonMenuIndex = actions?.actionButtonMenuIndex;
  let modules = actions?.modules;
  const resolveRecordActions = actions?.resolveRecordActions;

  // old action props
  const unwantedActions = dataConfig?.actions;
  if (unwantedActions) {
    modules = unwantedActions;
    // eslint-disable-next-line no-console -- we need to let developers know about this error
    console.warn(
      'Prop "dataConfig.actions" has been deprecated. Actions have been moved to the root of the Table component as their own prop.'
    );
  }

  const unwantedActionButtonIndex = dataConfig?.actionButtonMenuIndex;
  if (unwantedActionButtonIndex) {
    actionButtonMenuIndex = unwantedActionButtonIndex;
    // eslint-disable-next-line no-console -- we need to let developers know about this error
    console.warn(
      'Prop "dataConfig.actionButtonIndex" has been deprecated. Actions have been moved to the root of the Table component as their own prop.'
    );
  }

  const unwantedDataConfig = dataConfig;
  if (unwantedDataConfig) {
    // eslint-disable-next-line no-console -- we need to let developers know about this error
    console.warn(
      'Parameters inside the dataConfig object have been moved to different locations. Please see the `actions` and `dataDisplay` props instead. This prop will no longer work in the next minor release.'
    );
  }

  let columnCount = display?.length;

  if (modules?.length) {
    columnCount++;
  }

  if (isRowSelectable) {
    columnCount++;
  }

  return (
    <TableProvider
      value={{
        actionButtonMenuIndex,
        clearSelection,
        data,
        dataDisplay: display,
        isRowSelectable,
        isSelectAll,
        maxSelection,
        modules,
        onAction,
        recordIDs,
        resolveRecordActions,
        select,
        selectAll,
        selection,
        uniqueIdAttribute: uniqueID,
        unselect,
      }}
      {...rest}
    >
      <table
        className={styles.Table}
        style={{
          gridTemplateColumns: `repeat(${columnCount}, auto)`,
        }}
      >
        <TableHeader />
        <TableBody />
      </table>
    </TableProvider>
  );
};

TableBase.propTypes = TABLE_SHAPE;

export default TableBase;
