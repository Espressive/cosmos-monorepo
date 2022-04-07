import React, { useCallback } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import pt from '@espressive/prop-types';
import PICKER_TYPE from './_globals';
import locales from '../../shared/locales';

const propTypes = {
  /** date format */
  format: pt.string,
  /** localize picker */
  lang: pt.string,
  /** Function that will hold the result-date selected */
  onChange: pt.func,
  /** String that will define the type of calendar to present date|week|month|quarter|year */
  picker: pt.oneOf([...Object.keys(PICKER_TYPE), null]),
};

const DatePicker = ({ format, onChange, lang, ...rest }) => {
  const handleOnChange = useCallback(
    (date, dateString) => {
      onChange(date, dateString);
    },
    [onChange]
  );

  return (
    <AntDatePicker
      {...rest}
      format={format || lang ? locales[lang]?.lang?.dateFormat : ''}
      locale={lang ? locales[lang] : ''}
      onChange={handleOnChange}
    />
  );
};

DatePicker.propTypes = propTypes;
export default DatePicker;
