import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { pure } from 'recompose';

import { trackerStyles } from '../styles/trackerStyles';
import TrackerEditView from './common/TrackerEditView';

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{ rotateY: '0deg' }],
  },
});

const NewTrackerSlideFn = ({ style, tracker, onNewTracker, ...rest }) => (
  <View style={[trackerStyles.slide, style]}>
    <TrackerEditView
      form="newTrackerForm"
      {...rest}
      style={styles.editView}
      initialValues={tracker}
      onSubmitSuccess={onNewTracker}
    />
  </View>
);

NewTrackerSlideFn.propTypes = {
  style: ViewPropTypes.style,
  tracker: PropTypes.instanceOf(Object),
  onTypeSelect: PropTypes.func.isRequired,
  onNewTracker: PropTypes.func.isRequired,
};

NewTrackerSlideFn.defaultProps = {
  style: null,
  tracker: null,
};

export default pure(NewTrackerSlideFn);
