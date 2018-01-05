import React from 'react';

import {
  View,
  Animated,
} from 'react-native';

import Scroll from '../scrolls/Scroll';

import { commonStyles, screenWidth } from '../styles/common';

import { slideHeight } from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

import { caller } from '../../utils/lang';

export default class TrackerScroll extends TrackerRenderer {
  static defaultProps = {
    responsive: true,
    index: 0,
  };

  hide(callback) {
    Animated.timing(this.opacity, {
      duration: 500,
      toValue: 0,
    }).start(callback);
  }

  scrollTo(index, callback, animated) {
    this.scroll.scrollTo(index, callback, animated);
  }

  onTap(tracker: Tracker) {
    const index = this.state.trackers.findIndex(
      (nTracker) => nTracker === tracker);

    const scroll = this.scroll.index;
    if (index === scroll) {
      caller(this.props.onCenterSlideTap, index);
    }

    this.scrollTo(index, () =>
      caller(this.props.onSlideTap, index));
  }

  render() {
    const { style, index, responsive, scale } = this.props;

    const slideStyle = {
      width: screenWidth * scale,
      height: slideHeight * scale,
    };
    const slides = this.state.trackers
      .map((tracker) => (
        <View key={tracker.id} style={[commonStyles.centered, slideStyle]}>
          {this.renderScaledTracker(tracker, scale, responsive)}
        </View>
      ));

    return (
      <Animated.View
        style={[style, { opacity: this.opacity }]}
      >
        <Scroll
          ref={(el) => (this.scroll = el)}
          style={commonStyles.flexFilled}
          centered
          index={index}
          slideWidth={screenWidth * scale}
          slides={slides}
        />
      </Animated.View>
    );
  }
}
