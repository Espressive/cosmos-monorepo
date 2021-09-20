// Action Modules
import ActionButton from './ActionButton';
import ActionEdit from './ActionEdit';

// Data Modules
import DataCheckbox from './DataCheckbox';
import DataEmail from './DataEmail';
import DataJson from './DataJson';
import DataNumber from './DataNumber';
import DataRadio from './DataRadio';
import DataSelect from './DataSelect';
import DataText from './DataText';
import DataTextArea from './DataTextArea';
import DataImage from './DataImage';
import DataFile from './DataFile';
import DataDate from './DataDate';
import DataDateTime from './DataDateTime';
import DataMonth from './DataMonth';
import DataTime from './DataTime';
import DataPassword from './DataPassword';
import DataTel from './DataTel';
import DataUrl from './DataUrl';

const actionModules = {
  button: ActionButton,
  edit: ActionEdit,
};

const dataModules = {
  // switch: DataCheckbox,
  checkbox: DataCheckbox,
  date: DataDate,
  datetime: DataDateTime,
  email: DataEmail,
  file: DataFile,
  image: DataImage,
  json: DataJson,
  month: DataMonth,
  number: DataNumber,
  passord: DataPassword,
  radio: DataRadio,
  select: DataSelect,
  tel: DataTel,
  text: DataText,
  textarea: DataTextArea,
  time: DataTime,
  url: DataUrl,
};

export { actionModules, dataModules };
