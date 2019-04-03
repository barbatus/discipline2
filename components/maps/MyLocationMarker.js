import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

import BGGeoLocationWatcher from 'app/geo/BGGeoLocationWatcher';

import { PATH_COLOR } from './styles';

const ANCHOR = { x: 0.5, y: 0.5 };
const SIZE = 15;
const HALO_RADIUS = 6;
const ARROW_SIZE = 7;
const ARROW_DISTANCE = 6;
const HALO_SIZE = SIZE + HALO_RADIUS;
const HEADING_BOX_SIZE = HALO_SIZE + ARROW_SIZE + ARROW_DISTANCE;

const styles = StyleSheet.create({
  mapMarker: {
    zIndex: 1000,
  },
  container: {
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
  },
  heading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
    alignItems: 'center',
  },
  headingPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: ARROW_SIZE * 0.75,
    borderBottomWidth: ARROW_SIZE,
    borderLeftWidth: ARROW_SIZE * 0.75,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: PATH_COLOR,
    borderLeftColor: 'transparent',
  },
  markerHalo: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    left: 0,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: Math.ceil(HALO_SIZE / 2),
    margin: (HEADING_BOX_SIZE - HALO_SIZE) / 2,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  marker: {
    justifyContent: 'center',
    backgroundColor: PATH_COLOR,
    width: SIZE,
    height: SIZE,
    borderRadius: Math.ceil(SIZE / 2),
    margin: (HEADING_BOX_SIZE - SIZE) / 2,
  },
});

export default class MyLocationMarker extends React.PureComponent {
  static propTypes = {
    enableHack: PropTypes.bool,
  };

  static defaultProps = {
    enableHack: false,
  };

  geoWatcher: BGGeoLocationWatcher = null;

  unwatch: Function = null;

  constructor(props) {
    super(props);
    this.state = {
      coords: null,
    };
    this.onPosChange = ::this.onPosChange;
  }

  async componentDidMount() {
    try {
      const watcher = await BGGeoLocationWatcher.getOrCreate();
      this.unwatch = watcher.on('position', this.onPosChange);
      watcher.watchPos();
      this.geoWatcher = watcher;
      // eslint-disable-next-line no-empty
    } catch {}
  }

  componentWillUnmount() {
    if (this.geoWatcher) {
      this.unwatch();
      this.geoWatcher.stopWatch();
    }
  }

  onPosChange({ coords }) {
    this.setState({ coords });
  }

  render() {
    const { coords } = this.state;
    if (!coords) return null;

    const { heading } = coords;
    const rotate = heading >= 0 ? `${heading}deg` : null;

    return (
      <Marker {...this.props} anchor={ANCHOR} style={styles.mapMarker} coordinate={coords}>
        <View style={styles.container}>
          <View style={styles.markerHalo} />
          {
            rotate && (
              <View style={[styles.heading, { transform: [{ rotate }] }]}>
                <View style={styles.headingPointer} />
              </View>
            )
          }
          <View style={styles.marker}>
            <Text style={{ width: 0, height: 0 }}>
              {this.props.enableHack && rotate}
            </Text>
          </View>
        </View>
      </Marker>
    );
  }
}
