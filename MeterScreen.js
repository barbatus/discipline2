'use strict';

var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var MeterScreen = React.createClass({
  render: function() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  contentContainer: {
    padding: 10
  }
});

module.exports = MeterScreen;
