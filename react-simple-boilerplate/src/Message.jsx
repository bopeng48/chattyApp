import React, {Component} from 'react';
import { postMessage, postNotification } from '../../chatty_server/constants.js';


// class Message extends Component {

//   render() {
//     const { username, content } = this.props;
//     return (
//       <div className="message">
//         <span className="message-username">{username}</span>
//         <span className="message-content">{content}</span>
//       </div>
//     )
//   }
// }
// export default Message;



export default function Message({type, userName, content}) {
  return (
    <div className={ type === postMessage ? "message" : "notification" }>
      { userName ?  <span className="message-username">{userName}</span> : null }
      <span className="message-content">{content}</span>
    </div>
  );
}

// function foo(a, b) {
//   arguments.length
// }

// function foo(a,b,...rest)

// foo(1,3,4,4,56)
