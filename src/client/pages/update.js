import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Icon } from '@material-ui/core';

import api from '../utils/api';

class Update extends Component {
  state = {
    data: {},
    originalData: {},
    newKey: '',
    updateError: false
  };

  cancel = () => {
    const { history, match } = this.props;
    history.push(`/dashboard/entry/${match.params.dn}`);
  };

  componentWillMount = async () => {
    const { match } = this.props;
    const { data } = await api.search({
      base: match.params.dn
    });

    this.setState({
      data: data[0],
      originalData: JSON.parse(JSON.stringify(data[0]))
    });
  };

  handleChange = prop => (event) => {
    const { value } = event.target;

    this.setState(prevState => ({
      data: {
        ...prevState.data,
        object: {
          ...prevState.data.object,
          [prop]: value
        }
      }
    }));
  };

  handleKeyChange = (event) => {
    this.setState({
      newKey: event.target.value
    });
  };

  removeKey = prop => () => {
    this.setState((prevState) => {
      delete prevState.data.object[prop];
      return {
        data: {
          ...prevState.data,
          object: {
            ...prevState.data.object
          }
        }
      };
    });
  };

  addNewKey = () => {
    if (this.state.newKey == '') {
      console.log('Empty Key');
    } else if (this.state.data.object[this.state.newKey]) {
      console.log('Key Exists');
    } else {
      this.setState(prevState => ({
        newKey: '',
        data: {
          ...prevState.data,
          object: {
            ...prevState.data.object,
            [this.state.newKey]: ''
          }
        }
      }));
    }
  };

  update = async () => {
    const { history, match } = this.props;
    const { originalData, data } = this.state;

    const updatePromises = [];

    Object.keys(data.object).forEach((key) => {
      // console.log(`New keys:${key}`);
      if (originalData.object[key]) {
        console.log(originalData.object[key], data.object[key]);
        if (originalData.object[key] !== data.object[key]) {
          updatePromises.push(
            api.update({
              dn: match.params.dn,
              change: {
                operation: 'replace',
                modification: {
                  [key]: data.object[key]
                }
              }
            })
          );
        }
      } else {
        updatePromises.push(
          api.update({
            dn: match.params.dn,
            change: {
              operation: 'add',
              modification: {
                [key]: data.object[key]
              }
            }
          })
        );
      }
    });

    Object.keys(originalData.object).forEach((key) => {
      // console.log(`Original keys:${key}`);
      if (!data.object[key]) {
        updatePromises.push(
          api.update({
            dn: match.params.dn,
            change: {
              operation: 'delete',
              modification: {
                [key]: ''
              }
            }
          })
        );
      }
    });

    try {
      await Promise.all(updatePromises);
      history.push(`/dashboard/entry/${match.params.dn}`);
    } catch (err) {
      this.setState({
        updateError: true
      });
    }
  };

  render() {
    const { updateError, data, newKey } = this.state;
    const { match } = this.props;
    return (
      <div>
        <Grid container direction="column" justify="center" alignItems="center">
          <h3>Entry Detail</h3>
          <p>
            <span>DN:</span>
            <b>{match.params.dn}</b>
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
              {data.object
                && Object.keys(data.object).map(key => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      <Grid container direction="row" justify="flex-start" alignItems="center">
                        <input
                          value={data.object[key]}
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
              {/* <TableRow>
                <TableCell>uid</TableCell>
                <TableCell>
                  <Grid container direction="row" justify="center" alignItems="center">
                    <input
                      style={{
                        height: '30px',
                        width: '85%',
                        padding: '0 5px',
                        marginRight: '5px'
                      }}
                      placeholder="1000"
                    />
                    <Icon>remove_circle</Icon>
                  </Grid>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>email</TableCell>
                <TableCell>
                  <Grid container direction="row" justify="center" alignItems="center">
                    <input
                      style={{
                        height: '30px',
                        width: '85%',
                        padding: '0 5px',
                        marginRight: '5px'
                      }}
                      placeholder="test@test.com"
                    />
                    <Icon>remove_circle</Icon>
                  </Grid>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>objectClass</TableCell>
                <TableCell>
                  <input
                    style={{ height: '30px', width: '85%', padding: '0 5px' }}
                    placeholder="person"
                  />
                </TableCell>
              </TableRow> */}
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

          <div>{updateError && <p style={{ color: 'red' }}>Update Failed</p>}</div>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={40}
            style={{ marginTop: '40px' }}
          >
            <Grid item>
              <Button
                onClick={this.update}
                variant="contained"
                color="primary"
                style={{ width: '150px' }}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.cancel}
                variant="contained"
                color="secondary"
                style={{ width: '150px' }}
              >
                Cancle
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Update;
