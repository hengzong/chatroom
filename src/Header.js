import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import './Header.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: "",
      mode: "",
    }
  }

  componentDidMount () {
    var mode = this.props.mode;
    if (this.props.user_name) {
      this.setState({mode: mode, user_name: this.props.user_name});
    } else {
      this.setState({mode: mode});
    }
  }

  render() {
    var mode_div = (<div></div>);
    switch (this.state.mode) {
      case "loggedIn":
        mode_div = (
          <div className="right-part">
            <div>
              <span><button className="user_name">{"User Name: " + this.state.user_name}</button></span>
              <span><Link to='/login'><button className="right-part-button">{"LOGOUT"}</button></Link></span>
            </div>
          </div>
        );
        break;
      case "register":
        mode_div = (
          <div className="right-part">
              {"Already a Member? "}
              <Link to='/login'>
                <button className="right-part-button">{"LOGIN"}</button>
              </Link>
          </div>
        );
        break;
      case "login":
        mode_div = (
          <div className="right-part">
              {"Not a Member yet? "}
              <Link to='/register'>
                <button className="right-part-button">{"REGISTER"}</button>
              </Link>
          </div>
        );
        break;
      case "home":
        mode_div = (
          <div className="right-part">
            <Link to='/login'>
              <button className="right-part-button">{"LOGIN"}</button>
            </Link>
            <Link to='/register'>
              <button className="right-part-button">{"REGISTER"}</button>
            </Link>
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div>
        <div className="header-span">
          <div>
            <Link to='/' className="left-part">
              CHAT ROOM
            </Link>
          </div>
          {mode_div}
        </div>
      </div>
    )
  }
}
