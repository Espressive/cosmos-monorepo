import React, { useCallback, useContext } from 'react';
import pt from 'prop-types';

import { ModuleContext } from '../../../../modules/context';
import { Button } from 'reakit';
import { Icon } from 'semantic-ui-react';

const propTypes = {
  cancelLabel: pt.string,
  editLabel: pt.string,
  saveLabel: pt.string,
};

const ActionEdit = ({
  cancelLabel = 'Cancel',
  editLabel = 'Edit',
  saveLabel = 'Save',
}) => {
  const {
    isEditing,
    enterEditMode,
    exitEditMode,
    formMethods,
    data,
    onAction,
  } = useContext(ModuleContext);
  const { handleSubmit, formState, reset } = formMethods;
  const { isDirty, isSubmitting } = formState;

  const handleReset = useCallback(() => {
    onAction &&
      onAction(
        // fake target
        {
          name: 'edit.cancel',
        },
        {
          ...data,
        }
      );

    exitEditMode && exitEditMode();
  }, [onAction, exitEditMode, data]);

  const handleCancel = useCallback(() => {
    isDirty
      ? // eslint-disable-next-line no-alert, no-restricted-globals -- required because we are user config global
        confirm('Abandon unsaved changes?') && handleReset()
      : handleReset();
  }, [isDirty, handleReset]);

  const handleEdit = useCallback(() => {
    // FDS-91: We are resetting the form with whatever is in data.
    // We don't know if this is the best way to do it in React.
    reset({ ...data });
    onAction &&
      onAction(
        // fake target
        {
          name: 'edit.start',
        },
        {
          ...data,
        }
      );

    enterEditMode && enterEditMode();
  }, [reset, data, onAction, enterEditMode]);

  const onSubmit = useCallback(
    (incomingData) => {
      onAction &&
        onAction(
          // fake target
          {
            name: 'edit.save',
          },
          {
            ...data,
            ...incomingData,
          }
        );

      exitEditMode && exitEditMode();
    },
    [onAction, exitEditMode, data]
  );

  return isEditing ? (
    <>
      <Button
        aria-label={cancelLabel}
        className='ui negative icon button'
        disabled={isSubmitting}
        onClick={handleCancel}
        type='button'
      >
        <Icon name='delete' />
      </Button>
      <Button
        aria-label={saveLabel}
        className='ui positive icon button'
        disabled={!isDirty || isSubmitting}
        onClick={handleSubmit(onSubmit)}
        type='button'
      >
        <Icon name='check' />
      </Button>
    </>
  ) : (
    <Button
      aria-label={editLabel}
      className='ui basic button'
      onClick={handleEdit}
      type='button'
    >
      {editLabel}
    </Button>
  );
};

ActionEdit.propTypes = propTypes;

export { propTypes };
export default ActionEdit;
