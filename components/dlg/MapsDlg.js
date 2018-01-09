import React from 'react';

import { StyleSheet } from 'react-native';

import flatten from 'lodash/flatten';

import MapView from 'react-native-maps';

import GeoWatcher from 'app/geo/BGGeoLocationWatcher';

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
      paths: [],
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
    const { paths, region } = this.state;
    const polylines = paths.map((path, index) => (
      <MapView.Polyline
        key={index}
        coordinates={path}
        strokeColor="rgba(255,0,0,0.5)"
        strokeWidth={4}
      />
    ));

    return (
      <MapView.Animated
        style={styles.mapView}
        ref={(el) => (this.map = el)}
        region={region}
        zoomEnabled
        loadingEnabled
        showsMyLocationButton
      >
        {polylines}
      </MapView.Animated>
    );
  }

  onBeforeShown(paths = []) {
    this.setState({ paths });
  }

  onAfterShown(paths = []) {
    const { region } = this.state;

    if (paths.length) {
      const all = flatten(paths);
      this.map.getNode().fitToCoordinates(all, {
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
