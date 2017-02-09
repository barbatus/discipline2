'use strict'

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';

import {commonStyles, screenWidth} from '../styles/common';

import BaseScroll from './BaseScroll';

import {caller} from '../../utils/lang';

const Swiper = React.createClass({
  propTypes: {
    slides: React.PropTypes.array.isRequired,
    style: View.propTypes.style,
    scrollEnabled: React.PropTypes.bool,
    index: React.PropTypes.number,
  },

  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      index: 0,
      slides: [],
      scrollEnabled: true
    }
  },

  getSize() {
    return this.props.slides.length;
  },

  isEnabled() {
    return this.refs.scroll.isEnabled();
  },

  getIndex() {
    return this.refs.scroll.getIndex();
  },

  shouldComponentUpdate(props, state) {
    return this.props.slides !== props.slides ||
           this.props.scrollEnabled !== props.scrollEnabled;
  },

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  },

  _renderDots(index, size) {
    if (size <= 1) return null;

    const dots = [];
    const basicDot = [styles.basicDot, this._scaleDot(size)];
    for(let i = 0; i < size; i++) {
      const dotStyle = i === index ? 
        [basicDot, styles.activeDot] : basicDot;
      dots.push(<View ref={'page' + i} key={i} style={dotStyle} />);
    }

    return (
      <Animated.View
        pointerEvents='none'
        style={styles.dotsContainer}>
        <View style={styles.dots}>
          {dots}
        </View>
      </Animated.View>
    );
  },

  _setActiveDot(curInd, prevInd) {
    if (this.refs['page' + prevInd]) {
      this.refs['page' + prevInd].setNativeProps({
        style: {
          backgroundColor: stylesDef.basicDot.backgroundColor
        }
      });
    }

    if (this.refs['page' + curInd]) {
      this.refs['page' + curInd].setNativeProps({
        style: {
          backgroundColor: stylesDef.activeDot.backgroundColor
        }
      });
    }
  },

  /**
   * Scales dot radius.
   * Basic radius 7px, with scaling
   * propor. to the number of slides.
   */
  _scaleDot(size) {
    let radius = 7, margin = 7;
    if (size >= 18) {
      let ratio = 18 / size;
      radius = (7 * ratio) << 0;
      margin = (7 * ratio) << 0;
    }

    return {
      width: radius,
      height: radius,
      borderRadius: radius / 2,
      marginRight: margin
    };
  },

  _renderSlide(slide, key) {
    return (
      <View style={styles.slide} key={key}>
        {slide}
      </View>
    );
  },

  _onSlideChange(index, previ) {
    this._setActiveDot(index, previ);
    caller(this.props.onSlideChange, index, previ);
  },

  render() {
    let {
      index, style, slides, onTouchMove,
      scrollEnabled, onSlideNoChange
    } = this.props;

    let dots = slides.length >= 2 ?
      this._renderDots(index, slides.length) : null;

    return (
      <View style={style}>
        <BaseScroll
          ref='scroll'
          style={commonStyles.flexFilled}
          index={index}
          slides={slides}
          slideWidth={screenWidth}
          onTouchMove={onTouchMove}
          scrollEnabled={scrollEnabled}
          onSlideChange={this._onSlideChange}
          onSlideNoChange={onSlideNoChange}>
        </BaseScroll>
        {dots}
      </View>
    );
  }
});

const stylesDef = {
  slide: {
    flex: 1,
    width: screenWidth,
    alignItems: 'center'
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
  },
  basicDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 7,
    height: 7,
    borderRadius: 4,
    marginBottom: 5,
    marginRight: 5
  },
  activeDot: {
    backgroundColor: 'rgb(255, 255, 255)'
  }
};

const styles = StyleSheet.create(stylesDef);

export default Swiper;
