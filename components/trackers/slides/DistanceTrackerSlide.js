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
import slowlog from 'react-native-slowlog';

import Logger from 'app/log';
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
    top: 0,
    height: MAP_BUTTON_SIZE,
    width: MAP_BUTTON_SIZE,
  },
  mapIcon: {
    resizeMode: 'contain',
    height: MAP_ICON_SIZE,
    width: MAP_ICON_SIZE,
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
            source={UserIconsStore.get('map_marker').png}
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
  const speedFormat = formatSpeed(speed, metric);
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

const DIST_INTRVL_M = 5.0;

const TIME_INTRVL_MS = 1000; // ms

export default class DistanceTrackerSlide extends ProgressTrackerSlide {
  static propTypes = {
    responsive: PropTypes.bool,
    tracker: PropTypes.instanceOf(DistanceTracker).isRequired,
    metric: PropTypes.bool.isRequired,
    shown: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    slowlog(this, /.*/);
    const { tracker } = props;
    this.state = {
      ...this.state,
      btnEnabled: true,
      dist: tracker.value, // km
      timeMs: tracker.time,
      speed: 0,
    };
    this.showMap = ::this.showMap;
    this.onStopBtn = ::this.onStopBtn;
    this.onStartBtn = ::this.onStartBtn;
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
    const { timeMs, btnEnabled } = this.state;
    return (
      <DistanceFooter
        active={tracker.active}
        responsive={responsive}
        enabled={btnEnabled}
        showMap={Boolean(timeMs)}
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
    const { shown, tracker } = this.props;
    if (shown) {
      const timer = Timers.getOrCreate(tracker.id, tracker.time, TIME_INTRVL_MS);
      let distTracker = null;
      try {
        distTracker = await DistanceTrackers.getOrCreate(
          tracker.id,
          tracker.value,
          DIST_INTRVL_M,
        );
      } catch ({ value: distTracker }) {}

      timer.on(this.onTimeUpdate, this.onTimeLimit, this);
      distTracker.on('onLatLonUpdate', this.onLatLonUpdate, this);
    }

    // Distance tracker doesn't restart on reload.
    if (tracker.active) {
      this.onStop();
    }
  }

  async componentDidUpdate(prevProps) {
    const { shown, tracker } = this.props;

    if (prevProps.shown !== shown) {
      const { tracker } = this.props;
      const timer = Timers.getOrCreate(tracker.id);
      const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
      if (shown) {
        timer.on(this.onTimeUpdate, this.onTimeLimit, this);
        distTracker.on('onLatLonUpdate', this.onLatLonUpdate, this);
        this.setState({ ...distTracker.value, timeMs: timer.value });
      } else {
        timer.off(this.onTimeUpdate, this.onTimeLimit, this);
        distTracker.off('onLatLonUpdate', this.onLatLonUpdate, this);
      }
    } else if (prevProps.tracker !== tracker) {
      this.setState({ dist: tracker.value, timeMs: tracker.time, speed: 0 });
      this.manageTrackers();
    }
  }

  async componentWillUnmount() {
    const { tracker } = this.props;
    const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
    distTracker.off('onLatLonUpdate', this.onLatLonUpdate, this);
    DistanceTrackers.dispose(tracker.id);
    const timer = Timers.getOrCreate(tracker.id);
    timer.off(this.onTimeUpdate, this.onTimeLimit, this);
    Timers.dispose(tracker.id);
  }

  async onStartBtn() {
    const { tracker } = this.props;
    try {
      this.setState({ btnEnabled: false });
      const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
      await distTracker.checkGPS();
      this.onStart(0, { time: 0, latlon: [] });
    } catch (error) {
      if (error !== BGError.LOCATION_PERMISSION_DENIED) {
        Logger.log('Location permission is denied');
      }
      this.setState({ btnEnabled: true });
    }
  }

  /*
  * Start or stop associated trackers based on tracker model's values.
  * There is a gap on when tracker model is started (i.e. this.onStart) and when actual trackers are engaged,
  * this is done due to keep tracker starting logic in one place and use tracker model's values
  * for starting/stopping actual trackers.
  */
  async manageTrackers() {
    const { tracker } = this.props;

    const timer = Timers.getOrCreate(tracker.id);
    if (tracker.active && !timer.active) {
      this.start();
    }

    if (!tracker.active && timer.active) {
      this.stop();
    }
  }

  async start() {
    const { tracker } = this.props;
    const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
    await distTracker.start(tracker.value);
    const timer = Timers.getOrCreate(tracker.id);
    timer.start(tracker.time);
    Vibration.vibrate();
    Logger.log('DistanceTracker successfully started');
  }

  async stop() {
    const { tracker } = this.props;
    try {
      const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
      await distTracker.stop();
      // eslint-disable-next-line no-empty
    } catch {}
    const timer = Timers.getOrCreate(tracker.id);
    timer.stop();
  }

  async onStopBtn() {
    this.setState({ speed: 0 });
    this.onStop();
  }

  onTimeUpdate(timeMs: number) {
    const { dist } = this.state;
    this.onProgress(dist, { time: timeMs });
    this.setState({ timeMs });
  }

  onTimeLimit() {
    this.onStopBtn();
  }

  onLatLonUpdate({ dist, lat, lon, speed }) {
    this.onProgress(dist, { latlon: { lat, lon } }, { speed });
    const dlg = registry.get(DlgType.MAPS);
    if (dlg.shown) {
      dlg.draw(lat, lon);
    }
    this.setState({ dist, speed });
  }

  async showMap() {
    const dlg = registry.get(DlgType.MAPS);
    const { tracker } = this.props;
    const distTracker = await DistanceTrackers.getOrCreate(tracker.id);
    const paths = tracker.paths.concat(distTracker.paths)
      .map((path) => path.map(({ lat, lon }) => ({ latitude: lat, longitude: lon })));
    dlg.show(paths);
  }
}
