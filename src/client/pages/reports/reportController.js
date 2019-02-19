import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Grid,
  withStyles,
  Drawer,
  CssBaseline,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { Bookmark } from '@material-ui/icons';
import AppBar from '../../components/appBarReport';
import CreatedItems from './createdItems';
import UpdatedItems from './updatedItems';
import DeletedItems from './deletedItems';
 const drawerWidth = 240;
 const styles = theme => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    display: 'flex'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundImage: 'url("https://vinci.id/en/img/flower_main.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '10px 70px',
      opacity: 0.1
    }
  },
  toolbar: theme.mixins.toolbar
});
 class ReportController extends React.Component {
  state = { selectedIndex: -1 };
   componentDidMount() {
   }
   handleListItemClick = (param, index) => {
    this.setState({ selectedIndex: index });
    this.props.history.push(`/reports/${param}`);
  };
   render() {
    const { classes, history } = this.props;
     return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar history={history} />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            {[
              ['Created Items', 'createdItems'],
              ['Updated Items', 'updatedItems'],
              ['Deleted Items', 'deletedItems']
            ].map((val, index) => (
              <ListItem
                button
                onClick={() => this.handleListItemClick(val[1], index)}
                selected={this.state.selectedIndex === index}
                key={index}
              >
                <ListItemIcon>
                  <Bookmark />
                </ListItemIcon>
                <ListItemText primary={val[0]} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <PerfectScrollbar option={{ suppressScrollX: true }}>
            <Switch>
              <Route exact path="/reports/createdItems" component={CreatedItems} />
              <Route exact path="/reports/updatedItems" component={UpdatedItems} />
              <Route exact path="/reports/deletedItems" component={DeletedItems} />
              <Route component={CreatedItems} />
            </Switch>
          </PerfectScrollbar>
        </main>
      </div>
    );
  }
}
 export default withRouter(withStyles(styles)(ReportController));
