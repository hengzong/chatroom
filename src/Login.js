import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Header from './Header';
import './Login.css';

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

export default function Login(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: '',
    password: '',
    error: false,
    // loggedIn: false,
  });

  const handleChange = name => event => {
    setValues({...values, [name] : event.target.value});
  }

  const handleSumbit = async () => {
    await new Promise((resolve, reject) => {
      axios.get('/api/users?user_name='+values.name+'&password='+values.password)
           .then((res) => {
             if(res.data.data.length == 0) {
               setValues({...values, error: true})
             } else {
               props.history.push({
                 pathname: '/chatroom/'+values.name,
                 state: {token: res.data.token}});
             }
             resolve(res.data.data);
           })
           .catch((err) => {
             reject(err);
             console.log(err);
           })
    })
  }

  return(
    <div>
      <Header mode="login"/>
      <div className="register_form">
        <label>{values.error?"Name or password is incorrect.":""}</label>

        <TextField
          error={values.name_error}
          id="outlined-name"
          label="Name"
          className={classes.textField}
          value={values.input_name}
          onChange={handleChange('name')}
          margin="normal"
          variant="outlined"
          fullWidth
        />

        <TextField
          error={values.pw_error}
          id="outlined-pw"
          label="Password"
          className={classes.textField}
          value={values.input_pw}
          onChange={handleChange('password')}
          margin="normal"
          type="password"
          variant="outlined"
          fullWidth
        />

        <Button variant="contained" className={classes.button} onClick={()=>(handleSumbit())}>Login</Button>
      </div>
    </div>
  );
}
