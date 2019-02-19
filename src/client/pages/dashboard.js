import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { Route, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import TitleBar from '../components/titleBar';
import Tree from '../components/tree';

import Nodes from './nodes';

import Create from './create';
import Search from './search';
import Detail from './detail';
import Update from './update';
import SearchResult from './searchResult';

import api from '../utils/api';

function Empty() {
  return <h3>Select Node From The Left</h3>;
}

const temp = {
  icon: 'storage',
  name: 'o=example',
  children: [
    // {
    //   icon: 'group',
    //   name: 'ou=users'
    // }
  ]
};

const Dashboard = class App extends Component {
  state = {
    item: {}
  };

  async componentDidMount() {
    const { history } = this.props;
    if (!window.localStorage.bindCredentials || window.localStorage.bindCredentials == '') {
      history.replace('/');
    }
    await this.fetchTree();
  }

  fetchTree = async () => {
    const tree = {
      dn: 'o=example',
      name: 'o=example',
      children: []
    };

    await this.expand(tree);

    this.setState({
      item: tree
    });
  };

  expand = async (tree) => {
    const { data } = await api.search({
      base: tree.dn,
      options: {
        scope: 'one'
      }
    });
    data.shift();
    const dataPromises = [];

    data.forEach((item) => {
      const subTree = {
        dn: item.dn,
        name: item.dn.replace(`, ${tree.dn}`, ''),
        children: []
      };
      tree.children.push(subTree);
      dataPromises.push(this.expand(subTree));
    });
    await Promise.all(dataPromises);
  };

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  logout = () => {
    delete window.localStorage.bindCrendtials;
  };

  render() {
    const { item } = this.state;
    const { history, match, tree } = this.props;

    return (
      <Grid
        style={{
          minHeight: '400px',
          padding: '30px 60px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Card
          style={{
            width: '100%',
            height: '90px',
            marginBottom: '20px'
          }}
        >
          <CardContent
            style={{
              height: '100%'
            }}
          >
            <TitleBar history={history} />
          </CardContent>
        </Card>

        <Grid container direction="row" spacing={24} style={{ flexGrow: 1 }}>
          <Grid item>
            <Card
              style={{
                height: '100%'
              }}
            >
              <CardContent
                style={{
                  width: '320px'
                }}
              >
                <Tree item={item} history={history} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Card
              style={{
                height: '100%'
              }}
            >
              <CardContent>
                <PerfectScrollbar option={{ suppressScrollX: true }}>
                  <Route exact path="/dashboard" component={Empty} />
                  <Route
                    path="/dashboard/create"
                    render={props => <Create {...props} fetch={this.fetchTree} />}
                  />
                  <Route path="/dashboard/search" component={Search} />
                  <Route
                    path="/dashboard/entry/:dn"
                    render={props => <Detail {...props} fetch={this.fetchTree} />}
                  />
                  <Route path="/dashboard/update/:dn" component={Update} />
                  <Route path="/dashboard/searchResult" component={SearchResult} />
                  <Route path="/dashboard/empty" component={null} key="empty" />
                  <Route path="/dashboard/nodes" component={Nodes} />
                </PerfectScrollbar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default connect((state) => {
  const { tree } = state;
  return {
    tree
  };
})(Dashboard);
