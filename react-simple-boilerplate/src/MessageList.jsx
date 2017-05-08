import React, {Component} from 'react';
import Message from './Message.jsx';

export default function MessageList(props) {
  return (
    <div className="messages">
    {
      props.messages.map((message,index) => (
        <Message username={message.userName} content={message.content} key={index} />
      ))
    }
    </div>
  );
}
