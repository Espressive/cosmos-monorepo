import React, { useCallback, useContext } from 'react';
import pt from 'prop-types';

import { ModuleContext } from '../context';
import { Button } from 'reakit';

const propTypes = {
  /** DEPRECATED: please use 'name' instead */
  actionName: pt.string,
  /** An action needs to have a unique text relative to its context */
  content: pt.string,
  /** PRIVATE: Shows a label */
  isLabeled: pt.bool,
  /** DEPRECATED: please use 'content' instead */
  label: pt.string,
  /** Every action must have a name */
  name: pt.string,
};

const ActionButton = ({ actionName, content, isLabeled = false, ...rest }) => {
  const { isEditing, onAction, record, data } = useContext(ModuleContext);

  // @bje we need to decide if we go for content or label here, both makes no sense
  const { label, ...restWithoutLabel } = rest;

  // do not add aria label if tag is used
  const ariaLabel = isLabeled ? {} : { 'aria-label': label };

  //
  // initially, this was called actionName, but now we ...spread
  // all props into the button. So the correct way of calling it
  // is just 'name'.
  //
  // This is a breaking change. in order to prevent any breakage
  // in the our Apps, we are temporarily deriving it from one if
  // the other is not passed. Once we have the resources to go
  // and update our Apps we will revisit.
  const name = actionName || rest.name;

  // FDS-137: use action name for button name if no content is specified
  const buttonText = content || label || name;

  const handleClick = useCallback(
    ({ currentTarget }) => {
      onAction && onAction(currentTarget, record || data);
    },
    [data, onAction, record]
  );

  return isEditing ? null : (
    <Button
      {...ariaLabel}
      {...restWithoutLabel}
      className='ui basic button'
      name={name}
      onClick={handleClick}
      type='button'
    >
      {buttonText}
    </Button>
  );
};

ActionButton.propTypes = propTypes;

export { propTypes };
export default ActionButton;
