import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';

import NavBar from '../nav/NavBar';

import { screenWidth, screenHeight, navHeight } from '../styles/common';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  content: {
    height: screenHeight - navHeight,
    width: screenWidth,
  },
});

export default class Screen extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      navBar: this.navBar,
    };
  }

  get navBar() {
    return {
      setButtons: (leftBtn, rightBtn, callback) => {
        this.navBarRef.setButtons(leftBtn, rightBtn, callback);
      },
      setDisabled: (disabled, callback) => {
        this.navBarRef.setDisabled(disabled, callback);
      },
      setTitle: (navTitle: string) => {
        this.navBarRef.setTitle(navTitle);
      },
      setOpacity: (dp: number) => {
        this.navBarRef.setOpacity(dp);
      },
    };
  }

  render() {
    const { children } = this.props;
    return (
      <View style={styles.container}>
        <NavBar ref={(el) => (this.navBarRef = el)} />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }
}
