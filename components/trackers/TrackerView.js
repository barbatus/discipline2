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

const TrackerView = React.createClass({
  render() {
    return (
      <Animated.View style={[trackerStyles.innerView, this.props.style]}>
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
              source={this.props.icon}
              style={trackerStyles.mainIcon}
            />
          </View>
          <View style={trackerStyles.textContainer}>
            <Text style={trackerStyles.title}>
              {this.props.title}
            </Text>
          </View>
        </View>
        <View style={trackerStyles.bodyContainer}>
          <View style={trackerStyles.controls}>
            {this.props.controls}
          </View>
        </View>
      </Animated.View>
    );
  }
});

module.exports = TrackerView;
