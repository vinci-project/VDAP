import React, { Component } from 'react';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

class titleBar extends Component {
  state = { nodes: [] };

  componentDidMount = () => {
    this.fetchNodes();

    this._fetchInterval = setInterval(() => {
      this.fetchNodes();
    }, 10 * 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this._fetchInterval);
  };

  fetchNodes = async () => {
    const { data } = await axios.get('/vdap/nodes');
    this.setState({
      nodes: data
    });
  };

  logout = () => {
    console.log('Logging Out!');
    const { history } = this.props;
    delete window.localStorage.bindCredentials;
    history.push('/');
  };

  refresh = () => {
    window.location.reload();
  };

  render() {
    const { nodes } = this.state;
    const { history } = this.props;
    return (
      <Grid
        style={{ position: 'relative', height: '100%' }}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <h1 className="titleBar-title">CDAP Server</h1>
        <Grid
          onClick={this.refresh}
          container
          style={{ width: 'initial', marginRight: '20px' }}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Icon>refresh</Icon>
          <span>Refresh</span>
        </Grid>

        <Grid
          onClick={() => history.push('/dashboard/search')}
          style={{ width: 'initial', marginRight: '20px' }}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Icon>search</Icon>
          <span>Search</span>
        </Grid>

        <Grid
          onClick={() => history.push('/reports')}
          style={{ width: 'initial' }}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Icon>list_alt</Icon>
          <span>Reports</span>
        </Grid>

        <div style={{ flexGrow: 1 }} />

        <Grid
          // onClick={() => history.push('/dashboard/nodes')}
          container
          style={{ width: 'initial', margin: '0 20px' }}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Icon>grid_on</Icon>
          <span style={{ fontSize: '12px' }}>
            {nodes.length}
            {' '}
Nodes
            <br />
            Connected
          </span>
        </Grid>

        <Grid
          onClick={this.logout}
          container
          style={{ width: 'initial' }}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Icon>exit_to_app</Icon>
          <span>Logout</span>
        </Grid>
      </Grid>
    );
  }
}

export default titleBar;
