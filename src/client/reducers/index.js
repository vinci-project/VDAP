import { createStore } from 'redux';

const treeReducer = (
  state = {
    tree: {}
  },
  action
) => {
  switch (action.type) {
    case 'RELOAD':
      return action.payload;
    default:
      return state;
  }
};

export default createStore(treeReducer);
