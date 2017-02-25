'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { commonStyles, screenWidth } from '../styles/common';

import BaseScroll from './BaseScroll';

import { caller } from '../../utils/lang';

export default class Swiper extends Component {
  _index = 0;

  static propTypes = {
    slides: React.PropTypes.array.isRequired,
    style: View.propTypes.style,
    scrollEnabled: React.PropTypes.bool,
  };

  static defaultProps = {
    slides: [],
    scrollEnabled: true,
  };

  get index() {
    return this._index;
  }

  shouldComponentUpdate(props, state) {
    return this.props.slides !== props.slides ||
      this.props.scrollEnabled !== props.scrollEnabled;
  }

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  }

  _renderDots(index, size) {
    if (size <= 1) return null;

    const dots = [];
    const basicDot = [styles.basicDot, this._scaleDot(size)];
    for (let i = 0; i < size; i++) {
      const dotStyle = i === index ? [basicDot, styles.activeDot] : basicDot;
      dots.push(<View ref={'page' + i} key={i} style={dotStyle} />);
    }

    return (
      <Animated.View pointerEvents="none" style={styles.dotsContainer}>
        <View style={styles.dots}>
          {dots}
        </View>
      </Animated.View>
    );
  }

  _setActiveDot(curInd, prevInd) {
    if (this.refs['page' + prevInd]) {
      this.refs['page' + prevInd].setNativeProps({
        style: {
          backgroundColor: stylesDef.basicDot.backgroundColor,
        },
      });
    }

    if (this.refs['page' + curInd]) {
      this.refs['page' + curInd].setNativeProps({
        style: {
          backgroundColor: stylesDef.activeDot.backgroundColor,
        },
      });
    }
  }

  /**
   * Scales dot radius.
   * Basic radius 7px, with scaling
   * propor. to the number of slides.
   */
  _scaleDot(size) {
    let radius = 7, margin = 7;
    if (size >= 18) {
      let ratio = 18 / size;
      radius = 7 * ratio << 0;
      margin = 7 * ratio << 0;
    }

    return {
      width: radius,
      height: radius,
      borderRadius: radius / 2,
      marginRight: margin,
    };
  }

  _renderSlide(slide, key) {
    return (
      <View style={styles.slide} key={key}>
        {slide}
      </View>
    );
  }

  _onSlideChange(index, previ) {
    this._index = index;
    this._setActiveDot(index, previ);
    caller(this.props.onSlideChange, index, previ);
  }

  render() {
    const {
      style,
      slides,
      onTouchMove,
      scrollEnabled,
      onSlideNoChange,
    } = this.props;

    const dots = slides.length >= 2
      ? this._renderDots(this._index, slides.length)
      : null;

    return (
      <View style={style}>
        <BaseScroll
          ref="scroll"
          style={commonStyles.flexFilled}
          slides={slides}
          slideWidth={screenWidth}
          onTouchMove={onTouchMove}
          scrollEnabled={scrollEnabled}
          onSlideChange={::this._onSlideChange}
          onSlideNoChange={onSlideNoChange}
        />
        {dots}
      </View>
    );
  }
}

const stylesDef = {
  slide: {
    flex: 1,
    width: screenWidth,
    alignItems: 'center',
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  basicDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 7,
    height: 7,
    borderRadius: 4,
    marginBottom: 5,
    marginRight: 5,
  },
  activeDot: {
    backgroundColor: 'rgb(255, 255, 255)',
  },
};

const styles = StyleSheet.create(stylesDef);
