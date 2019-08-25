import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Header from './Header';
import './Register.css';

axios.defaults.baseURL = 'http://localhost:3001';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '40vh',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  button: {
    width: '40vh',
    marginTop: '2vh',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
}));


export default function Register (props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: '',
    password: '',
    repeat_password: '',
    name_error: false,
    pw_error: false,
    re_pw_error: false,
    // registered: false,
  });

  const hanldeNameChange = async event => {

    var new_name = event.target.value;

    var error = await new Promise( function (resolve, reject) {
      axios.get('/api/users?user_name='+ new_name + '&check_repeat=1')
         .then((res) => {
           resolve(res.data.data);
         })
         .catch((err) => {
           reject(err);
         })
    })

    error = error || (new_name.length==0);

    console.log(error);
    if (error) {
      setValues({...values, name_error: true, name:new_name});
    } else {
      setValues({...values, name_error: false, name:new_name});
    }

  }

  const handleChange =  name => async event =>  {

    if (name == 'password') {
      if (event.target.value.length < 6) {
        setValues({...values, pw_error: true, [name]:event.target.value});
      } else {
        setValues({...values, pw_error: false, [name]:event.target.value})
      }
    } else {
      if (values.re_pw_error) {
        setValues({...values, re_pw_error: false, [name]:event.target.value});
      } else {
        setValues({...values, [name]:event.target.value});
      }
    }

  };

  const handleSumbit = () => {
    var isMatch = (values.password == values.repeat_password);
    if (!isMatch) {
      setValues({...values, re_pw_error: true});
    } else if (values.name_error || values.pw_error) {
      //do nothing
    } else {
      //register new user
      axios.post("/api/users", {
        user_name: values.name,
        password: values.password,
      }).then((res) => {
        props.history.push({
          pathname: '/chatroom/'+values.name,
          state: {token: res.data.token}});
      }).catch((err) => {
        console.log(err);
      })
    }

  }


  return (
    <div>
      <Header mode="register"/>
      <div className="register_form">

        <TextField
          error={values.name_error}
          id="outlined-name"
          label="Name"
          className={classes.textField}
          value={values.name}
          onChange={(eve) => hanldeNameChange(eve)}
          margin="normal"
          variant="outlined"
          helperText={values.name_error? "Invalid user name":""}
          fullWidth={true}
        />

        <TextField
          error={values.pw_error}
          id="outlined-pw"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange('password')}
          margin="normal"
          type="password"
          variant="outlined"
          helperText={values.pw_error? "Password should contain at least 6 characters.":""}
          fullWidth
        />

        <TextField
          error={values.re_pw_error}
          id="outlined-pw"
          label="Repeat Password"
          className={classes.textField}
          value={values.repeat_password}
          onChange={handleChange('repeat_password')}
          margin="normal"
          type="password"
          variant="outlined"
          helperText={values.re_pw_error? "Passwords do not match.":""}
          fullWidth
        />

        <Button variant="contained" className={classes.button} onClick={()=>(handleSumbit())}>Register</Button>
      </div>
    </div>
  );
}
