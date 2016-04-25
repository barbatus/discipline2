'use strict';

const React = require('react-native');
const {
  View,
  ListView,
  StyleSheet,
  Component,
  Text,
  Animated
} = React;

const Scroll = require('../scrolls/Scroll');

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');
const screenWidth = window.width;

const Trackers = require('../../trackers/Trackers');

const { commonStyles } = require('../styles/common');

const TrackerRenderMixin = require('./TrackerRenderMixin');

const TrackerScroll = React.createClass({
  mixins: [TrackerRenderMixin],

  componentWillMount() {
    this._opacity = new Animated.Value(0);
  },

  getDefaultProps() {
    return {
      index: 0,
      trackers: []
    }
  },

  hide(callback) {
    Animated.timing(this._opacity, {
      duration: 500,
      toValue: 0
    }).start(callback);
  },

  setOpacity(opacity) {
    this._opacity.setValue(opacity);
  },

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  },

  show(callback) {
    this._opacity.setValue(1);
  },

  isShown() {
    return this._opacity._value === 1;
  },

  render() {
    let trackerSlides = this.props.trackers.map(
      tracker => {
        return this.renderTracker(tracker, 0.5);
      });

    return (
      <Animated.View style={[
          commonStyles.flexFilled, 
          this.props.style, {
          opacity: this._opacity
        }]}>
        <Scroll
          ref='scroll'
          slideWidth={screenWidth / 2}
          padding={screenWidth / 4}
          index={this.props.index}
          slides={trackerSlides}
          onSlideClick={this.props.onSlideClick}>
        </Scroll>
      </Animated.View>
    );
  }
});

module.exports = TrackerScroll;
