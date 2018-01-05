import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import { commonStyles, screenWidth } from '../styles/common';

import BaseScroll from './BaseScroll';

import { caller } from '../../utils/lang';

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

export default class Swiper extends PureComponent {
  static propTypes = {
    slides: PropTypes.array.isRequired,
    style: View.propTypes.style,
    scrollEnabled: PropTypes.bool,
  };

  static defaultProps = {
    slides: [],
    scrollEnabled: true,
  };

  index = 0;

  constructor(props) {
    super(props);
    this.onSlideChange = ::this.onSlideChange;
  }

  scrollTo(index, callback, animated) {
    this.scroll.scrollTo(index, callback, animated);
  }

  renderDots(index, size) {
    if (size <= 1) return null;

    const dots = [];
    const basicDot = [styles.basicDot, this.scaleDot(size)];
    for (let i = 0; i < size; i += 1) {
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

  setActiveDot(curInd, prevInd) {
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
  scaleDot(size) {
    let radius = 7,
      margin = 7;
    if (size >= 18) {
      const ratio = 18 / size;
      radius = Math.floor((7 * ratio));
      margin = Math.floor((7 * ratio));
    }

    return {
      width: radius,
      height: radius,
      borderRadius: radius / 2,
      marginRight: margin,
    };
  }

  renderSlide(slide, key) {
    return (
      <View style={styles.slide} key={key}>
        {slide}
      </View>
    );
  }

  onSlideChange(index, previ, animated) {
    this.index = index;
    this.setActiveDot(index, previ);
    caller(this.props.onSlideChange, index, previ, animated);
  }

  render() {
    const {
      style,
      slides,
      onTouchMove,
      scrollEnabled,
      onSlideNoChange,
    } = this.props;

    const dots = slides.length >= 2 ?
      this.renderDots(this.index, slides.length) : null;

    return (
      <View style={style}>
        <BaseScroll
          ref={(el) => this.scroll = el}
          style={commonStyles.flexFilled}
          slides={slides}
          slideWidth={screenWidth}
          onTouchMove={onTouchMove}
          scrollEnabled={scrollEnabled}
          onSlideChange={this.onSlideChange}
          onSlideNoChange={onSlideNoChange}
          removeClippedSubviews={false}
        />
        {dots}
      </View>
    );
  }
}
