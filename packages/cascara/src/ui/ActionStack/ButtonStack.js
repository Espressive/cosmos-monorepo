import React from 'react';
import pt from 'prop-types';
import { Button } from '@espressive/cascara';
import { ACTION_SHAPE } from './__globals';

const propTypes = {
  actions: pt.arrayOf(ACTION_SHAPE),
};

const ButtonStack = ({ actions }) => {
  return actions?.map(({ label, ...rest }, i) => (
    <Button {...rest} content={label} key={label + i} />
  ));
};

ButtonStack.propTypes = propTypes;

export default ButtonStack;