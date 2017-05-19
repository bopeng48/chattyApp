import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      userStatus: '',
      connected: false
    };
  }

  onSocketMessage = (event) => {
    let msg = JSON.parse(event.data);
    // add the new message to messages
    switch(msg.type) {
      case "incomingMessage":
      let newUser = msg.userName;
      this.setState(prevState => { return {
        messages: prevState.messages.concat(msg),
        currentUser: {
          name: newUser
        }
      }});
      break;
      case "incomingNotification":
        this.setState(prevState => { return {
        messages: prevState.messages.concat(msg),
      }});
      break;
      case "onlineUserCount":
        this.setState({userStatus: msg.content});
      default:
        console.log("Unrecognized incoming event!!");
    }
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://127.0.0.1:3001");
    this.socket.onopen = () => this.setState({ connected: true });
    this.socket.onclose = () => this.setState({ connected: false });
    this.socket.onmessage = this.onSocketMessage;
  }

  componentWillUnmount() {
    this.socket.close();
    delete this.socket;
  }

  onNewMessage = (data) => {
    var newMessage = data;
    newMessage.type = "postMessage";
    this.socket.send(JSON.stringify(data));
  }

  updateUser = (newUser) => {
    console.log("updateUser gets triggered!");
    console.log("newUser is ",newUser);
    var prevUser = this.state.currentUser.name;
    const currentUser = {name: newUser };
    this.setState({ currentUser });
    let message = {type: "postNotification", content: `${prevUser} has changed their name to ${newUser}`};
    this.socket.send(JSON.stringify(message));
  }

  render() {
    return (
      <div>
        <NavBar info={this.state.userStatus}/>
        <MessageList messages={this.state.messages} />
        <ChatBar name={this.state.currentUser.name} onNewMessage={this.onNewMessage}
        updateUser={this.updateUser}/>
      </div>
    )
  }
}
