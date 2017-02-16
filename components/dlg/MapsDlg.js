'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';

import MapView from 'react-native-maps';

import CommonModal from './CommonModal';

import commonStyles from '../styles/common';

export default class MapsDlg extends CommonModal {
  get content() {
    return (
      <MapView
        style={styles.mapView}
        initialRegion={this.state.initRegion}
        zoomEnabled
        scrollingEnabled
        loadingEnabled
      />
    );
  }

  onBeforeShown(initRegion) {
    this.setState({
      initRegion,
    });
  }
}

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
});
