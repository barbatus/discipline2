import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import flatten from 'lodash/flatten';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import last from 'lodash/last';

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

const PolyLine = React.memo(({ coords }) => (
  <MapView.Polyline
    coordinates={coords}
    strokeColor={PATH_COLOR}
    strokeWidth={4}
  />
));

export default class MapsDlg extends CommonModal {
  mapInit = false;

  constructor(props) {
    super(props);
    this.region = new MapView.AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    const baseState = this.state;
    this.state = {
      ...baseState,
      polylines: [],
    };
    this.showLocation = ::this.showLocation;
    this.onRegionChange = ::this.onRegionChange;
  }

  get content() {
    const { polylines, settingLocation, coords } = this.state;

    const polylineElems = polylines.map((polyline) => (
      <PolyLine
        key={`${polyline.id}`}
        coords={polyline.coords}
      />
    ));
    return (
      <>
        <MapView.Animated
          style={mapStyles.mapView}
          ref={(el) => (this.map = el)}
          region={this.region}
          zoomEnabled
          loadingEnabled
          showsMyLocationButton
          onRegionChangeComplete={this.onRegionChange}
        >
          {polylineElems}
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

  draw(lat: number, lon: number) {
    const { polylines } = this.state;
    const lastLine = last(polylines);
    const rest = polylines.filter((it) => it !== lastLine);
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        polylines: rest.concat({
          ...lastLine,
          coords: lastLine.coords.concat({ latitude: lat, longitude: lon }),
        }),
      });
    });
  }

  async showLocation(moveToMyLocation: boolean) {
    const { settingLocation } = this.state;
    if (settingLocation) return;

    this.setState({ settingLocation: true });
    try {
      const watcher = await BGGeoLocationWatcher.getOrCreate();
      const pos = await watcher.getPos();

      if (moveToMyLocation) {
        const { latitude, longitude } = pos.coords;
        this.region
          .timing({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }, 1000)
          .start();
      }
      this.setState({ settingLocation: false, coords: pos.coords });
    } catch {
      this.setState({ settingLocation: false });
    }
  }

  async onBeforeShown(paths = []) {
    const now = Date.now();
    const polylines = paths.map((path, index) => ({ id: now + index, coords: path.slice() }));
    this.setState({ polylines });
  }

  async onAfterShown(paths = []) {
    const coords = flatten(paths);
    const len = coords.length;
    const moveToMyLocation = len === 0;
    this.showLocation(moveToMyLocation);

    if (!moveToMyLocation) {
      const latitude = coords.reduce((accum, p) => accum + p.latitude, 0) / len;
      const longitude = coords.reduce((accum, p) => accum + p.longitude, 0) / len;
      this.region
        .timing({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }, 1000)
        .start();
    }

    this.map.getNode().fitToCoordinates(coords, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  onRegionChange(region) {
    if (this.mapInit) {
      this.region.setValue(region);
    }
    this.mapInit = true;
  }
}
