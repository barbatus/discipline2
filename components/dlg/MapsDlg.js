import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import flatten from 'lodash/flatten';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BGGeoLocationWatcher from 'app/geo/BGGeoLocationWatcher';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../styles/common';
import { PATH_COLOR, mapStyles } from '../maps/styles';
import MyLocationMarker from '../maps/MyLocationMarker';

import CommonModal from './CommonModal';

const DEFAULT_PADDING = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40,
};

const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
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
    const baseState = this.state;
    this.state = {
      ...baseState,
      paths: [],
      region,
    };
    this.showLocation = ::this.showLocation;
  }

  get content() {
    const { paths, region, settingLocation, coords } = this.state;

    const polylines = paths.map((path) => (
      <MapView.Polyline
        key={`${path[0].latitude}${path[0].longitude}`}
        coordinates={path}
        strokeColor={PATH_COLOR}
        strokeWidth={4}
      />
    ));
    return (
      <>
        <MapView.Animated
          style={mapStyles.mapView}
          ref={(el) => (this.map = el)}
          region={region}
          zoomEnabled
          loadingEnabled
          showsMyLocationButton
        >
          {polylines}
          <MyLocationMarker coords={coords} />
        </MapView.Animated>
        <View style={mapStyles.buttonContainer}>
          <TouchableOpacity style={mapStyles.button} onPress={this.showLocation}>
            {
              settingLocation ?
                <ActivityIndicator size="small" /> :
                <Icon name="my-location" size={25} style={mapStyles.buttonIcon} />
            }
          </TouchableOpacity>
        </View>
      </>
    );
  }

  async showLocation(moveToMyLocation: boolean) {
    const { region, settingLocation } = this.state;
    if (settingLocation) return;

    this.setState({ settingLocation: true });
    try {
      const watcher = await BGGeoLocationWatcher.getOrCreate();
      const pos = await watcher.getPos();

      if (moveToMyLocation) {
        const { latitude, longitude } = pos.coords;
        region.timing({ latitude, longitude }, 1000).start();
      }
      this.setState({ settingLocation: false, coords: pos.coords });
    } catch {
      this.setState({ settingLocation: false });
    }
  }

  async onBeforeShown(paths = []) {
    const validPaths = paths.filter((path) => Boolean(path.length));
    this.setState({ paths: validPaths });
  }

  async onAfterShown(paths = []) {
    const { region } = this.state;
    const validPaths = paths.filter((path) => Boolean(path.length));
    const coords = flatten(validPaths);
    const len = coords.length;
    const moveToMyLocation = len === 0;
    this.showLocation(moveToMyLocation);

    if (!moveToMyLocation) {
      const latitude = coords.reduce((accum, p) => accum + p.latitude, 0) / len;
      const longitude = coords.reduce((accum, p) => accum + p.longitude, 0) / len;
      region.timing({ latitude, longitude }, 1000).start();
    }

    this.map.getNode().fitToCoordinates(coords, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }
}
