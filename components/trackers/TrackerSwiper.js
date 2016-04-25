'use strict';

const React = require('react-native');
const {
  View,
  ListView,
  StyleSheet,
  Component,
  Text,
  Animated,
  PanResponder,
  Dimensions
} = React;

const Swiper = require('../scrolls/Swiper');

const Trackers = require('../../trackers/Trackers');

const { ScaleResponder } = require('./responders');

const { commonStyles } = require('../styles/common');

const TrackerRenderMixin = require('./TrackerRenderMixin');

const window = Dimensions.get('window');
const screenHeight = window.height - 60;

const TrackerSwiper = React.createClass({
  mixins: [TrackerRenderMixin],

  getInitialState() {
    return {
      scale: new Animated.Value(1),
      moveY: new Animated.Value(0),
      index: 0
    }
  },

  getDefaultProps() {
    return {
      trackers: []
    }
  },

  componentWillMount() {
    let scaleResponder = new ScaleResponder(screenHeight);
    scaleResponder.subscribe(scale => {
      this.state.scale.setValue(scale);
      if (this.props.onMoveUp) {
        this.props.onMoveUp(scale - 0.5);
      }
    },
    this.props.onMoveUpStart,
    () => {
      if (this.state.scale._value <= 0.5) {
        if (this.props.onMoveUpDone) {
          this.props.onMoveUpDone();
        }
        return;
      }

      Animated.timing(this.state.scale, {
        duration: 200,
        toValue: 0.5
      }).start(this.props.onMoveUpDone);
    });

    this._scaleHandlers = scaleResponder.panHandlers;
  },

  currentTracker() {
    let index = this.refs.swiper.getIndex();
    return this.props.trackers[index];
  },

  showEdit(callback) {
    this._startEdit(() => {
      let trackerId = this.currentTracker()._id;
      this.refs[trackerId].showEdit(callback);
    });
  },

  saveEdit(callback) {
    let trackerId = this.currentTracker()._id;
    return this.refs[trackerId].saveEdit(() => {
      this._onCancelEdit(callback);
    });
  },

  cancelEdit(callback) {
    let trackerId = this.currentTracker()._id;
    return this.refs[trackerId].cancelEdit(() => {
      this._onCancelEdit(callback);
    });
  },

  getIndex() {
    return this.refs.swiper.getIndex();
  },

  getNextIndex() {
    return this.refs.swiper.getNextIndex();
  },

  getPrevIndex() {
    return this.refs.swiper.getPrevIndex();
  },

  hide(callback) {
    this.state.moveY.setValue(1);
  },

  show(index, callback) {
    this.state.moveY.setValue(0);
    this.scrollTo(index, () => {
      Animated.timing(this.state.scale, {
        duration: 500,
        toValue: 1
      }).start(callback);
    }, false);
  },

  isShown() {
    return this.state.moveY._value === 0;
  },

  scrollTo(index, callback, animated) {
    this.refs.swiper.scrollTo(index, callback, animated);
  },

  addTracker(callback) {},

  removeTracker(callback) {
    let trackerId = this.currentTracker()._id;

    this.refs[trackerId].collapse(() => {
      let index = this.getIndex();
      if (index) {
        this.scrollTo(this.getPrevIndex(),
          this._endEdit.bind(this, callback));
        return;
      }
      this._endEdit(callback);
    });
  },

  _startEdit(callback) {
    this.setState({
      scrollEnabled: false
    }, callback);
  },

  _endEdit(callback) {
    this.setState({
      scrollEnabled: true
    }, callback);
  },

  _onCancelEdit(callback) {
    this.setState({
      scrollEnabled: true
    });
    if (callback) {
      callback();
    }
  },

  render() {
    let trackerSlides = this.props.trackers.map(
      tracker => {
        return this.renderTracker(tracker, 1);
      });

    let swiperView = (
      <Swiper
        ref='swiper'
        slides={trackerSlides}
        onTouchMove={this.props.onScroll}
        scrollEnabled={this.state.scrollEnabled}
        onSlideChange={this.props.onSlideChange}
        onSlideNoChange={this.props.onSlideNoChange}>
      </Swiper>
    );

    return (
      <Animated.View style={[
        commonStyles.flexFilled,
        this.props.style, {
          transform: [
            {
              scale: this.state.scale
            },
            {
              translateY: this.state.moveY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }
          ]
        }]} {...this._scaleHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
});

module.exports = TrackerSwiper;
