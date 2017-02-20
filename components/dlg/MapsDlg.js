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

const DEFAULT_PADDING = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40,
};

export default class MapsDlg extends CommonModal {

  constructor(props) {
    super(props);

    this.state = {
      path: [],
      initRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    };
  }

  get content() {
    const { path, initRegion } = this.state;
    return (
      <MapView
        style={styles.mapView}
        ref='map'
        initRegion={initRegion}
        zoomEnabled
        loadingEnabled
        showsMyLocationButton>
        <MapView.Polyline
          coordinates={path}
          strokeColor='rgba(255,0,0,0.5)'
          strokeWidth={4}
        />
      </MapView>
    );
  }

  onBeforeShown(path = []) {
    this.setState({
      path,
    });
  }

  onAfterShown(path = []) {
    this.refs.map.fitToCoordinates(path, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }
}

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
});
