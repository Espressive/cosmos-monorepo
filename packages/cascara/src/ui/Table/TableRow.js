import React, { useContext } from 'react';
import pt from 'prop-types';
import styles from './Table.module.scss';

import ErrorBoundary from '../../private/ErrorBoundary';
import RowProvider from './context/RowProvider';
import { ModuleContext } from '../../modules/context';

import ActionsMenu from '../../private/ActionsMenu';

// todo @manu: let's document this one
// https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md

import ModuleError from '../../modules/ModuleError';

import { actionModules, dataModules } from '../../modules/ModuleKeys';

const actionModuleOptions = Object.keys(actionModules);
const dataModuleOptions = Object.keys(dataModules);

const propTypes = {
  config: pt.shape({
    columns: pt.arrayOf(
      pt.oneOfType([
        pt.shape({
          module: pt.oneOf(dataModuleOptions).isRequired,
        }).isRequired,
      ])
    ),
    id: pt.oneOfType([pt.string, pt.number]),
  }),
  record: pt.shape({}),
};

const TableRow = ({ config = {}, record = {} }) => {
  const { id, columns } = config;
  const {
    resolveRecordActions,
    actionButtonMenuIndex = 0,
    modules: userDefinedModules = [],
  } = useContext(ModuleContext);

  // FDS-142: If a resolver is passed, get actions from it
  const actions = resolveRecordActions
    ? resolveRecordActions(record, userDefinedModules)
    : userDefinedModules; // otherwise continue as normal

  const outsideButtonActions = [];
  const insideButtonActions = [];
  actions
    .filter(({ module }) => module === 'button')
    .map((action, index) =>
      index >= actionButtonMenuIndex
        ? insideButtonActions.push(action)
        : outsideButtonActions.push(action)
    );
  const specialActions = actions.filter(({ module }) => module !== 'button');
  const outsideActions = [...specialActions, ...outsideButtonActions];

  const renderActionModule = (action, index) => {
    const { module, ...rest } = action;
    const key = `${id}.${module}.${rest.content || module}.${index}`;
    const Action = actionModules[module];

    return Action ? (
      <Action key={key} {...rest} />
    ) : (
      <ModuleError
        key={key}
        moduleName={module}
        moduleOptions={actionModuleOptions}
      />
    );
  };

  const rowActions = (
    <td className={styles.CellActions} key={`${id}-actionbar`}>
      {outsideActions.map(renderActionModule)}
      {insideButtonActions.length ? (
        <ActionsMenu actions={insideButtonActions} />
      ) : null}
    </td>
  );

  const rowCells = columns.map((column) => {
    const { module, isLabeled, ...rest } = column;

    const Module = dataModules[module];
    const moduleValue = record[column.attribute];

    return (
      <td className={styles.Cell} key={column.attribute}>
        {Module ? (
          <Module {...rest} isLabeled={false} value={moduleValue} />
        ) : (
          <ModuleError moduleName={module} moduleOptions={dataModuleOptions} />
        )}
      </td>
    );
  });

  if (userDefinedModules.length) {
    rowCells.push(rowActions);
  }

  return (
    <ErrorBoundary>
      <RowProvider value={{ record }}>
        <tr className={styles.Row} key={id}>
          {rowCells}
        </tr>
      </RowProvider>
    </ErrorBoundary>
  );
};

TableRow.propTypes = propTypes;

export default TableRow;
