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
      index: 0,
      trackers: []
    }
  },

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy < -20;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy < -20;
      },
      onPanResponderMove: (e: Object, gestureState: Object) => {
        if (gestureState.vy > 0) return;

        let dy = Math.abs(gestureState.dy) * 2;
        let scale = (screenHeight - dy) / screenHeight;
        scale = Math.max(0.5, scale);

        this.state.scale.setValue(scale);

        if (this.props.onMoveUp) {
          this.props.onMoveUp(scale - 0.5);
        }
      },
      onPanResponderGrant: (e: Object, gestureState: Object) => {
        if (this.props.onMoveUpStart) {
          this.props.onMoveUpStart();
        }
      },
      onPanResponderRelease: (e: Object, gestureState: Object) => {
        if (this.props.onMoveUpDone) {
          this.props.onMoveUpDone();
        }
      }
    });

    this._loadInitialState();
  },

  currentTracker() {
    let index = this.refs.swiper.getIndex();
    return this.state.trackers[index];
  },

  showEdit(callback) {
    this.setState({
      scrollEnabled: false
    }, () => {
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

  hide() {
    this.state.moveY.setValue(1);
  },

  show(index, callback) {
    this.state.moveY.setValue(0);
    this.refs.swiper.scrollTo(index, () => {
      Animated.timing(this.state.scale, {
        duration: 500,
        toValue: 1
      }).start(callback);
    }, false);
  },

  async addTracker(tracker, callback) {
    tracker = await Trackers.addAt(
      tracker, this.getNextIndex());

    let trackers = this.state.trackers;
    let nextInd = this.getNextIndex();
    trackers.splice(nextInd, 0, tracker);
    this.setState({
      trackers: trackers
    }, () => {
      this.refs.swiper.scrollTo(nextInd, () => {
        this._onCancelEdit(callback);
      });
    });

    return tracker;
  },

  async removeTracker(callback) {
    let trackerId = this.currentTracker()._id;
    await Trackers.remove(this.currentTracker());

    if (callback) {
      callback();
    }

    // TODO: optimize.
    this.refs[trackerId].collapse(() => {
      let index = this.getIndex();
      let setTrackers = () => {
        let trackers = this.state.trackers
        trackers.splice(index, 1);
        this.setState({
          trackers: trackers,
          scrollEnabled: true
        });
      };
      if (index) {
        this.refs.swiper.scrollTo(
          this.getPrevIndex(), setTrackers);
        return;
      }
      setTrackers();
    });
  },

  _onCancelEdit(callback) {
    this.setState({
      scrollEnabled: true
    });
    if (callback) {
      callback();
    }
  },

  async _loadInitialState() {
    let hasTestData = await depot.hasTestData();
    if (!hasTestData) {
      await depot.initTestData();
    }
    let trackers = await Trackers.getAll();

    if (trackers.length) {
      this.setState({
        trackers: [trackers[0]]
      }, () => {
        setTimeout(() => {
          this.setState({
            trackers: trackers
          });
        });
      });
    }
  },

  render() {
    let trackerSlides = this.state.trackers.map(
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
        }]} {...this._panResponder.panHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
});

module.exports = TrackerSwiper;
