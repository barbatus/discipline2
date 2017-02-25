'use strict';

import React, { Component } from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput,
  Vibration,
} from 'react-native';

import { trackerDef, trackerStyles } from '../styles/trackerStyles';

import registry, { DlgType } from '../../dlg/registry';

import { formatDistance } from '../../../utils/format';

import { caller } from '../../../utils/lang';

import DistanceTrackers, {
  DistanceTracker,
} from '../../../geo/DistanceTrackers';

import { slideWidth } from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

import TimeLabel from './TimeLabel';

class DistanceData extends Component {
  constructor(props) {
    super(props);

    const { time, dist } = props;
    this.state = { time, dist };
  }

  shouldComponentUpdate(props, state) {
    if (props.dist !== this.props.dist || props.time !== this.props.time) {
      this.state.time = props.time;
      this.state.dist = props.dist;
      return true;
    }

    return this.state.dist !== state.dist || this.state.time !== state.time;
  }

  render() {
    const { time, dist } = this.state;
    const format = formatDistance(dist);
    return (
      <View style={styles.distData}>
        <View style={[styles.label, styles.dist]}>
          <Text style={styles.labelText}>
            {format.format}
          </Text>
          <Text style={styles.titleText}>
            {format.unit}
          </Text>
        </View>
        <View style={styles.label}>
          <TimeLabel style={styles.labelText} width={200} timeMs={time} />
        </View>
      </View>
    );
  }
}

const DIST_INTRVL = 5.0;

const TIME_INTRVL = 100; // ms

export default class DistanceTrackerSlide extends TrackerSlide {
  _distTracker: DistanceTracker = null;

  _path = [];

  constructor(props) {
    super(props);
    const { tracker } = props;
    this._distTracker = DistanceTrackers.get(
      tracker.id,
      DIST_INTRVL,
      TIME_INTRVL,
    );
    this._distTracker.events.on('onStart', ::this._onDistStart);
    this._distTracker.events.on('onUpdate', ::this._onDistUpdate);
    this._distTracker.events.on('onStop', ::this._onDistStop);
  }

  get bodyStyle() {
    return styles.bodyContainer;
  }

  get footerStyle() {
    return styles.footerContainer;
  }

  get bodyControls() {
    const { tracker } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <DistanceData ref="dist" dist={tracker.value} time={tracker.time} />
        </View>
      </View>
    );
  }

  get footerControls() {
    const { responsive } = this.props;
    const renderBtn = (label, onPress) => {
      return (
        <TouchableOpacity
          style={styles.button}
          disabled={!responsive}
          onPress={this::onPress}
        >
          <Text style={styles.btnText}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    };

    const { tracker } = this.props;
    return (
      <View style={styles.footerControlsContainer}>
        <View style={styles.startStopBtn}>
          {tracker.active
            ? renderBtn('STOP', this._onStopBtn)
            : renderBtn('START', this._onStartBtn)}
        </View>
        <View style={styles.seeMap}>
          <Text style={trackerStyles.footerText}>
            See {
              (
                <Text style={styles.seeMapLink} onPress={::this._showMap}>
                  map
                </Text>
              )
            }
          </Text>
        </View>
      </View>
    );
  }

  componentWillUnmount() {
    const { tracker } = this.props;
    DistanceTrackers.dispose(tracker.id);
    this._distTracker = null;
  }

  _onStartBtn() {
    this._distTracker.start();
  }

  _onStopBtn() {
    this._distTracker.stop();
  }

  _onDistStart(error) {
    if (error) return;

    const { tracker } = this.props;
    this._initDist = tracker.value;
    this._initTime = tracker.time;

    Vibration.vibrate();

    caller(this.props.onStart);
    caller(this.props.onTick, 0, { time: 0 });
  }

  _onDistStop({ dist, time, latitude, longitude }) {
    this._onDistUpdate({ dist, time, latitude, longitude });
    caller(this.props.onStop);
  }

  _onDistUpdate({ dist, time, latitude, longitude }) {
    caller(this.props.onProgress, dist, { time });
    this._path.push({ latitude, longitude });
  }

  _showMap() {
    const dlg = registry.get(DlgType.MAPS);
    dlg.show(this._path.slice(0));
  }
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 0.35,
  },
  footerContainer: {
    flex: 0.2,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerControlsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '100',
  },
  label: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dist: {
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 50,
    fontWeight: '100',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 15,
    paddingBottom: 10,
    paddingLeft: 5,
    color: '#9B9B9B',
    textAlign: 'center',
    fontWeight: '200',
  },
  startStopBtn: {
    flex: 0.5,
    justifyContent: 'center',
  },
  seeMap: {
    flex: 0.5,
    justifyContent: 'center',
  },
  seeMapLink: {
    textDecorationLine: 'underline',
  },
});
