import React from 'react';
import { View, Animated } from 'react-native';

import { caller } from 'app/utils/lang';
import Tracker from 'app/model/Tracker';

import Scroll from '../scrolls/Scroll';
import { commonStyles, SCREEN_WIDTH } from '../styles/common';

import { SLIDE_HEIGHT } from './styles/slideStyles';
import TrackerRenderer from './TrackerRenderer';

export default class TrackerScroll extends TrackerRenderer {
  static defaultProps = {
    responsive: true,
    enabled: true,
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
    this.scrollTo(index, () => caller(this.props.onSlideTap, index));
  }

  render() {
    const { style, index, responsive, scale, metric, shown } = this.props;

    const slideStyle = {
      width: SCREEN_WIDTH * scale,
      height: SLIDE_HEIGHT * scale,
    };
    const slides = this.state.trackers
      .map((tracker) => (
        <View key={tracker.id} style={[commonStyles.centered, slideStyle]}>
          {this.renderScaledTracker(tracker, scale, responsive, metric, shown)}
        </View>
      ));

    return (
      <Animated.View style={[style, { opacity: this.opacity }]}>
        <Scroll
          ref={(el) => (this.scroll = el)}
          style={commonStyles.flexFilled}
          centered
          index={index}
          slideWidth={SCREEN_WIDTH * scale}
          slides={slides}
          removeClippedSubviews={false}
        />
      </Animated.View>
    );
  }
}
