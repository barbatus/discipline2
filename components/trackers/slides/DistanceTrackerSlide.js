import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Vibration,
  Image,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import { pure } from 'recompose';

import slowlog from 'react-native-slowlog';

import registry, { DlgType } from 'app/components/dlg/registry';
import { formatDistance } from 'app/utils/format';
import UserIconsStore from 'app/icons/UserIconsStore';
import { DistanceTracker as Tracker } from 'app/model/Tracker';
import DistanceTrackers, { DistanceTracker } from 'app/geo/DistanceTrackers';

import { trackerStyles } from '../styles/trackerStyles';

import ProgressTrackerSlide from './ProgressTrackerSlide';
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dist: {
    marginBottom: 20,
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  labelText: {
    fontSize: 50,
    fontWeight: '100',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '200',
    width: 10,
  },
  seeMap: {
    position: 'absolute',
    right: -50,
    top: 5,
  },
  mapIcon: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
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
        <View>
          <Text style={styles.labelText}>
            {format.format()}
            <Text style={styles.titleText}>
              {format.unit}
            </Text>
          </Text>
        </View>
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

const DistanceFooterFn = ({ active, responsive, showMap, onStopBtn, onStartBtn, onShowMap }) => (
  <View style={styles.footerControlsContainer}>
    <StartStopBtn
      active={active}
      responsive={responsive}
      onPress={active ? onStopBtn : onStartBtn}
    />
    {
      showMap ?
        <TouchableOpacity
          style={styles.seeMap}
          onPress={onShowMap}
        >
          <Image
            source={UserIconsStore.get('info').png}
            style={styles.mapIcon}
          />
        </TouchableOpacity>
        : null
    }
  </View>
);

const DistanceFooter = pure(DistanceFooterFn);

DistanceFooterFn.propTypes = {
  active: PropTypes.bool.isRequired,
  responsive: PropTypes.bool.isRequired,
  onStopBtn: PropTypes.func.isRequired,
  onStartBtn: PropTypes.func.isRequired,
  onShowMap: PropTypes.func.isRequired,
};

const DistanceBodyFn = ({ tracker }) => (
  <View style={trackerStyles.controls}>
    <DistanceData
      dist={tracker.value}
      time={tracker.time}
    />
  </View>
);

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

  distTracker: DistanceTracker;
  path = [];

  constructor(props) {
    super(props);
    slowlog(this, /.*/);
    const { tracker } = props;
    this.state = { active: false };
    this.distTracker = DistanceTrackers.get(
      tracker.id,
      DIST_INTRVL,
      TIME_INTRVL,
    );
    this.distTracker.events.on('onLatLonUpdate', ::this.onLatLonUpdate);
    this.distTracker.events.on('onTimeUpdate', ::this.onTimeUpdate);
    this.showMap = ::this.showMap;
    this.onStopBtn = ::this.onStopBtn;
    this.onStartBtn = ::this.onStartBtn;
    this.onDistStart = ::this.onDistStart;
    this.onDistStop = ::this.onDistStop;
  }

  get bodyControls() {
    const { tracker } = this.props;
    return (
      <DistanceBody tracker={tracker} />
    );
  }

  get footerControls() {
    const { tracker, responsive } = this.props;
    return (
      <DistanceFooter
        active={tracker.active}
        responsive={responsive}
        showMap={tracker.value}
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

    //this.setState({ active: true });

    Vibration.vibrate();

    this.onStart(0, { time: 0, latlon: [] });
  }

  onDistStop(latLon) {
    //this.setState({ active: false });

    if (latLon) {
      const { dist, lat, lon } = latLon;
      this.path.push({ latitude: lat, longitude: lon });
      this.onStop(dist, { latlon: { lat, lon } });
    } else {
      this.onStop();
    }
  }

  onTimeUpdate(time: number) {
    const { tracker } = this.props;
    this.onProgress(tracker.lastValue, { time });
  }

  onLatLonUpdate({ dist, lat, lon }) {
    this.path.push({ latitude: lat, longitude: lon });
    this.onProgress(dist, { latlon: { lat, lon } });
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
