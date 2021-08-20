import React from 'react';
import pt from 'prop-types';
import styles from '../Form.module.scss';
import { useForm } from 'react-hook-form';

import { ModuleContext, ModuleProvider } from '../../../modules/context';

const propTypes = {
  children: pt.oneOfType([pt.node, pt.arrayOf(pt.node)]),
  // A form needs to have a name to be accessible
  // see: https://github.com/testing-library/dom-testing-library/issues/474
  name: pt.string.isRequired,
  // A base context value can be passed in
  value: pt.shape({}),
};

const FormProvider = ({ children, value, name, ...props }) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const onSubmit = (data) => {
    return data;
  };

  const mergedValues = {
    ...ModuleContext.defaultValue,
    ...value,
    formMethods,
  };

  return (
    <ModuleProvider value={mergedValues} {...props}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        {children}
      </form>
    </ModuleProvider>
  );
};

FormProvider.propTypes = propTypes;

export default FormProvider;
