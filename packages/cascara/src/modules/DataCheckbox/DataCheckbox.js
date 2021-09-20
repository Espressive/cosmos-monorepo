import React, { useContext } from 'react';
import { Checkbox, useCheckboxState } from 'reakit/Checkbox';
import pt from 'prop-types';

import { ModuleContext } from '../context';
import styles from '../DataModule.module.scss';

import ModuleErrorBoundary from '../ModuleErrorBoundary';

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
  value = false,
  ...rest
}) => {
  const { isEditing, formMethods } = useContext(ModuleContext);
  const checkbox = useCheckboxState({ state: Boolean(value) });

  const renderEditing = (
    <label htmlFor={label}>
      <Checkbox
        {...rest}
        {...checkbox}
        className={styles.Input}
        id={label}
        name={attribute || label}
        ref={formMethods?.register}
      />
      {label && isLabeled && <span className={styles.LabelText}>{label}</span>}
    </label>
  );

  const renderDisplay = (
    <span>
      <span
        className={styles.Input}
        data-checked={value ? true : undefined}
        {...rest}
      >
        {value}
      </span>
      {label && isLabeled && <span className={styles.LabelText}>{label}</span>}
    </span>
  );

  // Do not render an editable input if the module is not editable
  return (
    <ModuleErrorBoundary>
      <div className={styles.Checkbox}>
        {isEditing && isEditable ? renderEditing : renderDisplay}
      </div>
    </ModuleErrorBoundary>
  );
};

DataCheckbox.propTypes = propTypes;

export { propTypes };
export default DataCheckbox;
