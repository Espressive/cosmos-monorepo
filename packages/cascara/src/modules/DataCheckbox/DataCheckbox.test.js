import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// import userEvent from '@testing-library/user-event';

import fixtures, {
  handleFormAction,
} from '../helpers/ModuleTestHelper.fixture';

const { checkboxTest } = fixtures;

describe('datacheckbox', () => {
  test('it returns the correct data type', async () => {
    const log = jest
      .spyOn(handleFormAction, 'log')
      .mockImplementation(() => {});

    render(checkboxTest);

    await waitFor(() => screen.findByRole('checkbox', { name: 'Checkbox' }));

    const checkboxInput = screen.getByRole('checkbox', { name: 'Checkbox' });
    fireEvent.click(checkboxInput);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);

    // console.log('log', log);
    expect(log).toBeCalledWith({ name: 'edit.save' });
    // expect(log.mock.calls[0][1]).toEqual({ checkbox: true });
  });
});
