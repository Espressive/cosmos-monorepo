import React, { useContext } from 'react';
import { Checkbox, useCheckboxState } from 'reakit/Checkbox';
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
  /** A Module can have a value */
  value: pt.bool,
};

const DataCheckbox = ({
  attribute,
  isEditable = true,
  isLabeled = true,
  label,
  value,
  ...rest
}) => {
  const { isEditing, formMethods } = useContext(ModuleContext);
  const checkbox = useCheckboxState({ state: Boolean(value) });

  const conditionalLabelProps = getConditionalLabelProps(label, isLabeled);

  const renderEditing = (
    <Checkbox
      {...conditionalLabelProps}
      {...rest}
      {...checkbox}
      aria-label={label}
      className={styles.Input}
      defaultValue={value}
      id={attribute || label}
      name={attribute || label}
      ref={formMethods?.register}
      type='checkbox'
    />
  );

  const renderDisplay = (
    <>
      <span
        {...rest}
        aria-label={label}
        className={styles.Input}
        data-checked={value ? true : undefined}
      >
        {value}
      </span>
      {label && isLabeled && <span className={styles.LabelText}>{label}</span>}
    </>
  );

  // Do not render an editable input if the module is not editable
  return (
    <BaseModule attribute={attribute} isLabeled={isLabeled} label={label}>
      <div className={styles.Checkbox}>
        {isEditing && isEditable ? renderEditing : renderDisplay}
      </div>
    </BaseModule>
  );
};

DataCheckbox.propTypes = propTypes;

export { propTypes };
export default DataCheckbox;
