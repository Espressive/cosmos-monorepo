import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'mutationobserver-shim';

import cosmosFixtures, {
  dataResults,
} from '../fixtures/UserExperience.fixture';

const { withoutActionBar, withOnAction, withoutActions } = cosmosFixtures;

describe('Table UX', () => {
  test('custom actions', () => {
    const onAction = jest.fn();

    render(withoutActionBar({ onAction }));

    const table = within(screen.getByRole('table'));
    const [, tableBody] = table.getAllByRole('rowgroup');
    const [firstRow] = within(tableBody).getAllByRole('row');

    const viewButton = within(firstRow).getByRole('button', {
      name: 'View',
    });

    userEvent.click(viewButton);

    expect(onAction.mock.calls[0][0]).toHaveAttribute('name', 'viewInFAQ');
    expect(onAction.mock.calls[0][1]).toEqual(dataResults[0]);
  });

  test('successful edit', async () => {
    const testEmail = 'engineering@espressive.com';
    const onAction = jest.fn();

    render(withOnAction({ onAction }));

    const table = within(screen.getByRole('table'));
    const [, tableBody] = table.getAllByRole('rowgroup');
    const [firstRow] = within(tableBody).getAllByRole('row');

    const editButton = within(firstRow).getByRole('button', {
      name: 'Edit',
    });

    userEvent.click(editButton);

    userEvent.clear(
      screen.getByRole('textbox', {
        container: firstRow,
        name: 'Created by',
      })
    );
    userEvent.type(
      screen.getByRole('textbox', {
        container: firstRow,
        name: 'Created by',
      }),
      testEmail
    );

    userEvent.click(
      screen.getByRole('button', {
        container: firstRow,
        name: 'Save',
      })
    );

    await waitFor(() => expect(onAction).toHaveBeenCalledTimes(2));

    expect(onAction.mock.calls[0][0]).toEqual({ name: 'edit.start' });
    expect(onAction.mock.calls[0][1]).toEqual(dataResults[0]);

    // Lastly, the table emits the edit.save event
    expect(onAction.mock.calls[1][0]).toEqual({ name: 'edit.save' });
    expect(onAction.mock.calls[1][1]).toEqual({
      ...dataResults[0],
      created_in_elc: 'true',
      is_protected: 'true',
      sys_created_by: testEmail,
    });
  });

  test('canceled edit', async () => {
    const jsdomConfirm = window.confirm; // remember the jsdom confirm
    window.confirm = () => true; // provide an empty implementation for window.confirm

    const testEmail = 'engineering@espressive.com';
    const onAction = jest.fn();

    render(withOnAction({ onAction }));

    const table = within(screen.getByRole('table'));
    const [, tableBody] = table.getAllByRole('rowgroup');
    const [firstRow] = within(tableBody).getAllByRole('row');

    const editButton = within(firstRow).getByRole('button', {
      name: 'Edit',
    });

    userEvent.click(editButton);

    userEvent.clear(
      screen.getByRole('textbox', {
        container: firstRow,
        name: 'Created by',
      })
    );
    userEvent.type(
      screen.getByRole('textbox', {
        container: firstRow,
        name: 'Created by',
      }),
      testEmail
    );

    userEvent.click(
      screen.getByRole('button', {
        container: firstRow,
        name: 'Cancel',
      })
    );

    await waitFor(() => expect(onAction).toHaveBeenCalledTimes(2));

    expect(onAction.mock.calls[0][0]).toEqual({ name: 'edit.start' });
    expect(onAction.mock.calls[0][1]).toEqual(dataResults[0]);

    // Lastly, the table emits the edit.save event
    expect(onAction.mock.calls[1][0]).toEqual({ name: 'edit.cancel' });
    expect(onAction.mock.calls[1][1]).toEqual(dataResults[0]);

    window.confirm = jsdomConfirm; // restore the jsdom confirm
  });

  // FDS-249: all modules need to present the aria-label on the inputs
  //
  // In table, the isLabeled prop is always set to false, hence no label
  // tags must be rendered. This test looks for label tags and expects
  // to find none.
  test('makes sure there is only an aria-label if there is no label linked to the input', () => {
    render(withoutActions);
    const labelTags = screen.getByRole('table').querySelector('label');

    expect(labelTags).toBeNull();
  });
});
