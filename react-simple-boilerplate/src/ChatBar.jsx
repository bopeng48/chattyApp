import React, {Component} from 'react';

class ChatBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userName: props.name
    }
  }

  passData = (event) => {
    let message = {userName:this.state.userName, content:event.target.value};
    if(event.key === 'Enter') {
      this.props.onNewMessage(message);
      event.target.value = '';
    }
  }

  getInput = (e) => {
    var a = e.target.value;
    console.log("getInput gets triggered, a is",a);
    if(e.key === 'Enter') {
      console.log("Enter was hit");
      this.props.updateUser(a);
      this.setState({userName: a});
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder={this.state.userName}
        onKeyUp={this.getInput} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER"
        onKeyUp={this.passData} />
      </footer>
    );
  }
}
export default ChatBar;



