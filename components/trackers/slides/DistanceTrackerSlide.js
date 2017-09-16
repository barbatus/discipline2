import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';

import { pure } from 'recompose';

import { trackerStyles } from '../styles/trackerStyles';

import registry, { DlgType } from '../../dlg/registry';

import { formatDistance } from '../../../utils/format';

import { caller } from '../../../utils/lang';

import DistanceTrackers, { DistanceTracker } from '../../../geo/DistanceTrackers';

import { slideWidth } from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

import TimeLabel from './TimeLabel';

import StartStopBtn from './common/StartStopBtn';

const styles = StyleSheet.create({
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
  label: {
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dist: {
    marginBottom: 20,
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

const DistanceDataFn = ({ time, dist }) => {
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
        <TimeLabel
          style={styles.labelText}
          width={200}
          timeMs={time}
        />
      </View>
    </View>
  );
};

const DistanceData = pure(DistanceDataFn);

const DIST_INTRVL = 5.0;

const TIME_INTRVL = 1000; // ms

export default class DistanceTrackerSlide extends TrackerSlide {
  distTracker: DistanceTracker = null;

  path = [];

  constructor(props) {
    super(props);
    const { tracker } = props;
    this.distTracker = DistanceTrackers.get(
      tracker.id,
      DIST_INTRVL,
      TIME_INTRVL,
    );
    this.distTracker.events.on('onStart', ::this.onDistStart);
    this.distTracker.events.on('onUpdate', ::this.onDistUpdate);
    this.distTracker.events.on('onStop', ::this.onDistStop);
    this.showMap = ::this.showMap;
    this.onStopBtn = ::this.onStopBtn;
    this.onStartBtn = ::this.onStartBtn;
  }

  get bodyControls() {
    const { tracker } = this.props;
    return (
      <View style={trackerStyles.controls}>
        <DistanceData
          dist={tracker.value}
          time={tracker.time}
        />
      </View>
    );
  }

  get footerControls() {
    const { active } = this.state;
    const { tracker, responsive } = this.props;
    return (
      <View style={styles.footerControlsContainer}>
        <View style={styles.startStopBtn}>
          <StartStopBtn
            active={active}
            responsive={responsive}
            onPress={active ? this.onStopBtn : this.onStartBtn}
          />
        </View>
        <View style={styles.seeMap}>
          <Text style={trackerStyles.footerText}>
            See&nbsp;
            <Text style={styles.seeMapLink} onPress={this.showMap}>
              map
            </Text>
          </Text>
        </View>
      </View>
    );
  }

  componentWillUnmount() {
    const { tracker } = this.props;
    DistanceTrackers.dispose(tracker.id);
    this.distTracker = null;
  }

  onStartBtn() {
    this.distTracker.start();
  }

  onStopBtn() {
    this.distTracker.stop();
  }

  onDistStart(error) {
    if (error) return;

    this.setState({ active: true });

    Vibration.vibrate();

    caller(this.props.onStart);
    caller(this.props.onTick, 0, { time: 0 });
  }

  onDistStop(track) {
    this.setState({ active: false });

    this.onDistUpdate(track);
    caller(this.props.onStop);
  }

  onDistUpdate({ dist, time, lat, lon }) {
    caller(this.props.onProgress, dist, { time });
    this.path.push({ latitude: lat, longitude: lon });
  }

  showMap() {
    const dlg = registry.get(DlgType.MAPS);
    dlg.show(this.path.slice(0));
  }
}
