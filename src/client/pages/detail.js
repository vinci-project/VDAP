import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import api from '../utils/api';
import DeleteDialog from '../components/deleteDialog';

class Detail extends Component {
  state = {
    deleteOpen: false,
    data: {}
  };

  componentWillMount = async () => {
    const { match } = this.props;
    const { data } = await api.search({
      base: match.params.dn
    });

    this.setState({
      data: data[0]
    });
  };

  openDelete = () => {
    this.setState({
      deleteOpen: true
    });
  };

  closeDelete = () => {
    this.setState({
      deleteOpen: false
    });
  };

  confirmDelete = async () => {
    const { history, match, fetch } = this.props;
    await api.delete({
      dn: match.params.dn
    });

    await fetch();

    this.setState({
      deleteOpen: false
    });

    history.push('/dashboard/empty');
  };

  edit = () => {
    const { history, match } = this.props;
    history.push(`/dashboard/update/${match.params.dn}`);
  };

  render() {
    const { data, deleteOpen } = this.state;
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
          {data.object && (
            <Table style={{ width: '80%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Attributes</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(data.object).map(key => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{data.object[key]}</TableCell>
                  </TableRow>
                ))}

                {/* <TableRow>
                <TableCell>uid</TableCell>
                <TableCell>1000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>email</TableCell>
                <TableCell>test@test.com</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>objectClass</TableCell>
                <TableCell>Person</TableCell>
              </TableRow> */}
              </TableBody>
            </Table>
          )}

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={40}
            style={{ marginTop: '50px' }}
          >
            <Grid item>
              <Button
                onClick={this.edit}
                variant="contained"
                color="primary"
                style={{ width: '150px' }}
              >
                Edit
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.openDelete}
                variant="contained"
                color="secondary"
                style={{ width: '150px' }}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <DeleteDialog
          dn={match.params.dn}
          confirm={this.confirmDelete}
          cancel={this.closeDelete}
          open={deleteOpen}
        />
      </div>
    );
  }
}

export default Detail;
