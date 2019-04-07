import React, { PureComponent } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

import flatten from 'lodash/flatten';
import times from 'lodash/times';

import { commonDef, WIN_HEIGHT, SCREEN_WIDTH } from '../styles';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    height: WIN_HEIGHT,
  },
});

const COLORS = [
  '#60C2E3',
  '#E97490',
  '#FBDDB7',
  '#FFA878',
  '#9FC1E7',
  '#B454A6',
  '#E68C7D',
];

export default class GradientSlider extends PureComponent {
  static propTypes = {
    slides: PropTypes.number.isRequired,
  };

  move = new Animated.Value(0);

  get slides() {
    const { slides } = this.props;
    return Math.max(slides, 2);
  }

  getGrad(slides: number) {
    const len = COLORS.length;
    const int = Math.floor(slides / len);
    const res = Math.max(slides % len, 2);
    return flatten(times(int, () => COLORS))
      .concat(COLORS.slice(0, res));
  }

  slide() {}

  finishSlide(index, previ, animated) {
    if (!animated) {
      this.move.setValue(-index * SCREEN_WIDTH);
      return;
    }

    const diff = Math.max(Math.abs(index - previ), 1);
    Animated.timing(this.move, {
      duration: diff * 350,
      toValue: -index * SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();
  }

  finishNoSlide() {}

  render() {
    const width = this.slides * SCREEN_WIDTH;
    const grads = this.getGrad(this.slides);
    const style = [styles.background, {
      width, transform: [{ translateX: this.move }],
    }];
    return (
      <Animated.View style={style}>
        <LinearGradient
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          colors={grads}
          style={commonDef.flexFilled}
        />
      </Animated.View>
    );
  }
}
