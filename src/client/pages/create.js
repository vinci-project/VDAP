import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import api from '../utils/api';

class Create extends Component {
  state = {
    dc: '',
    object: {
      objectclass: '*'
    },
    newKey: '',
    newDn: '',

    createError: false
  };

  componentWillMount = () => {
    const { location } = this.props;
    const { dn } = location.state;

    this.setState({
      newDn: dn,
      dc: dn
    });
  };

  handleChange = prop => (event) => {
    const { value } = event.target;

    this.setState(prevState => ({
      object: {
        ...prevState.object,
        [prop]: value
      }
    }));
  };

  handleKeyChange = (event) => {
    this.setState({
      newKey: event.target.value
    });
  };

  handleDNChange = (event) => {
    this.setState({
      newDn: event.target.value
    });
  };

  removeKey = prop => () => {
    this.setState((prevState) => {
      delete prevState.object[prop];
      return {
        object: {
          ...prevState.object
        }
      };
    });
  };

  addNewKey = () => {
    if (this.state.newKey == '') {
      console.log('Empty Key');
    } else if (this.state.object[this.state.newKey]) {
      console.log('Key Exists');
    } else {
      this.setState(prevState => ({
        newKey: '',
        object: {
          ...prevState.object,
          [this.state.newKey]: ''
        }
      }));
    }
  };

  create = async () => {
    const { newDn, object } = this.state;
    const { history, fetch } = this.props;
    try {
      await api.create({
        dn: newDn,
        entry: object
      });

      await fetch();

      history.push(`/dashboard/entry/${newDn}`);
    } catch (err) {
      this.setState({
        createError: true
      });
    }
  };

  reset = () => {
    const { newDn } = this.state;
    const { history } = this.props;
    history.push('/dashboard/empty');
    setTimeout(() => {
      history.replace('/dashboard/create', {
        dn: newDn
      });
    });
  };

  render() {
    const {
      object, newKey, newDn, dc, createError
    } = this.state;
    return (
      <div>
        <Grid container direction="column" justify="center" alignItems="center">
          <h3>Create An Entry</h3>
          <p>
            <span>Container:</span>
            <b>{dc}</b>
          </p>
          <div
            style={{
              width: '80%',
              backgroundColor: '#FDA700',
              height: '5px',
              minWidth: '550px',
              margin: '10px 0 25px 0'
            }}
          />
          <Table style={{ width: '80%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Attributes</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>dn</TableCell>
                <TableCell>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <input
                      value={newDn}
                      onChange={this.handleDNChange}
                      style={{
                        height: '30px',
                        width: '85%',
                        padding: '0 5px',
                        marginRight: '5px'
                      }}
                      placeholder="Enter DN"
                    />
                  </Grid>
                </TableCell>
              </TableRow>
              {object
                && Object.keys(object).map(key => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      <Grid container direction="row" justify="flex-start" alignItems="center">
                        <input
                          value={object[key]}
                          onChange={this.handleChange(key)}
                          style={{
                            height: '30px',
                            width: '85%',
                            padding: '0 5px',
                            marginRight: '5px'
                          }}
                          placeholder="Enter Value"
                        />
                        {key !== 'objectclass' && (
                          <Icon onClick={this.removeKey(key)}>remove_circle</Icon>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className="custom-field"
            spacing={16}
          >
            <Grid item>Add a custom field</Grid>
            <Grid item>
              <input
                value={newKey}
                onChange={this.handleKeyChange}
                style={{ height: '35px', padding: '0 5px' }}
                placeholder="Enter Field Name"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={this.addNewKey}>
                Add
              </Button>
            </Grid>
          </Grid>
          <div>{createError && <p style={{ color: 'red' }}>Create Failed</p>}</div>
          <Grid container direction="row" justify="center" alignItems="center" spacing={40}>
            <Grid item>
              <Button
                onClick={this.create}
                variant="contained"
                color="primary"
                style={{ width: '150px' }}
              >
                Create
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.reset}
                variant="contained"
                color="secondary"
                style={{ width: '150px' }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Create;
