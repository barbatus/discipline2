'use strict';

import React, {Component} from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated
} from 'react-native';

import {trackerStyles} from '../styles/trackerStyles';

import TrackerEditView from './basic/TrackerEditView';

import consts from '../../../depot/consts';

import {commonStyles} from '../../styles/common';

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
    let { typeId, onIconEdit, onTypeChange } = this.props;

    return (
      <View style={trackerStyles.slide}>
        <TrackerEditView
          ref='editView'
          typeId={typeId}
          onIconEdit={onIconEdit}
          onTypeChange={onTypeChange}
          style={styles.editView} />
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
