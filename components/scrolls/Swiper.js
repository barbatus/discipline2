import React, { PureComponent } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';

import { caller } from 'app/utils/lang';

import { commonStyles, SCREEN_WIDTH } from '../styles/common';

import BaseScroll from './BaseScroll';

const stylesDef = {
  slide: {
    flex: 1,
    width: SCREEN_WIDTH,
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
    bottom: 20,
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
  scroll = React.createRef();

  static propTypes = {
    slides: PropTypes.array.isRequired,
    style: ViewPropTypes.style,
    scrollEnabled: PropTypes.bool,
    onSlideChange: PropTypes.func,
    onTouchMove: PropTypes.func,
    onBeginDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onSlideNoChange: PropTypes.func,
  };

  static defaultProps = {
    style: null,
    scrollEnabled: true,
    onSlideChange: null,
    onTouchMove: null,
    onBeginDrag: null,
    onEndDrag: null,
    onSlideNoChange: null,
  };

  constructor(props) {
    super(props);
    this.onSlideChange = ::this.onSlideChange;
    this.state = { index: 0 };
  }

  get index() {
    return this.state.index;
  }

  onSlideChange(index, previ, animated) {
    this.setState({ index });
    caller(this.props.onSlideChange, index, previ, animated);
  }

  scrollTo(index, callback, animated) {
    this.scroll.current.scrollTo(index, callback, animated);
  }

  /**
   * Scales dot radius.
   * Basic radius 7px, with scaling
   * propor. to the number of slides.
   */
  scaleDot(size: number) {
    let radius = 7;
    let margin = 7;
    if (size >= 18) {
      const ratio = 18 / size;
      radius = Math.floor((8 * ratio));
      margin = Math.floor((8 * ratio));
    }

    return {
      width: radius,
      height: radius,
      borderRadius: radius / 2,
      marginRight: margin,
    };
  }

  renderDots(index: number, size: number) {
    if (size <= 1) {return null;}

    const dots = [];
    const basicDot = [styles.basicDot, this.scaleDot(size)];
    for (let i = 0; i < size; i += 1) {
      const dotStyle = i === index ? [basicDot, styles.activeDot] : basicDot;
      dots.push(<View key={i} style={dotStyle} />);
    }

    return (
      <Animated.View pointerEvents="none" style={styles.dotsContainer}>
        <View style={styles.dots}>
          {dots}
        </View>
      </Animated.View>
    );
  }

  render() {
    const {
      style,
      slides,
      onTouchMove,
      onBeginDrag,
      onEndDrag,
      scrollEnabled,
      onSlideNoChange,
    } = this.props;
    const { index } = this.state;

    const dots = slides.length >= 2 ? this.renderDots(index, slides.length) : null;
    return (
      <View style={style}>
        <BaseScroll
          ref={this.scroll}
          style={commonStyles.flexFilled}
          slides={slides}
          slideWidth={SCREEN_WIDTH}
          onTouchMove={onTouchMove}
          onScrollBeginDrag={onBeginDrag}
          onScrollEndDrag={onEndDrag}
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
