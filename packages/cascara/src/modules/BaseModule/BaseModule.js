import React from 'react';
import pt from 'prop-types';

import ErrorBoundary from '../../private/ErrorBoundary';
import styles from '../DataModule.module.scss';

const propTypes = {
  attribute: pt.string,
  children: pt.oneOfType([pt.arrayOf(pt.node), pt.node]),
  isLabeled: pt.bool,
  label: pt.node,
};

const BaseModule = ({ attribute, children, isLabeled, label, ...rest }) => {
  const LabelTag = isLabeled ? 'label' : 'span';

  return (
    <ErrorBoundary>
      <LabelTag htmlFor={isLabeled ? attribute || label : undefined}>
        {label && isLabeled && (
          <span className={styles.LabelText}>{label || attribute}</span>
        )}
        {children}
      </LabelTag>
    </ErrorBoundary>
  );
};

BaseModule.propTypes = propTypes;

export default BaseModule;
