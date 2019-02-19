import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  AppBar, Toolbar, Typography, withStyles, CssBaseline
} from '@material-ui/core';
import Button from './buttons/buttonToolbar';
 const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    fontSize: 20,
    color: '#ffffff'
  },
  navBtns: {
    minWidth: 270
  },
  authBtns: {
    minWidth: 270,
    textAlign: 'right'
  }
});
 class titleBar extends Component {
  state = {};
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
    const { history, classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item className={classes.navBtns}>
                <Grid container>
                  <Grid item>
                    <Button onClick={this.refresh} icon="refresh" label="Refresh" />
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => history.push('/dashboard/search')}
                      icon="search"
                      label="Search"
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => history.push('/reports')}
                      icon="list_alt"
                      label="Reports"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="h1" noWrap className={classes.title}>
                  CDAP Server
                </Typography>
              </Grid>
              <Grid item className={classes.authBtns}>
                <Button onClick={this.logout} icon="exit_to_app" label="Logout" />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}
 export default withStyles(styles)(titleBar);