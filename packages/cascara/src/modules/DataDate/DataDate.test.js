import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateDate from './DataDate';
import { DisplayDataDate } from './DataDate.fixture';

// import fixtures from '../helpers/ModuleTestHelper.fixture';

// const { checkbox: ModuleTestWrapper } = fixtures;

const VALUE = '2021-07-24';

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
});
