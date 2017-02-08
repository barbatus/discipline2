'use strict';

import React, {Component} from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';

import {trackerStyles} from '../styles/trackerStyles';

import TrackerEditView from './basic/TrackerEditView';

import consts from '../../../depot/consts';

import {commonStyles} from '../../styles/common';

import Trackers from '../../../model/Trackers';

export default class NewTrackerSlide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracker: {},
    };
  }

  shouldComponentUpdate(props, state) {
    if (this.props.typeId !== props.typeId) {
      const tracker = Trackers.create(this.tracker);
      tracker.typeId = props.typeId;
      this.state.tracker = tracker;
      return true;
    }
    return this.state.tracker !== state.tracker;
  }

  reset() {
    this.refs.editView.reset();
  }

  get tracker() {
    return this.refs.editView.tracker;
  }

  render() {
    const { onIconEdit, onTypeChange } = this.props;
    const { tracker } = this.state;

    return (
      <View style={trackerStyles.slide}>
        <TrackerEditView
          ref='editView'
          tracker={tracker}
          onIconEdit={onIconEdit}
          onTypeChange={onTypeChange}
          style={styles.editView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{
      rotateY: '0deg',
    }]
  },
});
