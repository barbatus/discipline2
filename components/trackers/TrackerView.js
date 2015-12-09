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
  Animated
} = React;

const { trackerStyles } = require('./trackerStyles');

const UserIconsStore = require('../../icons/UserIconsStore');

const TrackerView = React.createClass({
  getInitialState() {
    let opacity = this.props.shown ? 1 : 0; 
    return {
      opacity: new Animated.Value(opacity)
    };
  },

  _getMainIcon(iconId) {
    let userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.png;
    }
    return getIcon('oval');
  },

  toggleView() {
    this.state.opacity.setValue(
      this.state.opacity._value ? 0 : 1);
  },

  render() {
    return (
      <Animated.View style={[
          trackerStyles.innerView,
          {opacity: this.state.opacity},
          this.props.style
        ]}>
        <View style={trackerStyles.headerContainer}>
          <View style={trackerStyles.barContainer}>
            <TouchableOpacity onPress={this.props.onEdit}>
              <Image
                source={getIcon('info')}
                style={trackerStyles.infoIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={trackerStyles.iconContainer}>
            <Image
              source={this._getMainIcon(this.props.iconId)}
              style={trackerStyles.mainIcon}
            />
          </View>
          <View style={trackerStyles.titleContainer}>
            <Text style={trackerStyles.titleText}>
              {this.props.title}
            </Text>
          </View>
        </View>
        <View style={trackerStyles.bodyContainer}>
          <View style={trackerStyles.controlsContainer}>
            {this.props.controls}
          </View>
        </View>
        <View style={trackerStyles.footerContainer}>
          {this.props.footer}
        </View>
      </Animated.View>
    );
  }
});

module.exports = TrackerView;
