import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';

import api from '../utils/api';

class Tree extends Component {
  state = {
    open: false
  };

  componentDidMount = () => {
    this.setState({
      open: false
    });
  };

  handleClick = async (item) => {
    // console.log(item);

    // const { data } = await api.search({
    //   base: item.name,
    //   options: {
    //     scope: 'one'
    //   }
    // });

    // console.log(data);

    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  detail = () => {
    const { history, item } = this.props;
    history.push('/dashboard/empty');
    setTimeout(() => {
      history.replace(`/dashboard/entry/${item.dn}`);
    });
  };

  create = () => {
    const { history, item } = this.props;
    history.push('/dashboard/empty');
    setTimeout(() => {
      history.push('/dashboard/create', {
        dn: item.dn
      });
    });
  };

  render() {
    const { item, history } = this.props;
    const { open } = this.state;
    return (
      <div>
        <ListItem style={{ padding: '10px 0' }} button onClick={this.detail}>
          <ListItemIcon style={{ marginRight: '0' }}>
            <Icon>{item.icon ? item.icon : 'list'}</Icon>
          </ListItemIcon>
          <ListItemText
            style={{ padding: 0, paddingLeft: '10px' }}
            className={
              item.dn == history.location.pathname.replace('/dashboard/entry/', '')
                ? 'tree-active'
                : ''
            }
            inset
            primary={item.name}
          />
          {open ? (
            <Icon onClick={() => this.handleClick(item)}>expand_more</Icon>
          ) : (
            <Icon onClick={() => this.handleClick(item)}>expand_less</Icon>
          )}
        </ListItem>

        <Collapse style={{ paddingLeft: '15px' }} in={open} timeout="auto" unmountOnExit>
          {item.children
            && item.children.map((_item, index) => (
              <Tree history={history} key={index} item={_item} />
            ))}
          <ListItem style={{ padding: '10px 0' }} button onClick={this.create}>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText style={{ padding: 0 }} inset primary="Create an entry" />
          </ListItem>
        </Collapse>
      </div>
    );
  }
}

export default Tree;
