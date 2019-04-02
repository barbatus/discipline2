import React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Tracker from 'app/model/Tracker';

import { trackerStyles } from '../styles/trackerStyles';
import TrackerEditView from './common/TrackerEditView';

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{ rotateY: '0deg' }],
  },
});

const NewTrackerSlideFn = ({ style, tracker, onNewTracker, ...rest }) => (
  // TODO: consider removing outer View
  <View style={[trackerStyles.slide, style]}>
    <TrackerEditView
      form="newTrackerForm"
      {...rest}
      allowType
      allowDelete={false}
      style={[styles.editView]}
      props={Tracker.properties}
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

export default React.memo(NewTrackerSlideFn);
