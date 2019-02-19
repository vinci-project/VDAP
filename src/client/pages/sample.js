import React, { Component } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    axios
      .get('/api/getUsername')
      .then(response => response.data)
      .then((user) => {
        this.setState({ username: user.username });
      });
  }

  render() {
    const { username } = this.state;
    return <div>{username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}</div>;
  }
}
