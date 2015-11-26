'use strict';

const React = require('react-native');
const {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated
} = React;

const {
  trackerStyles
} = require('./trackerStyles');

const TrackerEditView = require('./TrackerEditView');

const NewTrackerCell = React.createClass({
  render() {
    return (
      <View style={trackerStyles.slide}>
        <View style={trackerStyles.container}>
          <TrackerEditView style={styles.editView} />
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{rotateY: '0deg'}]
  }
});

module.exports = NewTrackerCell;
