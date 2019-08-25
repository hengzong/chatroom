import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ReactDOM from 'react-dom';
import socket from './socket';
import axios from 'axios';
import Header from './Header';
import './Chatroom.css';

class MessageCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var left = (
      <span>
      <span className="name">{this.props.name + " "}</span>
      <span className="time">{this.props.time}</span>
      </span>);
    var right = (
      <span>
      <span className="time">{this.props.time + " "}</span>
      <span className="name">{this.props.name}</span>
      </span>);
    return (
      <div className={"message_card"}>
        <div className={this.props.isUser?"user_info_box":"info_box"}>
          {this.props.isUser?right:left}
        </div>

        <div className={this.props.isUser?"user_mesg_box":"mesg_box"}>

          <div className={this.props.isUser?"user_triangle":"triangle"}></div>
            <div className={this.props.isUser?"user_mesg":"message"} >
              {this.props.message}
            </div>
        </div>

      </div>
    );
  }
}

export default class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      history: [],
      new_message: '',
      name: '',
      token: '',
    }

    // this.messagesEnd = React.createRef();

    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSumbit= this.handleSumbit.bind(this);
    this.updateData = this.updateData.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.leaveChatRoom = this.leaveChatRoom.bind(this);
    this.unauthed = this.unauthed.bind(this);
  }

  getData = messages => {

    this.setState({
      history: messages,
      isLoading: false,
    });

    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  handleChange = event => {
    this.setState({
      new_message: event.target.value
    })
  }

  handleSumbit = () => {
    socket.emit("newMessage", {user_name: this.state.name, message: this.state.new_message, token: this.state.token});
  }

  updateData = (message) => {

    var new_history = this.state.history;
    new_history.push(message);
      this.setState({
      history: new_history,
      new_message: ''
    });

    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  unauthed = () => {
    this.props.history.push("/login");
  }

  dateBreakDown = (time_stamp) => {
    var suffix = "PM";
    if (Number(time_stamp.substring(11, 13)) < 12) {
      suffix = "AM";
    }

    return ({
      date: time_stamp.substring(0,10),
      time: time_stamp.substring(11, 19)+" "+suffix,
    })
  }

  async componentDidMount() {
    var token = ""
    if (this.props.location.state) {
      token = this.props.location.state.token;
    }
    var user_name = this.props.match.params.id;
    console.log(token);
    await new Promise((resolve, reject) => {
      axios.get('/api/users/'+this.props.match.params.id, {params: {token: token}})
           .then((res) => {
              socket.emit("initial_data");
              var curr = this;
              socket.on("get_data", curr.getData);
              socket.on("update_data", curr.updateData);
              socket.on("unauthed", curr.unauthed);
              this.setState({name: this.props.match.params.id, token});
           })
           .catch((err) => {
             this.props.history.push("/login");
           })
    })
  }

  leaveChatRoom = () => {
    socket.emit("disconnect");
  }

  render() {
    console.log(this.messagesEnd);
    var curr_date = '';
    var mesg_num = this.state.history.length;

    if(this.state.isLoading) {
      return (<div>Loading Chat Histroy ...</div>)
    }

    return(
      <div>
      <Header
        mode="loggedIn"
        user_name={this.state.name}
      />
      <div className="chat_box">
        <div className="chat_history">
          {this.state.history.map((item, id) => {
            var date = this.dateBreakDown(item.date).date;
            var time = this.dateBreakDown(item.date).time;
            var showDate = false;
            var last_ele = false;
            if (curr_date !== date) {
              showDate = true;
              curr_date = date;
            }

            if (id == mesg_num - 1) {
              return (
                <div key={item._id} className="last_ele" ref={(el) => { this.messagesEnd = el; }}>
                  <div className={showDate?"date":"hidden"} >{date}</div>
                  <MessageCard
                    name={item.user_name}
                    time={time}
                    message={item.message}
                    isUser={this.state.name==item.user_name}
                  />
                </div>
              );
            } else {
              return (
                <div key={item._id}>
                  <div className={showDate?"date":"hidden"} >{date}</div>
                  <MessageCard
                    name={item.user_name}
                    time={time}
                    message={item.message}
                    isUser={this.state.name==item.user_name}
                  />
                </div>
              );
            }

          })}
        </div>


        <div>
          <textarea placeholder="Write Something Here ..." value={this.state.new_message} onChange={(event)=>{this.handleChange(event)}}></textarea>
        </div>

        <span className="button_box">
          <Link to="/"><button className={"leave_button"} onClick={this.leaveChatRoom}>Leave Chat Room</button></Link>
          <button className={"send_button"} onClick={this.handleSumbit}>Send Message</button>
        </span>
      </div>
      </div>
    )
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(false);
  }

}
