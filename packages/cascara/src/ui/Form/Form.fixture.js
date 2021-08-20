import React, { useCallback } from 'react';
import faker from 'faker';

import Form from './Form';

// zero is not a valid seed for faker
faker.seed(1);
const data = {
  avatar: faker.image.avatar(),
  country: faker.address.countryCode(),
  date: faker.date.future(),
  department: faker.name.jobArea(),
  eid: faker.random.uuid(),
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
      actionName: 'delete',
      label: 'Delete',
      module: 'button',
    },
    {
      actionName: 'view',
      label: 'View',
      module: 'button',
    },
  ],
};

const dataDisplay = [
  {
    attribute: 'eid',
    isEditable: false,
    label: 'EID',
    module: 'text',
  },
  {
    fields: [
      {
        attribute: 'firstName',
        isEditable: true,
        label: 'First Name',
        module: 'text',
      },
      {
        attribute: 'lastName',
        isEditable: true,
        label: 'Last Name',
        module: 'text',
      },
    ],
    module: 'row',
  },
  {
    attribute: 'homePhone',
    isEditable: true,
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

const BasicForm = (props) => {
  const handleFormAction = useCallback((action, data) => {
    // eslint-ignore-next-line no-console -- we need this to be a developer message
    console.log(`Action: '${action.name}' has been invoked:`);
    // eslint-ignore-next-line no-console -- we need this to be a developer message
    console.table(data);
  }, []);

  return (
    <>
      <h1>Data Only</h1>
      <p>
        A form with structure to display but with no default values will be
        editable by default .
      </p>
      <ul>
        <li>
          <code>actions</code>
        </li>
        <li>
          <code>dataDisplay</code>
        </li>
      </ul>

      <Form {...props} onAction={handleFormAction} />
    </>
  );
};

const DataWithDisplay = (props) => (
  <>
    <h1>Data with display</h1>{' '}
    <p>A form can not be in an editing state initially.</p> <Form {...props} />
  </>
);

const InitialEditing = (props) => (
  <>
    <h1>Initial Editing Form</h1>{' '}
    <p>A form can be in an editing state initially.</p> <Form {...props} />
  </>
);

const LoadingForm = (props) => (
  <>
    <h1>Loading state form</h1>{' '}
    <p>A form can show a loader while the default values are rendered.</p>{' '}
    <Form {...props} />
  </>
);

const EmptyForm = (props) => (
  <>
    <h1>Empty</h1>
    <p>
      If a form does not receive dataDisplay prop as an array with values, the
      Form component will notify there is not data to present.
    </p>{' '}
    <Form {...props} />
  </>
);

// Empty and loading states added
export default {
  dataOnly: (
    <BasicForm
      actions={actions}
      data={{}}
      dataDisplay={dataDisplay}
      isInitialEditing
      name='test-form'
    />
  ),
  dataWithDisplay: (
    <DataWithDisplay
      actions={actions}
      data={data}
      dataDisplay={dataDisplay}
      name='test-form'
    />
  ),
  empty: <EmptyForm actions={actions} data={{}} dataDisplay={[]} />,
  initialEditing: (
    <InitialEditing
      actions={actions}
      data={data}
      dataDisplay={dataDisplay}
      isInitialEditing
      name='test-form'
    />
  ),
  loading: (
    <LoadingForm
      actions={actions}
      data={undefined}
      dataDisplay={dataDisplay}
      name='test-form'
    />
  ),
};
export { dataDisplay };
