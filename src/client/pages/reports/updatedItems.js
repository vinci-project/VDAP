import React, { Component } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
  Grid,
  Typography,
  Divider,
  Button,
  Icon,
  Input
} from '@material-ui/core';
import api from '../../utils/api';
 const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 5
  },
  divider: {
    backgroundColor: '#FDA700',
    height: 5,
    marginTop: 20
  },
  btnExport: {},
  searchInput: {
    marginLeft: 16
  },
  tableWrapper: {},
  table: {},
  th: {
    color: '#000000',
    fontWeight: 500,
    fontSize: 14
  }
});
 class UpdatedItems extends Component {
  state = {
    rows: []
  };
   componentWillMount = async () => {
    const { data } = await api.reports();
     this.setState({
      rows: data.rows.filter(row => row.type === 'update')
    });
  };
   render() {
    const { classes } = this.props;
    const { rows } = this.state;
     return (
      <div className={classes.root}>
        <Grid container direction="row" spacing={40}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4">
              Report: Updated Items by User
            </Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item container xs={12} justify="space-between" alignItems="center">
            <Grid item>
              <Typography component="p" variant="subtitle2">
                Items Found:
                {' '}
                {rows.length}
              </Typography>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained" className={classes.btnExport}>
                <Icon>save_alt</Icon>
                {'  '}
                Export
              </Button>
              <Input placeholder="Search" className={classes.searchInput} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.th}>No.</TableCell>
                    <TableCell className={classes.th}>Type</TableCell>
                    <TableCell className={classes.th}>Date</TableCell>
                    <TableCell className={classes.th}>Param</TableCell>
                    <TableCell className={classes.th}>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    && rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell>website</TableCell>
                        <TableCell>{row.createdAt}</TableCell>
                        <TableCell>InitRecvTimeout = 500</TableCell>
                        <TableCell>www.apple.com</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
 export default withStyles(styles)(UpdatedItems);