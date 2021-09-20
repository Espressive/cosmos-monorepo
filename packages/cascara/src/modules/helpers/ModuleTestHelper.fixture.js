import React from 'react';

import Form from '../../ui/Form/Form';

const ACTIONS = {
  modules: [
    {
      module: 'edit',
    },
  ],
};

const DATA_DISPLAY = [
  {
    attribute: 'checkbox',
    label: 'Checkbox',
    module: 'checkbox',
  },
  {
    attribute: 'date',
    label: 'Date',
    module: 'date',
  },
  // {
  //   attribute: 'dateMonth',
  //   label: 'Date Month',
  //   module: 'dateMonth',
  // },
  {
    attribute: 'dateTime',
    label: 'Date Time',
    module: 'datetime',
  },
  {
    attribute: 'email',
    label: 'Email',
    module: 'email',
  },
  {
    attribute: 'json',
    label: 'JSON',
    module: 'json',
  },
  {
    attribute: 'number',
    label: 'Number',
    module: 'number',
  },
  {
    attribute: 'radio',
    label: 'Radio',
    module: 'radio',
  },
  {
    attribute: 'select',
    label: 'Select',
    module: 'select',
    options: [],
  },
  {
    attribute: 'text',
    label: 'Text',
    module: 'text',
  },
  {
    attribute: 'textarea',
    label: 'Textarea',
    module: 'textarea',
  },
];

const DATA = [
  {
    checkbox: true,
    date: '2021-09-18T02:57:33.513Z',
    dateMonth: '2021-07',
    dateTime: '2018-06-07T00:00',
    email: 'engineering@espressive.com',
    json: {
      test: 'json',
    },
    number: 1,
    radio: true,
    select: '',
    text: 'Test',
    textarea: 'A sentence with 5 words',
  },
];

const handleFormAction = console;

const ModuleTestWrapper = ({
  actions = ACTIONS,
  dataDisplay = DATA_DISPLAY,
  data = DATA,
  onAction = handleFormAction,
}) => (
  <Form
    actions={actions}
    data={data}
    dataDisplay={dataDisplay}
    isInitialEditing
    onAction={onAction}
  />
);

export { handleFormAction };
export default {
  checkboxTest: (
    <ModuleTestWrapper
      data={{ checkbox: false }}
      dataDisplay={[DATA_DISPLAY[0]]}
    />
  ),
};
