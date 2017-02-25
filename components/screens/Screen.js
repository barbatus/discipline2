'use strict';

import React, { Component } from 'react';

import { StyleSheet, View, Text, Animated } from 'react-native';

import NavBar from '../nav/NavBar';

export default class Screen extends Component {
  getChildContext() {
    return {
      navBar: this.navBar,
    };
  }

  get navBar() {
    return {
      setButtons: (leftBtn, rightBtn, callback) => {
        this.refs.navBar.setButtons(leftBtn, rightBtn, callback);
      },
      setDisabled: (disabled, callback) => {
        this.refs.navBar.setDisabled(disabled, callback);
      },
      setTitle: (navTitle: string) => {
        this.refs.navBar.setTitle(navTitle);
      },
      setOpacity: (dp: number) => {
        this.refs.navBar.setOpacity(dp);
      },
    };
  }

  render() {
    const {
      content,
      background,
      navigator,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          {background}
        </View>
        <NavBar ref="navBar" />
        <View style={styles.content}>
          {content}
        </View>
      </View>
    );
  }
}

Screen.childContextTypes = {
  navBar: React.PropTypes.object.isRequired,
};

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    height: window.height,
    width: window.width,
  },
  content: {
    height: window.height - 64,
    width: window.width,
  },
});
