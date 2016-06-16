'use strict';

import React, {Component} from 'react';

import { StyleSheet, View, Animated } from 'react-native';

import Easing from 'Easing';

import { commonStyles } from '../styles/common';

class ScreenView extends Component {
  constructor(props) {
    super(props);

    let posX = props.posX || 0;
    this._moveX = new Animated.Value(posX);
    this._opacity = new Animated.Value(1);
  }

  get posX() {
    return this._moveX;
  }

  get opacity() {
    return this._opacity;
  }

  moveLeft(instantly, callback) {
    if (_.isFunction(instantly)) {
      callback = instantly;
      instantly = false;
    }

    let value = this.posX._value;
    if (instantly) {
      this.posX.setValue(value - 1);
      if (callback) {
        callback();
      }
      return;
    }

    Animated.timing(this.posX, {
      duration: 500,
      toValue: value - 1,
      easing: Easing.inOut(Easing.linear)
    }).start(callback);
  }

  moveRight(instantly, callback) {
    if (_.isFunction(instantly)) {
      callback = instantly;
      instantly = false;
    }

    let value = this.posX._value;
    if (instantly) {
      this.posX.setValue(value + 1);
      if (callback) {
        callback();
      }
      return;
    }

    Animated.timing(this.posX, {
      duration: 500,
      toValue: value + 1,
      easing: Easing.inOut(Easing.linear)
    }).start(callback);
  }

  setOpacity(value, animated, callback) {
    if (animated) {
      Animated.timing(this.opacity, {
        duration: 1000,
        toValue: value
      }).start(callback);
    } else {
      this.opacity.setValue(value);
      if (callback) {
        callback();
      }
    }
  }

  render() {
    return (
      <Animated.View
        shouldRasterizeIOS={true}
        style={[
          commonStyles.absoluteFilled, {
            opacity: this._opacity,
            transform: [{
              translateX: this._moveX.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-400, 0, 400]
              })
            }]
          }
        ]}>
        {this.props.content || this.content}
      </Animated.View>
    );
  }
}

ScreenView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

module.exports = ScreenView;
