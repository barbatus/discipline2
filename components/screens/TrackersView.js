'use strict';

const React = require('react-native');
const {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Component,
  Animated
} = React;

const {
  NavCancelButton,
  NavAcceptButton
} = require('../nav/buttons');

const Easing = require('Easing');

const ScreenView = require('./ScreenView');

const TrackerSwiper = require('../trackers/TrackerSwiper');

const TrackerScroll = require('../trackers/TrackerScroll');

const Trackers = require('../../trackers/Trackers');

const { commonStyles } = require('../styles/common');

class TrackersView extends Component {
  constructor(props) {
    super(props);
    this._scrollOp = new Animated.Value(0);
  }

  moveLeft(instantly, callback) {
    if (_.isFunction(instantly)) {
      callback = instantly;
      instantly = false;
    }

    if (instantly) {
      this._trackersView.posX.setValue(-1);
      return;
    }

    Animated.timing(this._trackersView.posX, {
      duration: 1000,
      toValue: -1,
      easing: Easing.inOut(Easing.linear)
    }).start(callback);
  }

  moveRight(instantly, callback) {
    if (_.isFunction(instantly)) {
      callback = instantly;
      instantly = false;
    }

    if (instantly) {
      this._trackersView.posX.setValue(0);
    }

    Animated.timing(this._trackersView.posX, {
      duration: 1000,
      toValue: 0,
      easing: Easing.inOut(Easing.sin)
    }).start(callback);
  }

  setOpacity(value, animated, callback) {
    if (animated) {
      Animated.timing(this._trackersView.opacity, {
        duration: 1000,
        toValue: value
      }).start(callback);
    } else {
      this._trackersView.opacity.setValue(value);
    }
  }

  async addTracker(tracker, callback) {
    await this.refs.swiper.addTracker(tracker, callback);
  }

  _getCancelBtn(onPress) {
    return (
      <NavCancelButton onPress={onPress.bind(this)} />
    );
  }

  _getAcceptBtn(onPress) {
    return (
      <NavAcceptButton onPress={onPress.bind(this)} />
    );
  }

  _setEditTrackerBtns() {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('Edit Tracker');
      navBar.setButtons(
        this._getCancelBtn(this._cancelEdit),
        this._getAcceptBtn(this._saveEdit));
    }
  }

  // Edit tracker events.

  _cancelEdit() {
    if (this.refs.swiper.cancelEdit()) {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }

  _onEdit() {
    this._setEditTrackerBtns();
    this.refs.swiper.showEdit();
  }

  _onRemove() {
    this.refs.swiper.removeTracker(
      this.props.onRemove);
  }

  _saveEdit() {
    if (this.refs.swiper.saveEdit()) {
      if (this.props.onSave) {
        this.props.onSave();
      }
    }
  }

  get _trackersView() {
    return this.refs.trackersView;
  }

  _onMoveUpStart() {
    let index = this.refs.swiper.getIndex();
    this.refs.scroll.show(index);
  }

  _onMoveUp(dv) {
    this.refs.scroll.setOpacity(1 - dv);
  }

  _onMoveUpDone() {
    this.refs.swiper.hide();
  }

  _onSlideClick(index) {
    this.refs.swiper.show(index);
    this.refs.scroll.hide();
  }

  render() {
    return (
      <ScreenView
        ref='trackersView'
        posX={this.props.posX}
        content={
          <View style={commonStyles.flexFilled}>
            <TrackerScroll
              ref='scroll'
              onSlideClick={this._onSlideClick.bind(this)}
            />
            <TrackerSwiper
              ref='swiper'
              style={commonStyles.absoluteFilled}
              onMoveUpStart={this._onMoveUpStart.bind(this)}
              onMoveUp={this._onMoveUp.bind(this)}
              onMoveUpDone={this._onMoveUpDone.bind(this)}
              onScroll={this.props.onScroll}
              onSlideChange={this.props.onSlideChange}
              onSlideNoChange={this.props.onSlideNoChange}
              onRemove={this._onRemove.bind(this)}
              onEdit={this._onEdit.bind(this)} />
          </View>
        } />
    );
  }
};

TrackersView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

module.exports = TrackersView;
