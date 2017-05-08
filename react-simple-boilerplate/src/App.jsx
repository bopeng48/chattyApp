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
      userStatus: ''
    };
    this.onNewMessage = this.onNewMessage.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.socket = new WebSocket("ws://127.0.0.1:3001");
  }

  componentDidMount() {
    this.socket.onopen = () => {
      if(this.socket.readyState === "OPEN") {
        console.log("Connected to server");
      }
      this.socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        // add the new message to messages
        console.log("on the client side, msg is: ",msg);
        switch(msg.type) {
          case "incomingMessage":
          let newUser = msg.userName;
          this.setState(prevState => {return {
            messages: prevState.messages.concat(msg),
            currentUser: {
              name: newUser
            }
          }});
          break;
          case "incomingNotification":
            console.log("incomingNotification gets triggered");
            console.log('msg is',msg);
            this.setState(prevState => {return {
            messages: prevState.messages.concat(msg),
          }});
            console.log(this.state);
          break;
          case "onlineUserCount":
            console.log('onlineUserCount gets triggered');
            console.log('msg is',msg);
            this.setState({userStatus: msg.content});
          default:
            console.log("Unrecognized incoming event!!");
        }
      }
    }
  }

  onNewMessage(data) {
    var newMessage = data;
    newMessage.type = "postMessage";
    this.socket.send(JSON.stringify(data));
  }

  updateUser(newUser) {
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
