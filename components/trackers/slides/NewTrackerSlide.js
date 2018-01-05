import React from 'react';

import { View, StyleSheet } from 'react-native';

import { pure } from 'recompose';

import PropTypes from 'prop-types';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerEditView from './common/TrackerEditView';

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{ rotateY: '0deg' }],
  },
});

const NewTrackerSlideFn = ({ style, tracker, onNewTracker, ...rest }) =>
  <View style={[trackerStyles.slide, style]}>
    <TrackerEditView
      form="newTrackerForm"
      {...rest}
      style={styles.editView}
      initialValues={tracker}
      onSubmitSuccess={onNewTracker}
    />
  </View>;

NewTrackerSlideFn.propTypes = {
  onTypeSelect: PropTypes.func.isRequired,
  onNewTracker: PropTypes.func.isRequired,
};

export default pure(NewTrackerSlideFn);
