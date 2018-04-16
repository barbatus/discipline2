import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';

import PropTypes from 'prop-types';

import { pure } from 'recompose';

import slowlog from 'react-native-slowlog';

import registry, { DlgType } from 'app/components/dlg/registry';

import { formatDistance } from 'app/utils/format';

import { caller } from 'app/utils/lang';

import { DistanceTracker as Tracker } from 'app/model/Tracker';

import DistanceTrackers, { DistanceTracker } from 'app/geo/DistanceTrackers';

import { trackerStyles } from '../styles/trackerStyles';

import { slideWidth } from '../styles/slideStyles';

import ProgressTrackerSlide from './TrackerSlide';

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
          {format.format()}
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

DistanceDataFn.propTypes = {
  time: PropTypes.number.isRequired,
  dist: PropTypes.number.isRequired,
};

const DistanceData = pure(DistanceDataFn);

const DistanceFooterFn = ({ active, responsive, onStopBtn, onStartBtn, onShowMap }) =>
  <View style={styles.footerControlsContainer}>
    <View style={styles.startStopBtn}>
      <StartStopBtn
        active={active}
        responsive={responsive}
        onPress={active ? onStopBtn : onStartBtn}
      />
    </View>
    <View style={styles.seeMap}>
      <Text style={trackerStyles.footerText} onPress={onShowMap}>
        See&nbsp;
        <Text style={styles.seeMapLink}>
          map
        </Text>
      </Text>
    </View>
  </View>;

const DistanceFooter = pure(DistanceFooterFn);

DistanceFooterFn.propTypes = {
  active: PropTypes.bool,
  responsive: PropTypes.bool.isRequired,
  onStopBtn: PropTypes.func.isRequired,
  onStartBtn: PropTypes.func.isRequired,
  onShowMap: PropTypes.func.isRequired,
};

const DistanceBodyFn = ({ tracker }) =>
  <View style={trackerStyles.controls}>
    <DistanceData
      dist={tracker.value}
      time={tracker.time}
    />
  </View>;

DistanceBodyFn.propTypes = {
  tracker: PropTypes.instanceOf(Tracker).isRequired,
};

const DistanceBody = pure(DistanceBodyFn);

const DIST_INTRVL = 5.0;

const TIME_INTRVL = 1000; // ms

export default class DistanceTrackerSlide extends ProgressTrackerSlide {
  static propTypes = {
    responsive: PropTypes.bool,
    tracker: PropTypes.instanceOf(Tracker).isRequired,
  };

  distTracker: DistanceTracker = null;

  path = [];

  constructor(props) {
    super(props);
    slowlog(this, /.*/);
    const { tracker } = props;
    this.distTracker = DistanceTrackers.get(
      tracker.id,
      DIST_INTRVL,
      TIME_INTRVL,
    );
    this.distTracker.events.on('onUpdate', ::this.onDistUpdate);
    this.showMap = ::this.showMap;
    this.onStopBtn = ::this.onStopBtn;
    this.onStartBtn = ::this.onStartBtn;
  }

  get bodyControls() {
    const { tracker } = this.props;
    return (
      <DistanceBody tracker={tracker} />
    );
  }

  get footerControls() {
    const { active } = this.state;
    const { responsive } = this.props;
    return (
      <DistanceFooter
        active={active}
        responsive={responsive}
        onStopBtn={this.onStopBtn}
        onStartBtn={this.onStartBtn}
        onShowMap={this.showMap}
      />
    );
  }

  componentWillUnmount() {
    const { tracker } = this.props;
    DistanceTrackers.dispose(tracker.id);
    this.distTracker = null;
  }

  onStartBtn() {
    this.distTracker.start(this.onDistStart);
  }

  onStopBtn() {
    this.distTracker.stop(this.onDistStop);
  }

  onDistStart(error) {
    if (error) return;

    this.setState({ active: true });

    Vibration.vibrate();

    this.onStart(0, { time: 0 });
  }

  onDistStop(track) {
    this.setState({ active: false });

    this.onDistUpdate(track);
    this.onStop();
  }

  onDistUpdate({ dist, time, lat, lon }) {
    this.path.push({ latitude: lat, longitude: lon });
    this.onProgress(dist, { time, latlon: { lat, lon } });
  }

  showMap() {
    const dlg = registry.get(DlgType.MAPS);
    const { tracker } = this.props;
    const paths = tracker.paths.map((path) =>
      path.map(({ lat, lon }) => ({
        latitude: lat,
        longitude: lon,
      })));
    dlg.show(paths);
  }
}
