'use strict';

import React, { Component } from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerEditView from './basic/TrackerEditView';

export default class NewTrackerSlide extends Component {
  shouldComponentUpdate(props, state) {
    return this.props.tracker !== props.tracker;
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[trackerStyles.slide, style]}>
        <TrackerEditView
          ref="editView"
          {...this.props}
          style={styles.editView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [
      {
        rotateY: '0deg',
      },
    ],
  },
});
