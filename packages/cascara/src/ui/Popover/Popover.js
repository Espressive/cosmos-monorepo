import React, { useRef } from 'react';
import {
  PopoverBackdrop,
  PopoverDisclosure,
  Popover as ReakitPopover,
  usePopoverState,
} from 'reakit/Popover';
import styles from './Popover.module.scss';

import { popperOverTrigger } from '../../shared/popperModifiers';

const Popover = ({ children, trigger }) => {
  // Set a ref on our trigger to pass into the disclosure and also measure clientHeight
  const triggerRef = useRef();

  const popover = usePopoverState({
    gutter: 0,
    modal: true,
    placement: 'bottom-end',
    unstable_popperModifiers: [popperOverTrigger],
  });

  return (
    <>
      <PopoverDisclosure {...popover} ref={triggerRef} {...trigger.props}>
        {(disclosureProps) => React.cloneElement(trigger, disclosureProps)}
      </PopoverDisclosure>
      <ReakitPopover className={styles._} {...popover}>
        {children}
      </ReakitPopover>
      <PopoverBackdrop className={styles.Backdrop} {...popover} />
    </>
  );
};

export default Popover;