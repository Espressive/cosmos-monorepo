import React, { useContext } from 'react';
import { Input } from 'reakit/Input';
import pt from 'prop-types';

import BaseModule from '../BaseModule';
import { ModuleContext } from '../context';
import styles from '../DataModule.module.scss';

import { getConditionalLabelProps } from '../../lib/getConditionalLabelProps';

const propTypes = {
  /** A module can have an Attribute, which will be used as form field name */
  attribute: pt.string,
  /** A Module can be defined to not present an editing state */
  isEditable: pt.bool,
  /** Presents the input without a label. NOT USER CONFIGURABLE */
  isLabeled: pt.bool,
  /** A Module needs to have a unique label relative to its context */
  label: pt.string,
  /** Select module can have selectable options */
  options: pt.arrayOf(
    pt.shape({
      key: pt.string,
      text: pt.oneOfType([pt.string, pt.number]),
      value: pt.oneOfType([pt.string, pt.number]),
    })
  ),
  /** A Module can have a value */
  value: pt.string,
};

const DataSelect = ({
  attribute,
  isEditable = true,
  isLabeled = true,
  label,
  options,
  value,
  ...rest
}) => {
  const { isEditing, formMethods } = useContext(ModuleContext);

  const conditionalLabelProps = getConditionalLabelProps(label, isLabeled);

  const renderEditing = (
    <Input
      {...conditionalLabelProps}
      {...rest}
      as='select'
      className={styles.Input}
      defaultValue={value}
      id={attribute || label}
      name={attribute || label}
      ref={formMethods?.register}
    >
      {options ? (
        options.map((option) => (
          <option key={option.value} {...option}>
            {option.label || option.value}
          </option>
        ))
      ) : (
        <option value={value}>{value}</option>
      )}
    </Input>
  );

  const renderDisplay = (
    <span {...rest} aria-label={label} className={styles.Input}>
      {value}
    </span>
  );

  // Do not render an editable input if the module is not editable
  return (
    <BaseModule attribute={attribute} isLabeled={isLabeled} label={label}>
      <div className={styles.Select}>
        {isEditing && isEditable ? renderEditing : renderDisplay}
      </div>
    </BaseModule>
  );
};

DataSelect.propTypes = propTypes;

export { propTypes };
export default DataSelect;
