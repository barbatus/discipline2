import React from 'react';

import { StyleSheet } from 'react-native';

import MapView from 'react-native-maps';

import GeoWatcher from '../../geo/BGGeoLocationWatcher';

import CommonModal from './CommonModal';

import { screenWidth, screenHeight } from '../styles/common';

const DEFAULT_PADDING = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40,
};

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
});

const ASPECT_RATIO = screenWidth / screenHeight;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapsDlg extends CommonModal {
  constructor(props) {
    super(props);

    const region = new MapView.AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    this.state = {
      path: [],
      region,
    };
    GeoWatcher.getPos((pos, error) => {
      if (error) return;
      const { latitude, longitude } = pos.coords;
      region.timing({ latitude, longitude }, 0).start();
    });
  }

  componentDidMount() {
    this.state.region.stopAnimation();
  }

  get content() {
    const { path, region } = this.state;
    return (
      <MapView.Animated
        style={styles.mapView}
        ref={(el) => (this.map = el)}
        region={region}
        zoomEnabled
        loadingEnabled
        showsMyLocationButton
      >
        <MapView.Polyline
          coordinates={path}
          strokeColor="rgba(255,0,0,0.5)"
          strokeWidth={4}
        />
      </MapView.Animated>
    );
  }

  onBeforeShown(path = []) {
    this.setState({ path });
  }

  onAfterShown(path = []) {
    const { region } = this.state;

    if (path.length) {
      this.map.getNode().fitToCoordinates(path, {
        edgePadding: DEFAULT_PADDING,
        animated: true,
      });
      return;
    }

    GeoWatcher.getPos((pos, error) => {
      if (error) return;
      const { latitude, longitude } = pos.coords;
      region.timing({ latitude, longitude }, 1000).start();
    });
  }
}
