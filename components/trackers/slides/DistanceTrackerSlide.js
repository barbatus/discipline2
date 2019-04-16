import React from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Vibration,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import slowlog from 'react-native-slowlog';

import registry, { DlgType } from 'app/components/dlg/registry';
import { formatDistance, formatSpeed } from 'app/utils/format';
import UserIconsStore from 'app/icons/UserIconsStore';
import { DistanceTracker } from 'app/model/Tracker';
import DistanceTrackers, { Timers } from 'app/model/DistanceTrackers';
import { BGError } from 'app/geo/BGGeoLocationWatcher';

import { trackerStyles } from '../styles/trackerStyles';

import ProgressTrackerSlide from './ProgressTrackerSlide';
import TimeLabel from './TimeLabel';
import StartStopBtn from './common/StartStopBtn';

const MAP_ICON_SIZE = 40;
const MAP_BUTTON_SIZE = 30;

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
  labelText: {
    fontSize: 50,
    fontWeight: '100',
    textAlign: 'center',
  },
  distLabel: {
    marginBottom: 10,
    paddingLeft: 50,
    alignItems: 'baseline',
  },
  speedLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 5,
    paddingRight: 10,
    alignItems: 'baseline',
  },
  speedText: {
    fontSize: 30,
    fontWeight: '100',
    textAlign: 'center',
    color: '#9B9B9B',
  },
  unitText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '200',
    width: 50,
    lineHeight: 15,
    paddingLeft: 5,
  },
  unitText2: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '200',
    width: 50,
    lineHeight: 15,
    paddingLeft: 5,
  },
  seeMap: {
    position: 'absolute',
    right: -60,
    top: 5,
    borderRadius: MAP_BUTTON_SIZE,
    borderWidth: 2,
    borderColor: '#D9DADB',
    height: MAP_BUTTON_SIZE,
    width: MAP_BUTTON_SIZE,
    overflow: 'hidden',
  },
  mapIcon: {
    resizeMode: 'contain',
    height: MAP_ICON_SIZE,
    width: MAP_ICON_SIZE,
    top: -6,
    left: -6,
  },
  border: {
    borderWidth: 2,
    borderColor: '#D9DADB',
  },
});

const DistanceDataFn = ({ time, dist, metric }) => {
  const distFormat = formatDistance(dist, metric);
  return (
    <View style={styles.distData}>
      <View style={[styles.label, styles.distLabel]}>
        <Text style={styles.labelText}>
          {distFormat.format()}
        </Text>
        <Text style={styles.unitText}>
          {distFormat.unit}
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
  metric: PropTypes.bool.isRequired,
};

const DistanceData = React.memo(DistanceDataFn);

const DistanceFooterFn = ({
  active, responsive, enabled, showMap, onStopBtn, onStartBtn, onShowMap,
}) => (
  <View style={styles.footerControlsContainer}>
    <StartStopBtn
      active={active}
      responsive={responsive}
      enabled={enabled}
      onPress={active ? onStopBtn : onStartBtn}
    />
    {
      showMap ? (
        <TouchableOpacity
          style={styles.seeMap}
          onPress={onShowMap}
        >
          <Image
            source={UserIconsStore.get('map').png}
            style={styles.mapIcon}
          />
        </TouchableOpacity>
      ) : null
    }
  </View>
);

const DistanceFooter = React.memo(DistanceFooterFn);

DistanceFooterFn.propTypes = {
  active: PropTypes.bool.isRequired,
  responsive: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  showMap: PropTypes.bool.isRequired,
  onStopBtn: PropTypes.func.isRequired,
  onStartBtn: PropTypes.func.isRequired,
  onShowMap: PropTypes.func.isRequired,
};

const DistanceBodyFn = ({ dist, time, metric, speed, showSpeed }) => {
  const speedFormat = formatSpeed(speed);
  return (
    <View style={trackerStyles.controls}>
      {
        showSpeed ? (
          <View style={[styles.label, styles.speedLabel]}>
            <Text style={styles.speedText}>
              {speedFormat.format()}
            </Text>
            <Text style={styles.unitText2}>
              {speedFormat.unit}
            </Text>
          </View>
        ) : null
      }
      <DistanceData
        dist={dist}
        time={time}
        speed={speed}
        metric={metric}
      />
    </View>
  );
};

DistanceBodyFn.propTypes = {
  dist: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  metric: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  showSpeed: PropTypes.bool.isRequired,
};

const DistanceBody = React.memo(DistanceBodyFn);

const DIST_INTRVL = 5.0;

const TIME_INTRVL_MS = 1000; // ms

export default class DistanceTrackerSlide extends ProgressTrackerSlide {
  static propTypes = {
    responsive: PropTypes.bool,
    tracker: PropTypes.instanceOf(DistanceTracker).isRequired,
    metric: PropTypes.bool.isRequired,
  };

  paths = [];

  constructor(props) {
    super(props);
    slowlog(this, /.*/);
    const { tracker } = props;
    this.state = {
      ...this.state,
      btnEnabled: true,
      dist: tracker.value,
      timeMs: tracker.time,
      speed: 0,
    };
    this.showMap = ::this.showMap;
    this.onStopBtn = ::this.onStopBtn;
    this.onStartBtn = ::this.onStartBtn;
    this.onDistStart = ::this.onDistStart;
    this.onDistStop = ::this.onDistStop;
    this.onLatLonUpdate = ::this.onLatLonUpdate;
    this.onTimeUpdate = ::this.onTimeUpdate;
  }

  get bodyControls() {
    const { tracker, metric } = this.props;
    const { dist, timeMs, speed } = this.state;
    return (
      <DistanceBody
        dist={dist}
        time={timeMs}
        speed={speed}
        metric={metric}
        showSpeed={!!tracker.props.showSpeed}
      />
    );
  }

  get footerControls() {
    const { tracker, responsive } = this.props;
    const { dist, btnEnabled } = this.state;
    return (
      <DistanceFooter
        active={tracker.active}
        responsive={responsive}
        enabled={btnEnabled}
        showMap={Boolean(dist)}
        onStopBtn={this.onStopBtn}
        onStartBtn={this.onStartBtn}
        onShowMap={this.showMap}
      />
    );
  }

  get trackerProps() {
    return DistanceTracker.properties;
  }

  async componentDidMount() {
    const { tracker } = this.props;
    const timer = Timers.getOrCreate(tracker.id, tracker.time, TIME_INTRVL_MS);
    timer.events.on('onTimer', this.onTimeUpdate);
    try {
      const distTracker = await DistanceTrackers.getOrCreate(
        tracker.id,
        tracker.value,
        DIST_INTRVL,
      );
      distTracker.events.on('onLatLonUpdate', this.onLatLonUpdate);
    } catch ({ value: distTracker }) {
      distTracker.events.on('onLatLonUpdate', this.onLatLonUpdate);
    }
  }

  async componentWillUnmount() {
    const { tracker } = this.props;
    const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
    distTracker.events.off('onLatLonUpdate', this.onLatLonUpdate);
    DistanceTrackers.dispose(tracker.id);
    const timer = Timers.getOrCreate(tracker.id);
    timer.events.off('onTimer', this.onTimeUpdate);
    Timers.dispose(tracker.id);
  }

  async onStartBtn() {
    const { tracker } = this.props;
    try {
      this.setState({ btnEnabled: false });
      const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
      await distTracker.start();
      const timer = Timers.getOrCreate(tracker.id);
      timer.start();
      this.onDistStart();
    } catch (error) {
      if (error !== BGError.LOCATION_PERMISSION_DENIED) {
        Alert.alert('Distance Tracking', error.message);
      }
      this.setState({ btnEnabled: true });
    }
  }

  async onStopBtn() {
    const { tracker } = this.props;
    try {
      const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
      await distTracker.stop();
      this.onDistStop();
      // eslint-disable-next-line no-empty
    } catch {}

    const timer = Timers.getOrCreate(tracker.id);
    timer.stop();
  }

  onDistStart() {
    Vibration.vibrate();
    this.onStart(0, { time: 0, latlon: [] });
  }

  onDistStop() {
    this.onStop();
  }

  onTimeUpdate(timeMs: number) {
    this.onProgress(this.dist, { time: timeMs });
    this.setState({ timeMs });
  }

  onLatLonUpdate({ dist, lat, lon, speed, paths }) {
    this.paths = paths;
    this.onProgress(dist, { latlon: { lat, lon } }, { speed });
    this.setState({ dist, speed });
  }

  showMap() {
    const dlg = registry.get(DlgType.MAPS);
    const { tracker } = this.props;
    const paths = tracker.paths.concat(this.paths)
      .map((path) => path.map(({ lat, lon }) => ({ latitude: lat, longitude: lon })));
    dlg.show(paths);
  }
}
