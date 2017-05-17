import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';
import { postMessage, postNotification, onlineUserCount } from '../../chatty_server/constants.js';

const userNameChange = (oldName, newName) => ({
  type: postNotification,
  content: `${oldName} has changed their name to ${newName}`
});

const sendMessage = (userName, content) => ({
  type: postMessage,
  userName,
  content
});


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      onlineUserCount: 0,
      connected: false
    };
  }

  onSocketMessage = (event) => {
    const msg = JSON.parse(event.data);

    // add the new message to messages
    switch(msg.type) {
      case postMessage:
      case postNotification:
        this.setState(({ messages })=> ({ messages: [...messages, msg] }));
      break;
      case onlineUserCount:
        this.setState({onlineUserCount: msg.content});
        break;
      default:
        console.info("Unrecognized incoming event!!", msg.type);
    }
  }

  componentDidMount() {
    this.socket = new WebSocket(`ws://${location.hostname}:${location.port - 1}`);
    this.socket.onopen = () => this.setState({ connected: true });
    this.socket.onclose = () => this.setState({ connected: false });
    this.socket.onmessage = this.onSocketMessage;
  }

  componentWillUnmount() {
    this.socket.close();
    delete this.socket;
  }

  send(payload) {
    this.socket.send(JSON.stringify(payload));
  }

  onNewMessage = (content) => {
    this.send(sendMessage(this.state.currentUser.name, content));
  }

  updateUser = (newUser) => {
    // console.log("updateUser gets triggered!");
    // console.log("newUser is ",newUser);
    var prevUser = this.state.currentUser.name;
    const currentUser = { name: newUser };
    this.setState({ currentUser });

    this.send(userNameChange(prevUser, newUser));
  }

  render() {
    return (
      <div>
        <NavBar onlineUserCount={this.state.onlineUserCount}/>
        <MessageList messages={this.state.messages} />
        <ChatBar name={this.state.currentUser.name} onNewMessage={this.onNewMessage} connected={this.state.connected}
        updateUser={this.updateUser}/>
      </div>
    )
  }
}
