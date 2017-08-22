'use strict';

import React, { PureComponent } from 'react';

import { Animated, StyleSheet, View, Text, findNodeHandle } from 'react-native';

import NativeMethodsMixin from 'NativeMethodsMixin';

import { commonStyles, screenWidth, navHeight } from '../styles/common';

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    backgroundColor: '#BD8E83',
    minWidth: 100,
    minHeight: 40,
    borderRadius: 3,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    zIndex: 3,
  },
});

export default class Tooltip extends PureComponent {
  opacity = new Animated.Value(0);

  moveY = new Animated.Value(0);

  moveX = new Animated.Value(0);

  componentDidMount() {
    const node = findNodeHandle(this.refs.view);
    if (node) {
      setTimeout(
        () =>
          NativeMethodsMixin.measure.call(
            node,
            (x, y, width, height, pageX, pageY) => {
              const haflW = width / 2;
              const rightX = x + width / 2 - screenWidth;
              const leftX = x - width / 2;
              let xPos = -haflW;
              if (rightX >= 0) {
                xPos = -haflW - rightX - 10;
              }

              if (leftX <= 0) {
                xPos = -haflW + Math.abs(leftX) + 10;
              }

              let yPos = -height - 8;
              if (navHeight > pageY + yPos) {
                yPos = Math.abs(33 + 8);
              }

              this.moveY.setValue(yPos);
              this.moveX.setValue(xPos);
              this.opacity.setValue(1);
            },
          ),
        15,
      );
    }
  }

  render() {
    const { x, y } = this.props;
    const animStyle = {
      left: x,
      top: y,
      opacity: this.opacity,
      transform: [{ translateY: this.moveY }, { translateX: this.moveX }],
    };
    return (
      <Animated.View ref="view" style={[styles.view, animStyle]}>
        {this.props.children}
      </Animated.View>
    );
  }
}
