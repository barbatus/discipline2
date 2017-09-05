import React, { PureComponent } from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerEditView from './common/TrackerEditView';

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{ rotateY: '0deg' }],
  },
});

export default class NewTrackerSlide extends PureComponent {
  render() {
    const { style, tracker, onNewTracker } = this.props;
    return (
      <View style={[trackerStyles.slide, style]}>
        <TrackerEditView
          {...this.props}
          form="newTrackerForm"
          style={styles.editView}
          initialValues={tracker}
          onSubmitSuccess={onNewTracker}
        />
      </View>
    );
  }
}
