import React, { useEffect, useRef } from 'react';
import pt from 'prop-types';
import { Chat as FUIChat } from '@fluentui/react-northstar';
import {
  getMessageAuthorDetails,
  getMessageGroup,
  messageTypes,
} from './utils';

const propTypes = {
  // cool: pt.bool.isRequired,
  messages: pt.arrayOf(
    pt.shape({
      attached: pt.oneOf(['top', true, 'bottom']),
      id: pt.string.isRequired,
      sys_date_created: pt.string.isRequired,
      type: pt.oneOf(Object.keys(messageTypes)).isRequired,
      user_id: pt.number,
    })
  ).isRequired,
  sessionUserID: pt.number,
  users: pt.object.isRequired,
};

const Chat = ({ sessionUserID, messages, users }) => {
  // const useState()

  // The latestMessageRef is always assigned to the
  // latest message that has appeared in the Chat
  const latestMessageRef = useRef(null);

  // We scroll to the latest message, not to the bottom of the chat
  // which leads to a better user experience when the last message is long
  const handleScrollToLatestMessage = () => {
    return latestMessageRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  // When messages change
  useEffect(() => {
    handleScrollToLatestMessage();
  }, [messages]);

  // On mount
  useEffect(() => {
    handleScrollToLatestMessage();
  }, []);

  // NOTE: Some of our messages return arrays of objects and not
  // just an object, so we need to use flatMap here
  let items = messages.flatMap((msg, index, array) => {
    const previousMessage = array[index - 1];
    const nextMessage = array[index + 1];
    const getMessageObject = messageTypes[msg.type];

    const isSessionUser = sessionUserID === msg.user_id;
    const isTranslated = Boolean(msg.isTranslated); // This can probably get cleaned up later.

    // Only return if we have a defined component for this type
    return Boolean(getMessageObject)
      ? getMessageObject({
          attached: getMessageGroup(msg, previousMessage, nextMessage),
          handleScrollToLatestMessage,
          isSessionUser,
          isTranslated,
          message: msg,
          messageAuthor: getMessageAuthorDetails(users, msg.user_id),
          ref: latestMessageRef,
        })
      : null;
  });

  return (
    <>
      {/* <button onClick={handleScrollToLatestMessage}>Scroll</button> */}

      <FUIChat items={items} />
    </>
  );
};

Chat.propTypes = propTypes;

export default Chat;