import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Icon } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

class SearchResult extends Component {
  state = {};

  back = () => {
    const { history } = this.props;
    history.push('/dashboard/search');
  };

  componentWillMount = () => {
    const { location, history } = this.props;
    this.setState(location.state);

    console.log(location.state);
  };

  render() {
    const {
      base, scope, filter, attributes, data
    } = this.state;
    return (
      <div>
        <div style={{ textAlign: 'left' }}>
          <Button onClick={this.back} variant="contained">
            Back To Search
          </Button>
        </div>
        <Grid container direction="column" justify="center" alignItems="center">
          <h3>Search Result</h3>
          <div
            style={{
              backgroundColor: '#FDA700',
              height: '5px',
              minWidth: '550px',
              margin: '10px 0 25px 0'
            }}
          />
          <Grid container direction="row" style={{ marginBottom: '50px' }}>
            <Grid item xs={3} style={{ textAlign: 'left' }}>
              <span>Entries Found:</span>
              <b>{data.length}</b>
            </Grid>
            <Grid item xs={9} style={{ textAlign: 'right' }}>
              <Grid>
                <span>Base DN:</span>
                <b>{base}</b>
              </Grid>
              <Grid>
                <span>Search Filter:</span>
                <b>{filter}</b>
              </Grid>
              {attributes && (
                <Grid>
                  <span>Attributes:</span>
                  <b>{attributes}</b>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Table style={{}}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>dn</TableCell>
                <TableCell>data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{item.dn}</TableCell>
                  <TableCell style={{ maxWidth: '300px' }}>{JSON.stringify(item.object)}</TableCell>
                </TableRow>
              ))}
              {/* <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>test01</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>test@test.com</TableCell>
              </TableRow>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>test01</TableCell>
                <TableCell>1001</TableCell>
                <TableCell>test01@test.com</TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </Grid>
        <div style={{ textAlign: 'right', margin: '40px' }}>
          <Button variant="contained" color="primary">
            Export
          </Button>
        </div>
      </div>
    );
  }
}

export default SearchResult;
