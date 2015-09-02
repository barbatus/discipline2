'use strict';

var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  View
} = React;

var MeterHub = require('./MeterHub');

var MainScreen = React.createClass({
  getInitialState() {
    return null;
  },

  render: function() {
    return (
      <MeterHub style={styles.meterContainer} />
    );
  }
});

var styles = StyleSheet.create({
  meterContainer: {
    marginTop: 64
  }
});

module.exports = MainScreen;
