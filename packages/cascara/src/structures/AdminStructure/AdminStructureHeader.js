import React from 'react';
import pt from 'prop-types';
import styles from './AdminStructure.module.scss';
import classNames from 'classnames/bind';
import { HeaderToggle } from './components';

import navClosed from '@iconify-icons/ic/twotone-menu';
import navOpen from '@iconify-icons/ic/twotone-menu-open';
import drawerOpen from '@iconify-icons/ic/twotone-label-off';
import drawerClosed from '@iconify-icons/ic/twotone-label';

const cx = classNames.bind(styles);

const TestLogo =
  'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png';

const propTypes = {
  logo: pt.node,
  title: pt.oneOfType([pt.arrayOf(pt.node), pt.node]).isRequired,
};

const AdminStructureHeader = ({ logo = TestLogo, title }) => {
  return (
    <div className={styles.Header}>
      <HeaderToggle iconClosed={navClosed} iconOpen={navOpen} />
      <a className={styles.Company} href='/'>
        <h1
          className={cx({
            Title: true,
            hidden: logo,
          })}
        >
          {title}
        </h1>
        {logo && <img alt={title} className={styles.Logo} src={logo} />}
      </a>
      <HeaderToggle
        iconClosed={drawerClosed}
        iconOpen={drawerOpen}
        style={{ marginLeft: 'auto' }}
      />
    </div>
  );
};

AdminStructureHeader.propTypes = propTypes;
AdminStructureHeader.displayName = 'AdminStructure.Header';

export default AdminStructureHeader;