import React, {Component} from 'react';


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



export default ({username, content}) => (
  <div className="message">
    <span className="message-username">{username}</span>
    <span className="message-content">{content}</span>
  </div>
);

// function foo(a, b) {
//   arguments.length
// }

// function foo(a,b,...rest)

// foo(1,3,4,4,56)