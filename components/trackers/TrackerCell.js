'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} = React;

var trackStyles = require('./trackStyles');

var TrackerCell = React.createClass({
  render: function() {
    return (
        <View style={trackStyles.tracker}>
          <View style={trackStyles.headerContainer}>
            <View style={trackStyles.iconContainer}>
              <Image
                source={this.props.icon}
                style={trackStyles.icon}
              />
            </View>
            <View style={trackStyles.textContainer}>
              <Text style={trackStyles.title} numberOfLines={1}>
                {this.props.title}
              </Text>
            </View> 
          </View>
          <View style={trackStyles.bodyContainer}>
            <View style={trackStyles.controls}>
              {this.props.controls}
            </View>
          </View>
        </View>
    );
  }
});

module.exports = TrackerCell;
