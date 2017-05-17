import React, {Component} from 'react';

class ChatBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userName: props.name
    }
  }

  get disabled() {
    return !this.props.connected;
  }

  passData = (event) => {
    if(event.key === 'Enter') {
      this.props.onNewMessage(event.target.value);
      event.target.value = '';
    }
  }

  getInput = (e) => {
    const userName = e.target.value;
    // console.log("getInput gets triggered, a is",a);
    if(e.key === 'Enter') {
      console.log("Enter was hit");
      this.props.updateUser(userName);
      this.setState({ userName });
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder={this.state.userName} disabled={this.disabled}
        onKeyUp={this.getInput} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" disabled={this.disabled}
        onKeyUp={this.passData} />
      </footer>
    );
  }
}
export default ChatBar;



