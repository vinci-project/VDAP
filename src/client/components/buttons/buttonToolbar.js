import React from 'react';
import { Button as MButton, withStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';
 const styles = theme => ({
  btnLabel: {
    display: 'block'
  },
  btnColor: {
    color: '#ffffff'
  },
  icon: {
    display: 'block',
    textAlign: 'center',
    width: '100%'
  },
  label: {
    display: 'block',
    textAlign: 'center',
    width: '100%'
  }
});
 const CustomButton = (props) => {
  const {
    className, classes, icon, label, color, ...rest
  } = props;
   const buttonClasses = classNames({
    [classes.root]: true,
     [className]: className
  });
   const labelClasses = classNames({
    [classes.btnColor]: !color,
    [classes.btnLabel]: true
  });
   return (
    <MButton className={buttonClasses} classes={{ label: labelClasses }} {...rest}>
      <Icon className={classes.icon}>{icon}</Icon>
      <span className={classes.label}>{label}</span>
    </MButton>
  );
};
 const ComposedButton = withStyles(styles)(CustomButton);
export { ComposedButton as Button };
export default ComposedButton;