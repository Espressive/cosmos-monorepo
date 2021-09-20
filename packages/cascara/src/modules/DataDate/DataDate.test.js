import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateDate from './DataDate';
import { DisplayDataDate } from './DataDate.fixture';

import fixtures from '../helpers/ModuleTestHelper.fixture';

const { checkbox: ModuleTestWrapper } = fixtures;

const VALUE = '2021-07-24';
const EXPECTED_VALUE_TYPE = 'string';
const DATA_DISPLAY = [
  {
    attribute: 'date',
    label: 'Date',
    module: 'date',
  },
];
const DATA = { date: VALUE };

describe('Input Date', () => {
  // without ModuleSandbox will render the property information into a span
  describe('default', () => {
    const testId = 'default';

    // We need a place to store the view for snapshot testing. This is not required when we are using `screen` directly from RTL.
    let view;

    beforeEach(() => {
      // Set the render container to our `view` so it is in scope for the snapshot test
      view = render(<DateDate data-testid={testId} />).container;
    });

    test('renders without any props', () => {
      expect(view).toMatchSnapshot();
    });

    test('renders a <span> by default', () => {
      const input = screen.getByTestId(testId);
      // Make sure the actual DOM element is not render an input
      expect(input.tagName).toMatch('SPAN');
    });
  });

  describe('editing', () => {
    // specifying ModuleSandbox will have the flag to render our input date field
    const testId = 'default';
    beforeEach(() =>
      render(
        <DisplayDataDate data-testid={testId} isEditing value={'2021-07-24'} />
      )
    );
    test('renders a <input date> by default', () => {
      const input = screen.getByTestId(testId);
      // Check that we also use the correct type for accessibility
      expect(input).toHaveAttribute('type', 'date');
      expect(input).toHaveValue(VALUE);
    });

    test('change value', () => {
      const newDate = '2021-07-23';
      const input = screen.getByTestId(testId);
      userEvent.type(input, newDate);
      expect(input).toHaveValue(newDate);
    });
  });

  // describe('data type', () => {
  //   test('it returns the correct data type', async () => {
  //     const handleFormAction = jest
  //       .fn()
  //       .mockImplementation((action, formData) => true);

  //     render(
  //       <ModuleTestWrapper
  //         data={DATA}
  //         dataDisplay={DATA_DISPLAY}
  //         isInitialEditing
  //         onAction={handleFormAction}
  //       />
  //     );

  //     await waitFor(() => screen.findByText('Date'));

  //     const dateInput = screen.getByText('Date');
  //     userEvent.click(dateInput);

  //     const saveButton = screen.getByRole('button', { name: 'Save' });
  //     userEvent.click(saveButton);

  //     expect(handleFormAction.mock.calls[0][0]).toEqual({ name: 'edit.save' });
  //     expect(handleFormAction.mock.calls[0][1]).toEqual({ date: VALUE });
  //     expect(typeof handleFormAction.mock.calls[0][1].date).toEqual(
  //       EXPECTED_VALUE_TYPE
  //     );
  //   });
  // });
});
