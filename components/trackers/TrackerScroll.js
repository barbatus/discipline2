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

  getInitialState() {
    this._opacity = new Animated.Value(0);

    return {
      trackers: []
    }
  },

  getDefaultProps() {
    return {
      index: 0
    }
  },

  componentWillMount() {
    this._loadInitialState();
  },

  hide() {
    this._opacity.setValue(0);
  },

  setOpacity(opacity) {
    this._opacity.setValue(opacity);
  },

  show(index, callback) {
    this._opacity.setValue(1);
    this.refs.scroll.scrollTo(index, callback, false);
  },

  async _loadInitialState() {
    let hasTestData = await depot.hasTestData();
    if (!hasTestData) {
      await depot.initTestData();
    }
    let trackers = await Trackers.getAll();
    this.setState({
      trackers: trackers
    });
  },

  render() {
    let trackerSlides = this.state.trackers.map(
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
