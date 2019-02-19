import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const deleteDialog = ({
  dn, open, cancel, confirm
}) => (
  <div>
    <Dialog
      open={open}
      onClose={cancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">You Are Deleting</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <b>{dn}</b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirm} color="primary">
          Confirm
        </Button>
        <Button onClick={cancel} color="secondary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

deleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

export default deleteDialog;
