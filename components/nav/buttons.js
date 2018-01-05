import React, { PureComponent } from 'react';

import { pure } from 'recompose';

import { TouchableOpacity, Image } from 'react-native';

import debounce from 'lodash/debounce';

import { getIcon } from '../../icons/icons';

import styles from './styles';

class NavButton extends PureComponent {
  render() {
    const onPress = this.props.onPress
      ? debounce(this.props.onPress, 30)
      : null;
    return (
      <TouchableOpacity onPress={onPress} style={this.props.style}>
        <Image
          source={getIcon(this.props.icon)}
          style={[styles.navBarIcon, this.props.iconStyle]}
        />
      </TouchableOpacity>
    );
  }
}

const NavLeftButtonFn = (props) =>
  <NavButton
    {...props}
    iconStyle={styles.newIcon}
    style={styles.navBarLeftButton}
  />;

const NavLeftButton = pure(NavLeftButtonFn);

const NavRightButtonFn = (props) =>
  <NavButton
    {...props}
    iconStyle={styles.newIcon}
    style={styles.navBarRightButton}
  />;

const NavRightButton = pure(NavRightButtonFn);

const NavAddButtonFn = (props) =>
  <NavButton
    {...props}
    icon="new"
    iconStyle={styles.newIcon}
    style={styles.navBarRightButton}
  />;

const NavAddButton = pure(NavAddButtonFn);

const NavBackButtonFn = (props) =>
  <NavButton
    {...props}
    icon="back"
    iconStyle={styles.backIcon}
    style={styles.navBarLeftButton}
  />;

const NavBackButton = pure(NavBackButtonFn);

const NavMenuButtonFn = (props) =>
  <NavButton
    {...props}
    icon="menu"
    iconStyle={styles.menuIcon}
    style={styles.navBarLeftButton}
  />;

const NavMenuButton = pure(NavMenuButtonFn);

class NavCancelButton extends PureComponent {
  render() {
    return (
      <NavButton
        {...this.props}
        icon="cancel"
        iconStyle={styles.cancelIcon}
        style={styles.navBarLeftButton}
      />
    );
  }
}

class NavAcceptButton extends PureComponent {
  render() {
    return (
      <NavButton
        {...this.props}
        icon="accept"
        style={styles.navBarRightButton}
      />
    );
  }
}

module.exports = {
  NavButton,
  NavAddButton,
  NavBackButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton,
  NavLeftButton,
  NavRightButton,
};
