'use strict';

import React, { Component } from 'react';

import { StyleSheet, View, Animated } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');

const grads = [{
    start: '#60C2E3',
    end: '#E97490'
  }, {
    start: '#E97490',
    end: '#FBDDB7'
  }, {
    start: '#FBDDB7',
    end: '#FFA878'
  }, {
    start: '#FFA878',
    end: '#9FC1E7'
  }, {
    start: '#9FC1E7',
    end: '#B454A6'
  }, {
    start: '#B454A6',
    end: '#E68C7D'
  }, {
    start: '#E68C7D',
    end: '#60C2E3'
  }
];

const rightOut = window.width - 1;
const leftOut = -window.width + 1;

class GradientSlider extends Component {
  constructor(props) {
    super(props);

    this._slides = ['left', 'center', 'right'];
    this._gradInd = 0;

    this.state = {
      left: {
        grad: this._getGrad(-1),
        move: new Animated.Value(leftOut)
      },
      center: {
        grad: this._getGrad(0),
        move: new Animated.Value(0)
      },
      right: {
        grad: this._getGrad(1),
        move: new Animated.Value(rightOut)
      }
    };
  }

  _getGrad(index) {
    let residue = index % grads.length;
    let grad = residue >= 0 ? grads[residue] : grads[grads.length + residue];
    return [grad.start, grad.end];
  }

  slide(dx) {
    if (this._isAnimated) return;

    let left = this.state[this._slides[0]];
    let leftVal = left.move._value;
    let leftDx = Math.min(leftVal - dx, 0);
    left.move.setValue(leftDx);

    let center = this.state[this._slides[1]];
    let centerVal = center.move._value;
    let centerDx = centerVal - dx;
    center.move.setValue(centerDx);

    let right = this.state[this._slides[2]];
    let rightVal = right.move._value;
    let rightDx = Math.max(rightVal - dx, 0);
    right.move.setValue(rightDx);
  }

  finishSlide(dir) {
    if (this._isAnimated) return;

    this._isAnimated = true;

    if (dir > 0) {
      Animated.parallel([
        Animated.timing(this.state[this._slides[2]].move, {
          toValue: 0
        }),
        Animated.timing(this.state[this._slides[1]].move, {
          toValue: leftOut
        }),
        Animated.timing(this.state[this._slides[0]].move, {
          toValue: leftOut
        })
      ]).start(() => {

        this._gradInd += 1;
        let slide0 = this._slides[0];
        let slide1 = this._slides[1];
        this.state[slide0].move.setValue(rightOut);
        this.setState({
          [slide0]: {
            grad: this._getGrad(this._gradInd + 1),
            move: this.state[slide0].move
          },
          [slide1]: {
            grad: this._getGrad(this._gradInd - 1),
            move: this.state[slide1].move
          }
        }, () => {
          this._isAnimated = false;
        });

        this._slides.push(slide0);
        this._slides.shift();
      });
    } else {
      Animated.parallel([
        Animated.timing(this.state[this._slides[0]].move, {
          toValue: 0
        }),
        Animated.timing(this.state[this._slides[1]].move, {
          toValue: rightOut
        }),
        Animated.timing(this.state[this._slides[2]].move, {
          toValue: rightOut
        })
      ]).start(() => {

        this._gradInd -= 1;
        let slide2 = this._slides[2];
        let slide1 = this._slides[1];
        this.state[slide2].move.setValue(leftOut);
        this.setState({
          [slide2]: {
            grad: this._getGrad(this._gradInd - 1),
            move: this.state[slide2].move
          },
          [slide1]: {
            grad: this._getGrad(this._gradInd + 1),
            move: this.state[slide1].move
          }
        }, () => {
          this._isAnimated = false;
        });

        this._slides.pop();
        this._slides.splice(0, 0, slide2);
      });
    }
  }

  finishNoSlide(dir) {
    if (this._isAnimated) return;

    this._isAnimated = true;
    Animated.parallel([
      Animated.timing(this.state[this._slides[2]].move, {
        toValue: rightOut
      }),
      Animated.timing(this.state[this._slides[1]].move, {
        toValue: 0
      }),
      Animated.timing(this.state[this._slides[0]].move, {
        toValue: leftOut
      })
    ]).start(() => {
      this._isAnimated = false;
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        <Animated.View
          style={[
            styles.gradient, {
              transform:[{
                translateX: this.state.left.move
              }]
            }
          ]}>
          <LinearGradient
            start={[0, 0.5]} end={[1, 0.5]}
            colors={this.state.left.grad}
            style={styles.gradient} />
        </Animated.View>
        <Animated.View
          style={[
            styles.gradient, {
              transform:[{
                translateX: this.state.center.move
              }]
            }
          ]}>
          <LinearGradient
            start={[0, 0.5]} end={[1, 0.5]}
            colors={this.state.center.grad}
            style={styles.gradient} />
        </Animated.View>
        <Animated.View
          style={[
            styles.gradient, {
              transform:[{
                translateX: this.state.right.move
              }]
            }
          ]}>
          <LinearGradient
            start={[0, 0.5]} end={[1, 0.5]}
            colors={this.state.right.grad}
            style={styles.gradient} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  }
});

module.exports = GradientSlider;
