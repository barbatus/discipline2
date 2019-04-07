import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import NavBar from '../nav/NavBar';
import {
  OFFSET_TOP,
  SCREEN_WIDTH,
  WIN_HEIGHT,
  NAV_HEIHGT,
  CONTENT_TOP_MARGIN,
} from '../styles/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: OFFSET_TOP,
  },
  content: {
    top: CONTENT_TOP_MARGIN,
    height: WIN_HEIGHT - NAV_HEIHGT,
    width: SCREEN_WIDTH,
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
      setButtons: (leftBtn, rightBtn, callback, animated) => {
        this.navBarRef.setButtons(leftBtn, rightBtn, callback, animated);
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
