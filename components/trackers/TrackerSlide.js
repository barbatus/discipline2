'use strict';

const React = require('react-native');
const {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  SwitchIOS
} = React;

let NativeMethodsMixin = require('NativeMethodsMixin');

const {
  trackerStyles,
  propsStyles
} = require('./trackerStyles');

const TrackerView = require('./TrackerView');
const TrackerEditView = require('./TrackerEditView');

const UserIconsStore = require('../../icons/UserIconsStore');

const TrackerSlide = React.createClass({
  mixins: [NativeMethodsMixin],

  getInitialState() {
    return {
      iconId: this.props.tracker.iconId,
      title: this.props.tracker.title,
      rotY: new Animated.Value(0)
    };
  },

  _animateFlip(stopVal, op1, op2, opCondition, callback) {
    this.state.rotY.removeAllListeners();
    let id = this.state.rotY.addListener(({value}) => {
      if (opCondition(value)) {
        this.state.rotY.removeListener(id);
        this.refs.trackerView.toggleView();
        this.refs.editView.toggleView();
      }
    });
    Animated.timing(this.state.rotY, {
      duration: 1000,
      toValue: stopVal
    }).start(callback);
  },

  showEdit(callback) {
    this._animateFlip(1, 0, 1,
      value => value > 0.5, callback);
  },

  saveEdit(callback) {
    let title = this.refs.editView.getTitle();
    let iconId = this.refs.editView.getIconId();
    let icon = UserIconsStore.get(iconId);
    this.props.tracker.title = title;
    this.props.tracker.icon = icon;
    this.props.tracker.save();

    this.setState({
      title: this.refs.editView.getTitle(),
      iconId: this.refs.editView.getIconId()
    });

    this._animateFlip(0, 1, 0,
      value => value <= 0.5, callback);
  },

  cancelEdit(callback) {
    this._animateFlip(0, 1, 0,
      value => value <= 0.5, () => {
        this.refs.editView.reset();
        if (callback) {
          callback();
        }
      });
  },

  render() {
    return (
      <View style={trackerStyles.slide}>
        <View style={trackerStyles.container}>
          <TrackerView
            ref='trackerView'
            shown={true}
            style={{
              transform: [{
                rotateY: this.state.rotY.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-180deg']
                })
              }]
            }}
            iconId={this.state.iconId}
            title={this.state.title}
            controls={this.props.controls}
            onEdit={this.props.onEdit}
          />
          <TrackerEditView
            ref='editView'
            shown={false}
            style={{
              transform: [{
                rotateY: this.state.rotY.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-180deg', '0deg']
                })
              }]
            }}
            showType={false}
            delete={true}
            iconId={this.state.iconId}
            title={this.state.title}
            onIconEdit={this.props.onIconEdit}
          />
        </View>
      </View>
    );
  }
});

module.exports = TrackerSlide;
