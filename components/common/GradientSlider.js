import React, { PureComponent } from 'react';

import { StyleSheet, View, Animated } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Dimensions from 'Dimensions';

import { commonDef, screenWidth } from '../styles';

const styles = StyleSheet.create({
  gradient: commonDef.absFilled,
});

const grads = [
  {
    start: '#60C2E3',
    end: '#E97490',
  },
  {
    start: '#E97490',
    end: '#FBDDB7',
  },
  {
    start: '#FBDDB7',
    end: '#FFA878',
  },
  {
    start: '#FFA878',
    end: '#9FC1E7',
  },
  {
    start: '#9FC1E7',
    end: '#B454A6',
  },
  {
    start: '#B454A6',
    end: '#E68C7D',
  },
  {
    start: '#E68C7D',
    end: '#60C2E3',
  },
];

const rightOut = screenWidth - 1;
const leftOut = -screenWidth + 1;

export default class GradientSlider extends PureComponent {
  slides = ['left', 'center', 'right'];

  gradInd = 0;

  isSliding = false;

  constructor(props) {
    super(props);

    this.state = {
      left: {
        grad: this.getGrad(-1),
        move: new Animated.Value(leftOut),
      },
      center: {
        grad: this.getGrad(0),
        move: new Animated.Value(0),
      },
      right: {
        grad: this.getGrad(1),
        move: new Animated.Value(rightOut),
      },
    };
  }

  getGrad(index) {
    const residue = index % grads.length;
    const grad = residue >= 0 ?
      grads[residue] : grads[grads.length + residue];
    return [grad.start, grad.end];
  }

  slide(dx) {
    if (this.isSliding) return;

    const left = this.state[this.slides[0]];
    const leftVal = left.move._value;
    const leftDx = Math.min(leftVal - dx, 0);
    left.move.setValue(leftDx);

    const center = this.state[this.slides[1]];
    const centerVal = center.move._value;
    const centerDx = centerVal - dx;
    center.move.setValue(centerDx);

    const right = this.state[this.slides[2]];
    const rightVal = right.move._value;
    const rightDx = Math.max(rightVal - dx, 0);
    right.move.setValue(rightDx);
  }

  finishSlide(dir) {
    if (this.isSliding) return;

    this.isSliding = true;

    if (dir > 0) {
      Animated.parallel([
        Animated.timing(this.state[this.slides[2]].move, {
          toValue: 0,
        }),
        Animated.timing(this.state[this.slides[1]].move, {
          toValue: leftOut,
        }),
        Animated.timing(this.state[this.slides[0]].move, {
          toValue: leftOut,
        }),
      ]).start(() => {
        this.gradInd += 1;
        const slide0 = this.slides[0];
        const slide1 = this.slides[1];
        this.state[slide0].move.setValue(rightOut);
        this.setState(
          {
            [slide0]: {
              grad: this.getGrad(this.gradInd + 1),
              move: this.state[slide0].move,
            },
            [slide1]: {
              grad: this.getGrad(this.gradInd - 1),
              move: this.state[slide1].move,
            },
          },
          () => {
            this.isSliding = false;
          },
        );

        this.slides.push(slide0);
        this.slides.shift();
      });
    } else {
      Animated.parallel([
        Animated.timing(this.state[this.slides[0]].move, {
          toValue: 0,
        }),
        Animated.timing(this.state[this.slides[1]].move, {
          toValue: rightOut,
        }),
        Animated.timing(this.state[this.slides[2]].move, {
          toValue: rightOut,
        }),
      ]).start(() => {
        this.gradInd -= 1;
        const slide2 = this.slides[2];
        const slide1 = this.slides[1];
        this.state[slide2].move.setValue(leftOut);
        this.setState(
          {
            [slide2]: {
              grad: this.getGrad(this.gradInd - 1),
              move: this.state[slide2].move,
            },
            [slide1]: {
              grad: this.getGrad(this.gradInd + 1),
              move: this.state[slide1].move,
            },
          },
          () => {
            this.isSliding = false;
          },
        );

        this.slides.pop();
        this.slides.splice(0, 0, slide2);
      });
    }
  }

  finishNoSlide() {
    if (this.isSliding) return;

    this.isSliding = true;
    Animated.parallel([
      Animated.timing(this.state[this.slides[2]].move, {
        toValue: rightOut,
      }),
      Animated.timing(this.state[this.slides[1]].move, {
        toValue: 0,
      }),
      Animated.timing(this.state[this.slides[0]].move, {
        toValue: leftOut,
      }),
    ]).start(() => {
      this.isSliding = false;
    });
  }

  render() {
    const { left, center, right } = this.state;
    return (
      <View style={this.props.style}>
        <Animated.View
          style={[
            styles.gradient,
            {
              transform: [{ translateX: left.move }],
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={left.grad}
            style={styles.gradient}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.gradient,
            {
              transform: [{ translateX: center.move }],
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={center.grad}
            style={styles.gradient}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.gradient,
            {
              transform: [{ translateX: right.move }],
            },
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={right.grad}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    );
  }
}
