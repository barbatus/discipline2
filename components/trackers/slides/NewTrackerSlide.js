'use strict';

import React, { Component } from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated
} from 'react-native';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerEditView from './basic/TrackerEditView';

import consts from '../../../depot/consts';

export default class NewTrackerSlide extends Component {
  constructor(props) {
    super(props);
  }

  get tracker() {
    let editView = this.refs.editView;
    return {
      title: editView.title,
      typeId: editView.typeId,
      iconId: editView.iconId
    };
  }

  reset() {
    this.refs.editView.reset();
  }

  render() {
    return (
      <View style={trackerStyles.slide}>
        <View style={trackerStyles.container}>
          <TrackerEditView
            ref='editView'
            typeId={this.props.typeId}
            onIconEdit={this.props.onIconEdit}
            onTypeChange={this.props.onTypeChange}
            style={styles.editView} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editView: {
    opacity: 1,
    transform: [{
      rotateY: '0deg'
    }]
  }
});
