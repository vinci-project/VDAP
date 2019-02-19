import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';

import api from '../utils/api';

class Search extends Component {
  state = {
    base: '',
    scope: 'base',
    filter: 'objectclass=*',
    attributes: null
  };

  componentWillMount = () => {};

  search = async () => {
    const { history } = this.props;
    const {
      base, scope, filter, attributes
    } = this.state;
    try {
      const { data } = await api.search({
        base,
        options: {
          scope,
          filter,
          attributes
        }
      });
      history.push('/dashboard/searchResult', {
        ...this.state,
        data
      });
    } catch (err) {
      this.setState({
        err: 'Search Error'
      });
    }
  };

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const {
      base, scope, filter, attributes, err
    } = this.state;
    return (
      <div>
        <Grid container direction="column" justify="center" alignItems="center">
          <h3>Search Form</h3>

          <div
            style={{
              width: '80%',
              backgroundColor: '#FDA700',
              height: '5px',
              minWidth: '550px',
              margin: '10px 0 25px 0'
            }}
          />
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={8}
            className="search-column"
          >
            <Grid item xs={2}>
              Base DN
            </Grid>
            <Grid item>
              <input
                value={base}
                onChange={this.handleChange('base')}
                className="search_input"
                placeholder="Base DN, e.g ou=users,dc=example,dc=com"
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={8}
            className="search-column"
          >
            <Grid item xs={2}>
              Scope
            </Grid>
            <Grid item>
              <Select
                native
                value={scope}
                onChange={this.handleChange('scope')}
                input={<OutlinedInput name="age" labelWidth={100} />}
                style={{ width: '300px', height: '35px' }}
              >
                <option value="base">base</option>
                <option value="one">one</option>
                <option value="sub">sub</option>
              </Select>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={8}
            className="search-column"
          >
            <Grid item xs={2}>
              Filter
            </Grid>
            <Grid item>
              <input
                value={filter}
                onChange={this.handleChange('filter')}
                className="search_input"
                placeholder="Filter String, e.g cn=test*"
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={8}
            className="search-column"
          >
            <Grid item xs={2}>
              Attributes
            </Grid>
            <Grid item>
              <input
                value={attributes}
                onChange={this.handleChange('attributes')}
                className="search_input"
                placeholder="Selected Attributes, e.g. cn,email,sn"
              />
            </Grid>
          </Grid>
          <div>{err && <p style={{ color: 'red' }}>{err}</p>}</div>
          <Grid container direction="row" justify="center" alignItems="center">
            <Button
              onClick={this.search}
              variant="contained"
              color="primary"
              style={{ width: '150px', marginTop: '200px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Search;
