import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import api from '../utils/api';

export default class App extends Component {
  state = {
    showPassword: false,
    username: '',
    password: '',
    showError: false
  };

  componentWillMount = async () => {
    const { history } = this.props;

    if (window.localStorage.bindCredentials) {
      console.log('Has Credential! Try Login');
      try {
        await api.bind();
        history.push('/dashboard');
      } catch (err) {}
    }
  };

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  login = async () => {
    const { username, password } = this.state;
    const { history } = this.props;
    window.localStorage.bindCredentials = `${username}:${password}`;

    this.setState({
      showError: false
    });

    try {
      await api.bind();
      history.push('/dashboard');
    } catch (err) {
      this.setState({
        showError: true
      });
    }
  };

  render() {
    const {
      showError, showPassword, username, password
    } = this.state;
    return (
      <Grid
        style={{ height: '100vh' }}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <img
          src="https://vinci.id/en/img/logo-icon.svg"
          alt="logo"
          style={{ width: '100px', margin: '30px 0' }}
        />
        <Card style={{ width: '500px' }}>
          <CardContent>
            <Grid container direction="column" justify="center" alignItems="center">
              <h3>CDAP Server Login</h3>
              <Grid container direction="row" spacing={8} alignItems="flex-end" justify="center">
                <Grid item>
                  <Icon>account_circle</Icon>
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: '300px' }}
                    margin="normal"
                    label="Username eg. cn=root"
                    value={username}
                    onChange={this.handleChange('username')}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={8} alignItems="flex-end" justify="center">
                <Grid item>
                  <Icon>lock</Icon>
                </Grid>
                <Grid item>
                  <FormControl style={{ width: '300px' }}>
                    <InputLabel htmlFor="adornment-password">Password</InputLabel>
                    <Input
                      id="adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={this.handleChange('password')}
                      endAdornment={(
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
                          </IconButton>
                        </InputAdornment>
)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              {showError && <p style={{ color: 'red' }}>Crendential Error</p>}
              <Button
                style={{ width: '300px', margin: '30px 0' }}
                variant="contained"
                color="primary"
                onClick={this.login}
              >
                Login
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
