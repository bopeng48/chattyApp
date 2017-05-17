import React from 'react';
import Message from './Message.jsx';

export default function MessageList(props) {
  return (
    <div className="messages">
    {
      props.messages.map(message => <Message key={message.id} {...message} />)
    }
    </div>
  );
}
