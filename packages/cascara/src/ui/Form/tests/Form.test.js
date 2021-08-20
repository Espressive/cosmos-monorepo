import React from 'react';
import faker from 'faker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'mutationobserver-shim';

import cosmosFixtures, {
  dataDisplay as fixtDataDisplay,
} from '../Form.fixture';
import Form from '..';

const { initialEditing } = cosmosFixtures;
const formFields = fixtDataDisplay.reduce((formFields, item) => {
  if (item.module === 'row') {
    const rowFields = item?.fields;

    formFields.push(...rowFields);
  } else {
    formFields.push(item);
  }

  return formFields;
}, []);

faker.seed(1);

describe('Form', () => {
  const safeDate = new Date('2021-11-02T22:22:33.405Z');
  const data = {
    avatar: faker.image.avatar(),
    country: faker.address.countryCode(),
    date: safeDate,
    department: faker.name.jobArea(),
    eid: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    homePhone: faker.phone.phoneNumber(),
    lastName: faker.name.lastName(),
    officePhone: faker.phone.phoneNumber(),
    title: faker.name.jobTitle(),
  };

  const actions = {
    modules: [
      {
        module: 'edit',
      },
      {
        label: 'Delete',
        module: 'button',
        name: 'delete',
        size: 'small',
      },
    ],
  };

  const dataDisplay = [
    {
      attribute: 'eid',
      label: 'EID',
      module: 'text',
    },
    {
      fields: [
        {
          attribute: 'firstName',
          label: 'First Name',
          module: 'text',
        },
        {
          attribute: 'lastName',
          label: 'Last Name',
          module: 'text',
        },
        {
          attribute: 'officePhone',
          label: 'Office Phone',
          module: 'text',
        },
      ],
      module: 'row',
      ratio: [1, 1, 2],
    },
    {
      attribute: 'homePhone',
      label: 'Home Phone',
      module: 'text',
    },
    {
      fields: [
        {
          attribute: 'title',
          isEditable: false,
          label: 'Title',
          module: 'text',
        },
        {
          attribute: 'department',
          isEditable: false,
          label: 'Department',
          module: 'text',
        },
        {
          attribute: 'country',
          isEditable: false,
          label: 'Country',
          module: 'text',
        },
      ],
      module: 'row',
    },
  ];

  let view;

  beforeAll(() => {});

  test('snapshot test', () => {
    view = render(
      <Form actions={actions} data={data} dataDisplay={dataDisplay} />
    ).container;
    // updated: Set loading and empty states
    expect(view).toMatchSnapshot();
  });

  test('component tree', async () => {
    render(<Form actions={actions} data={data} dataDisplay={dataDisplay} />);

    const eid = await screen.findByText('EID');
    const firstName = await screen.findByText('First Name');
    const lastName = await screen.findByText('Last Name');
    const homePhone = await screen.findByText('Home Phone');
    const officePhone = await screen.findByText('Office Phone');
    const title = await screen.findByText('Title');
    const department = await screen.findByText('Department');
    const country = await screen.findByText('Country');

    const editButton = await screen.findByRole('button', { name: 'Edit' });
    const deleteButton = await screen.findByRole('button', { name: 'Delete' });

    expect(eid).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(homePhone).toBeInTheDocument();
    expect(officePhone).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(department).toBeInTheDocument();
    expect(country).toBeInTheDocument();

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test('it starts in edit mode when isInitialEditing is true', async () => {
    render(
      <Form
        actions={actions}
        data={data}
        dataDisplay={dataDisplay}
        isInitialEditing
      />
    );

    const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
    const saveButton = await screen.findByRole('button', { name: 'Save' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    const editButton = screen.queryByRole('button', { name: 'Edit' });
    expect(editButton).not.toBeInTheDocument();
  });

  test('general flow: View Mode -> Edit Mode -> Save Action -> View Mode', async () => {
    const onAction = jest.fn();

    render(
      <Form
        actions={actions}
        data={data}
        dataDisplay={dataDisplay}
        onAction={onAction}
      />
    );

    // make sure we are in view mode
    let editButton = await screen.findByRole('button', { name: 'Edit' });
    expect(editButton).toBeInTheDocument();

    // enter edit mode
    userEvent.click(editButton);

    // make sure we are in edit mode
    let cancelButton = await screen.findByRole('button', { name: 'Cancel' });
    let saveButton = await screen.findByRole('button', { name: 'Save' });
    editButton = screen.queryByRole('button', { name: 'Edit' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(editButton).not.toBeInTheDocument();

    // save button should be disabled when form is pristine
    expect(saveButton).toBeDisabled();

    // edit some data
    const firstName = await screen.findByLabelText('First Name');
    expect(firstName).toBeInTheDocument();

    userEvent.type(firstName, 'nio');

    saveButton = screen.queryByRole('button', { name: 'Save' });
    expect(saveButton).not.toBeDisabled();

    // Save action
    userEvent.click(saveButton);

    // make sure we are back to view mode
    saveButton = await screen.findByRole('button', { name: 'Save' });
    editButton = screen.queryByRole('button', { name: 'Edit' });
    cancelButton = screen.queryByRole('button', { name: 'Cancel' });

    expect(cancelButton).not.toBeInTheDocument();
    expect(saveButton).not.toBeInTheDocument();
    expect(editButton).toBeInTheDocument();

    // check that onAction event was triggered
    expect(onAction).toHaveBeenCalledTimes(2);

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'edit.start',
      }),
      expect.objectContaining(data)
    );

    // check that the data is actually updated in the event
    expect(onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        name: 'edit.save',
      }),
      expect.objectContaining({
        ...data,
        firstName: `${data.firstName}nio`,
      })
    );
  });

  test('onAction events', async () => {
    const onAction = jest.fn();

    render(
      <Form
        actions={actions}
        data={data}
        dataDisplay={dataDisplay}
        onAction={onAction}
      />
    );

    // verify buttons are there
    const deleteButton = await screen.findByRole('button', { name: 'Delete' });
    const editButton = await screen.findByRole('button', { name: 'Edit' });

    expect(deleteButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();

    // enter edit mode
    userEvent.click(deleteButton);

    // check that onAction event was triggered
    expect(onAction).toHaveBeenCalled();
  });

  // FDS-249: all modules need to present the aria-label on the inputs
  //
  // In Form, the isLabeled prop is always set to true in modules, hence the label
  // tags must be rendered. This test looks for label tags and expects
  // to find one for each Form field.
  test('makes sure there is only an aria-label if there is no label linked to the input', () => {
    const { container } = render(initialEditing);
    const labelTags = container.querySelector('form').querySelectorAll('label');

    expect(labelTags).toHaveLength(formFields.length);
  });
});
