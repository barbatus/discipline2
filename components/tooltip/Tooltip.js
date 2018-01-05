import React, { PureComponent } from 'react';

import { Animated, StyleSheet, View, findNodeHandle } from 'react-native';

import styled from 'styled-components/native';

import NativeMethodsMixin from 'NativeMethodsMixin';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import { pure } from 'recompose';

import { screenWidth, navHeight } from '../styles/common';

const ARROW_WIDTH = 25;

const ARROW_HEIHGT = 10;

const TOP_MARGIN = 15;

const PADDING = 10;

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
  arrDown: {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: ARROW_HEIHGT,
    borderRightWidth: ARROW_WIDTH / 2,
    borderBottomWidth: 0,
    borderLeftWidth: ARROW_WIDTH / 2,
    borderTopColor: '#BD8E83',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrUp: {
    borderTopWidth: 0,
    borderRightWidth: ARROW_WIDTH / 2,
    borderBottomWidth: ARROW_HEIHGT,
    borderLeftWidth: ARROW_WIDTH / 2,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#BD8E83',
    borderLeftColor: 'transparent',
  },
});

const ArrowView = styled.View`
  width: 0;
  height: 0;
  position: absolute;
`;

const ArrowFn = ({ x, y }) => {
  const arrStyle = y > 0 ? [styles.arrDown] : [styles.arrUp];
  arrStyle.push({ left: x, top: y });
  return <ArrowView style={arrStyle} />;
};

const Arrow = pure(ArrowFn);

export default class Tooltip extends PureComponent {
  opacity = new Animated.Value(0);

  moveY = new Animated.Value(0);

  moveX = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      arrLeft: 0,
      arrTop: 0,
    };
  }

  updatePos() {
    const node = findNodeHandle(this.view);
    if (node) {
      this.setTimeout(() => NativeMethodsMixin.measure.call(node,
        (x, y, width, height, pageX, pageY) => {
          const haflW = width / 2;
          const rightX = x + width / 2 - screenWidth + PADDING;
          const leftX = x - width / 2 - PADDING;
          let xPos = -haflW;
          let arrLeft = (width - ARROW_WIDTH) / 2;
          // If tooltip is out of the screen on the right.
          if (rightX >= 0) {
            xPos = -haflW - rightX;
            arrLeft += rightX;
          }

          // If tooltip is out of the screen on the left.
          if (leftX <= 0) {
            xPos = -haflW + Math.abs(leftX);
            arrLeft += leftX;
          }

          let yPos = -height - TOP_MARGIN;
          let arrTop = height;
          if (navHeight > pageY + yPos) {
            yPos = Math.abs(33 + TOP_MARGIN);
            arrTop = -ARROW_HEIHGT;
          }

          this.moveY.setValue(yPos);
          this.moveX.setValue(xPos);
          this.opacity.setValue(1);
          this.setState({
            arrTop,
            arrLeft,
          });
        }), 15);
    }
  }

  componentDidMount() {
    this.updatePos();
  }

  componentWillReceiveProps({ x, y }) {
    if (this.props.x !== x || this.props.y !== y) {
      this.moveY.setValue(0);
      this.moveX.setValue(0);
      this.updatePos();
    }
  }

  render() {
    const { x, y } = this.props;
    const { arrLeft, arrTop } = this.state;
    const animStyle = {
      left: x,
      top: y,
      opacity: this.opacity,
      transform: [
        { translateY: this.moveY },
        { translateX: this.moveX },
      ],
    };
    return (
      <Animated.View
        ref={(el) => this.view = el}
        style={[styles.view, animStyle]}
      >
        <View>{this.props.children}</View>
        <Arrow x={arrLeft} y={arrTop} />
      </Animated.View>
    );
  }
}

reactMixin(Tooltip.prototype, TimerMixin);
