'use strict';

import React, { Component } from 'react';

import { TouchableOpacity, Text, Image } from 'react-native';

import { debounce } from 'lodash';

import { getIcon } from '../../icons/icons';

import styles from './styles';

class NavButton extends Component {
  render() {
    let onPress = debounce(this.props.onPress, 30);

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

class NavAddButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'new'}
        iconStyle={styles.newIcon}
        style={styles.navBarRightButton}
      />
    );
  }
}

class NavBackButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'back'}
        iconStyle={styles.backIcon}
        style={styles.navBarLeftButton}
      />
    );
  }
}

class NavMenuButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'menu'}
        iconStyle={styles.menuIcon}
        style={styles.navBarLeftButton}
      />
    );
  }
}

class NavCancelButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'cancel'}
        iconStyle={styles.cancelIcon}
        style={styles.navBarLeftButton}
      />
    );
  }
}

class NavAcceptButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'accept'}
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
};
