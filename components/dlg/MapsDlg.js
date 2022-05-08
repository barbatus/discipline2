import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import flatten from 'lodash/flatten';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
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

const getLocation = async () => {
  const watcher = await BGGeoLocationWatcher.getOrCreate();
  const pos = await watcher.getPos();
  return pos.coords;
};

const LocationButton = React.memo(({ onMyLocation }) => {
  const [settingLocation, setSettingLocation] = React.useState(false);

  const showLocation = React.useCallback(async () => {
    setSettingLocation(true);
    const location = await getLocation();
    onMyLocation(location);
    setSettingLocation(false);
  }, [onMyLocation]);

  return (
    <View style={mapStyles.buttonContainer}>
      <TouchableOpacity style={mapStyles.button} onPress={showLocation}>
        {
          settingLocation ?
            <ActivityIndicator size="small" /> :
            <Icon name="my-location" size={25} style={mapStyles.buttonIcon} />
        }
      </TouchableOpacity>
    </View>
  );
});

export default class MapsDlg extends CommonModal {
  regionBeingChanged = false;

  map = React.createRef();

  constructor(props) {
    super(props);
    const baseState = this.state;
    this.state = {
      ...baseState,
      polylines: [],
    };
    this.onRegionChange = ::this.onRegionChange;
    this.onRegionChangeComplete = ::this.onRegionChangeComplete;
    this.showLocation = ::this.showLocation;
    this.onMyLocation = ::this.onMyLocation;
  }

  get content() {
    const { polylines, settingLocation, coords, region } = this.state;

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
          ref={this.map}
          region={region}
          zoomEnabled
          loadingEnabled
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={false}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {polylineElems}
          <MyLocationMarker coords={coords} />
        </MapView.Animated>
        <LocationButton onMyLocation={this.onMyLocation} />
      </>
    );
  }

  draw(lat: number, lon: number) {
    if (this.regionBeingChanged) return;

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

  async showLocation() {
    try {
      const coords = await getLocation();
      const region = new MapView.AnimatedRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.setState({ region, coords });
    } catch {}
  }

  onMyLocation(coords) {
    if (this.state.region) {
      this.state.region.timing(coords, { useNativeDriver: true }).start();
    } else {
      const region = new MapView.AnimatedRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.setState({ region, coords });
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

    if (!moveToMyLocation) {
      const latitude = coords.reduce((accum, p) => accum + p.latitude, 0) / len;
      const longitude = coords.reduce((accum, p) => accum + p.longitude, 0) / len;
      const region = new MapView.AnimatedRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.setState({ region });
    } else {
      this.showLocation();
    }
    this.map.current.fitToCoordinates(coords, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  onRegionChangeComplete(region) {
    if (this.state.region) {
      this.state.region.setValue(region);
    }
    this.regionBeingChanged = false;
  }

  onRegionChange(region) {
    this.regionBeingChanged = true;
  }
}
