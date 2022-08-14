import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import NavBar from 'app/components/nav/NavBar';
import {
  SCREEN_WIDTH,
  CONTENT_TOP_MARGIN,
  CONTENT_HEIGHT,
} from 'app/components/styles/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 100,
  },
  content: {
    paddingTop: CONTENT_TOP_MARGIN,
    height: CONTENT_HEIGHT,
    width: SCREEN_WIDTH,
  },
});

export default class Screen extends PureComponent {
  navBarRef = React.createRef();

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
        this.navBarRef.current.setButtons(
          leftBtn,
          rightBtn,
          callback,
          animated,
        );
      },
      setDisabled: (disabled, callback) => {
        this.navBarRef.current.setDisabled(disabled, callback);
      },
      setTitle: (navTitle: string) => {
        this.navBarRef.current.setTitle(navTitle);
      },
      setOpacity: (dp: number) => {
        this.navBarRef.current.setOpacity(dp);
      },
    };
  }

  render() {
    const { children } = this.props;
    return (
      <View style={styles.container}>
        <NavBar ref={this.navBarRef} />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }
}
