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

const {
  trackerStyles,
  propsStyles
} = require('./trackerStyles');

const TrackerView = require('./TrackerView');
const TrackerEditView = require('./TrackerEditView');

const TrackerCell = React.createClass({
  getInitialState() {
    return {
      rotY: new Animated.Value(0),
      opacity1: new Animated.Value(1),
      opacity2: new Animated.Value(0)
    };
  },

  _animateFlip(stopVal, op1, op2, opCondition, callback) {
    this.state.rotY.removeAllListeners();
    let id = this.state.rotY.addListener(({value}) => {
      if (opCondition(value)) {
        this.state.rotY.removeListener(id);
        this.state.opacity1.setValue(op1);
        this.state.opacity2.setValue(op2);
      }
    });
    Animated.timing(this.state.rotY, {
      duration: 1000,
      toValue: stopVal
    }).start(() => {
      if (callback) {
        callback();
      }
    });
  },

  toggleView(callback) {
    if (this.state.rotY._value === 1) {
      this._animateFlip(0, 1, 0,
        value => value <= 0.5, callback);
    } else {
      this._animateFlip(1, 0, 1,
        value => value > 0.5, callback);
    }
  },

  render() {
    return (
      <View style={trackerStyles.slide}>
        <View style={trackerStyles.container}>
          <TrackerView
            style={{
              opacity: this.state.opacity1,
              transform: [{
                rotateY: this.state.rotY.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-180deg']
                })
              }]
            }}
            icon={this.props.icon}
            title={this.props.title}
            controls={this.props.controls}
            onEdit={this.props.onEdit}
          />
          <TrackerEditView
            style={{
              opacity: this.state.opacity2,
              transform: [{
                rotateY: this.state.rotY.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-180deg', '0deg']
                })
              }]
            }}
            delete={true}
            icon={this.props.icon}
            title={this.props.title}
          />
        </View>
      </View>
    );
  }
});

module.exports = TrackerCell;
