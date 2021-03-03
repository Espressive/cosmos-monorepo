import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'mutationobserver-shim';
import { Provider } from 'reakit';

import Table from './';
import { generateFakeEmployees } from '../../lib/mock/fakeData';

describe('Table', () => {
  //
  // Component tree
  // This test suite addresses the very basics of testing the Table UI.
  //
  // The first test is the snapshot, nothing special.
  //
  // Table actions
  // An extra column is appended if any or both of these are true:
  //
  // a) at least one `action` is specified in `dataConfig.actions` array
  // b) at least one column in the `dataConfig.display` array is editable
  //
  // In either cases, the extra column displays the action modules.
  //
  // The test `row actions` corresponds to condition a, whilst the test
  // `editable records` addresses condition b.
  describe('component tree', () => {
    const whileTheUIisReady = async (miliseconds) =>
      await new Promise((resolve) => setTimeout(resolve, miliseconds));
    const datasetSize = 100;
    const data = generateFakeEmployees(datasetSize);
    const dataConfig = {
      actions: [
        {
          content: 'view',
          'data-testid': 'view',
          isLabeled: false,
          module: 'button',
          name: 'view',
          size: 'small',
        },
        {
          content: 'delete',
          'data-testid': 'delete',
          isLabeled: false,
          module: 'button',
          name: 'delete',
          size: 'small',
        },
        {
          content: 'edit',
          dataTestIDs: {
            cancel: 'edit.cancel',
            edit: 'edit.start',
            save: 'edit.save',
          },
          isLabeled: false,
          module: 'edit',
          name: 'edit',
          size: 'small',
        },
      ],
      display: [
        {
          attribute: 'active',
          'data-testid': 'active',
          isEditable: true,
          isLabeled: false,
          label: 'Active',
          module: 'checkbox',
        },
        {
          attribute: 'eid',
          'data-testid': 'eid',
          isEditable: false,
          isLabeled: false,
          label: 'ID',
          module: 'text',
        },
        {
          attribute: 'email',
          'data-testid': 'email',
          isEditable: true,
          isLabeled: false,
          label: 'Email',
          module: 'email',
        },
        {
          attribute: 'country',
          'data-testid': 'country',
          isEditable: true,
          isLabeled: false,
          label: 'Country',
          module: 'select',
          options: [
            {
              label: 'Argentina',
              value: 'Argentina',
            },
            {
              label: 'Brazil',
              value: 'Brazil',
            },
            {
              label: 'USA',
              value: 'USA',
            },
          ],
        },
        {
          attribute: 'employeeNumber',
          'data-testid': 'employeeNumber',
          isEditable: true,
          isLabeled: false,
          label: 'Employee Number',
          module: 'number',
        },
        {
          attribute: 'fullName',
          'data-testid': 'fullName',
          isEditable: true,
          isLabeled: false,
          label: 'Full Name',
          module: 'text',
        },
        {
          attribute: 'homePhone',
          'data-testid': 'homePhone',
          isEditable: true,
          isLabeled: false,
          label: 'Home Phone',
          module: 'text',
        },
        {
          attribute: 'officePhone',
          'data-testid': 'officePhone',
          isEditable: true,
          isLabeled: false,
          label: 'Office Phone',
          module: 'text',
        },
        {
          attribute: 'title',
          'data-testid': 'title',
          isEditable: true,
          isLabeled: false,
          label: 'Title',
          module: 'text',
        },
      ],
    };

    test('snapshot test', () => {
      const view = render(
        <Provider>
          <Table
            data={data}
            dataConfig={dataConfig}
            uniqueIdAttribute={'eid'}
          />
        </Provider>
      ).container;

      expect(view).toMatchSnapshot();
    });

    //
    // The markup generated by the table must match the dataset characteristics.
    //
    // All column definitions in this test suite `dataConfig.display` have a `data-testid`
    // attribute which is used here to do a simple test:
    //
    //   Does the number of (found) testIDs match the result of multiplying `datasetSize`
    //   by the number of columns in `dataConfig.display`?
    //
    //
    test('table markup vs. dataset', () => {
      const { display = [] } = dataConfig;
      render(
        <Table data={data} dataConfig={dataConfig} uniqueIdAttribute={'eid'} />
      );

      Object.values(
        display
          .map((column) => column['data-testid'])
          .reduce((allQueries, testId) => {
            allQueries[testId] = screen.getAllByTestId(testId);

            return allQueries;
          }, {})
      ).forEach((foundItems) => expect(foundItems).toHaveLength(datasetSize));
    });

    test('without row actions', () => {
      const view = render(
        <Provider>
          <Table
            data={data}
            dataConfig={{
              ...dataConfig,
              actions: [],
            }}
            uniqueIdAttribute={'eid'}
          />
        </Provider>
      ).container;

      expect(view).toMatchSnapshot();
    });

    //
    // Actions and onAction.
    //
    // When emitted, the `onAction` event contains two arguments, the first
    // one being the element that was clicked, the second is the data of the
    // row that was clicked.
    //
    // This test validates the Actions specified in `dataConfig.actions`.
    test('with row actions', () => {
      const onAction = jest.fn();

      render(
        <Table
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const allEditButtons = screen.getAllByTestId('edit.start');
      expect(allEditButtons).toHaveLength(datasetSize);

      const editButton = screen.getAllByTestId('view');
      expect(editButton).toBeTruthy();

      fireEvent(
        editButton[0],
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      expect(onAction).toBeCalledWith(
        expect.any(Object),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: 'Hayden.Zieme@espressive.com',
          employeeNumber: 93912,
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );
    });

    //
    // Actions wrapped in an ActionsMenu
    test('it renders no <ActionsMenu /> if actionButtonMenuIndex equals button actions number', () => {
      const onAction = jest.fn();

      render(
        <Table
          data={data}
          dataConfig={{
            ...dataConfig,
            actionButtonMenuIndex: 2,
          }}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const allEditButtons = screen.getAllByTestId('edit.start');
      expect(allEditButtons).toHaveLength(datasetSize);

      const allViewButtons = screen.getAllByTestId('view');
      expect(allViewButtons).toHaveLength(datasetSize);

      const allDeleteButtons = screen.getAllByTestId('delete');
      expect(allDeleteButtons).toHaveLength(datasetSize);

      const allMeatBallButtons = screen.queryAllByText('...');
      expect(allMeatBallButtons).toHaveLength(0);
    });

    //
    // Actions wrapped in an ActionsMenu
    test('it renders <ActionsMenu /> if actionButtonMenuIndex is less than the button actions number', () => {
      const onAction = jest.fn();

      render(
        <Table
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const allEditButtons = screen.getAllByTestId('edit.start');
      expect(allEditButtons).toHaveLength(datasetSize);

      const allViewButtons = screen.getAllByTestId('view');
      expect(allViewButtons).toHaveLength(datasetSize);

      const allDeleteButtons = screen.getAllByTestId('delete');
      expect(allDeleteButtons).toHaveLength(datasetSize);

      const allMeatBallButtons = screen.queryAllByText('⋯');
      expect(allMeatBallButtons).toHaveLength(datasetSize);
    });

    //
    // Editable records and onAction.
    //
    // The table emmits certain events depending on the actions taken by the User.
    // In this scenario, the user enters the edit mode, updates the email and clicks the save button.
    //
    // This test validates that:
    //
    // 1.- the events are actualy emitted by the Table
    // 2.- the data reflects the changes made by the user
    // 3.- the number of buttons present in each case.
    test('editable records', async (done) => {
      const testEmail = 'engineering@espressive.com';
      const onAction = jest.fn();

      render(
        <Table
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const editButton = screen.getAllByTestId('edit.start');

      // Enter edit mode
      fireEvent(
        editButton[0],
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      await whileTheUIisReady(100);

      const cancelButton = screen.getByTestId('edit.cancel');
      const saveButton = screen.getByTestId('edit.save');
      const emailField = screen.getAllByTestId('email');

      expect(cancelButton).toBeTruthy();
      expect(saveButton).toBeTruthy();
      expect(emailField).toBeTruthy();

      // we need to delete the current contents
      const userEventCommandList = 'Hayden.Zieme@espressive.com'
        .split('')
        .reduce((commands) => `${commands}{backspace}`, '');

      userEvent.type(emailField[0], `${userEventCommandList}${testEmail}`);

      await whileTheUIisReady(100);

      fireEvent(
        saveButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      await whileTheUIisReady(100);

      // The table first reacted with the edit.start event
      expect(onAction).toBeCalledWith(
        expect.objectContaining({
          name: 'edit.start', // this is the name of the action (assigned by Cascara)
        }),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: 'Hayden.Zieme@espressive.com',
          employeeNumber: 93912,
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );

      // Lastly, the table emits the edit.save event
      expect(onAction).toHaveBeenLastCalledWith(
        expect.objectContaining({
          name: 'edit.save',
        }),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: testEmail,
          employeeNumber: '93912', // todo @manu: make sure the data is not touched!!!
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );

      done();
    });

    //
    // Cancelling the edition of a record.
    //
    // Upon exiting the edit mode via the cancel button, the Table must have emitted these events:
    //
    // edit.start - when clicking the edit button
    // edit.cancel - when clicking the cancel button
    //
    // This test validates the events are actualy emitted by the Table, as well
    // as the number of buttons present in each case.
    test('cancelling record edition', () => {
      const onAction = jest.fn();

      render(
        <Table
          data={data}
          dataConfig={dataConfig}
          onAction={onAction}
          uniqueIdAttribute={'eid'}
        />
      );

      const editButton = screen.getAllByTestId('edit.start');

      fireEvent(
        editButton[0],
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      expect(onAction).toBeCalledWith(
        expect.any(Object),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: 'Hayden.Zieme@espressive.com',
          employeeNumber: 93912,
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );

      const cancelButton = screen.getByTestId('edit.cancel');
      const saveButton = screen.getByTestId('edit.save');

      expect(cancelButton).toBeTruthy();
      expect(saveButton).toBeTruthy();

      fireEvent(
        cancelButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      expect(onAction).toBeCalledWith(
        expect.any(Object),
        expect.objectContaining({
          active: true,
          country: 'Argentina',
          eid: '024f2316-265a-46e8-965a-837e308ae678',
          email: 'Hayden.Zieme@espressive.com',
          employeeNumber: 93912,
          fullName: 'Hayden Zieme',
          homePhone: '887.983.0658',
          officePhone: '(980) 802-1086 x05469',
          title: 'District Operations Officer',
        })
      );

      const saveButtons = screen.getAllByTestId('edit.start');
      expect(saveButtons).toHaveLength(datasetSize);
    });

    test('actions without onAction handler', () => {
      render(
        <Table data={data} dataConfig={dataConfig} uniqueIdAttribute={'eid'} />
      );

      const allEditButtons = screen.getAllByTestId('edit.start');
      expect(allEditButtons).toHaveLength(datasetSize);

      const editButton = screen.getAllByTestId('view');
      expect(editButton).toBeTruthy();

      fireEvent(
        editButton[0],
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );
    });

    // eslint-disable-next-line jest/no-commented-out-tests
    // test('actions with non-existent module', () => {
    //   const wrongModuleName = 'Superdooper';
    //   render(
    //     <Table
    //       data={data}
    //       dataConfig={{
    //         ...dataConfig,
    //         actions: [
    //           {
    //             content: 'view',
    //             'data-testid': 'view',
    //             isLabeled: false,
    //             module: wrongModuleName,
    //             name: 'view',
    //             size: 'small',
    //           },
    //         ],
    //       }}
    //       uniqueIdAttribute={'eid'}
    //     />
    //   );

    //   const moduleError = screen.findByText(
    //     `${wrongModuleName} is not a valid value for module. Try using one of [button, edit]`
    //   );

    //   expect(moduleError).toBeTruthy();
    // });

    // eslint-disable-next-line jest/no-commented-out-tests
    // test('columns with non-existent module', () => {
    //   const wrongModuleName = 'Superdooper';
    //   render(
    //     <Table
    //       data={data}
    //       dataConfig={{
    //         ...dataConfig,
    //         display: [
    //           {
    //             attribute: 'active',
    //             'data-testid': 'active',
    //             isEditable: true,
    //             isLabeled: false,
    //             label: 'Active',
    //             module: wrongModuleName,
    //           },
    //         ],
    //       }}
    //       uniqueIdAttribute={'eid'}
    //     />
    //   );

    //   const moduleError = screen.findByText(
    //     `${wrongModuleName} is not a valid value for module. Try using one of [button, edit]`
    //   );

    //   expect(moduleError).toBeTruthy();
    // });
  });
});
