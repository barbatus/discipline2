import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';
import PropTypes from 'prop-types';

import Timer from 'app/time/Timer';
import Timers from 'app/model/Timers';

import { trackerStyles } from '../styles/trackerStyles';
import { slideWidth } from '../styles/slideStyles';

import StartStopBtn from './common/StartStopBtn';
import ProgressTrackerSlide from './ProgressTrackerSlide';
import TimeLabel from './TimeLabel';

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '200',
  },
});

const FooterBtnFn = ({ label, responsive, onPress }) => (
  <TouchableOpacity
    style={styles.button}
    disabled={!responsive}
    onPress={onPress}
  >
    <Text style={styles.btnText}>
      {label}
    </Text>
  </TouchableOpacity>
);

FooterBtnFn.propTypes = {
  label: PropTypes.string.isRequired,
  responsive: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

const FooterBtn = React.memo(FooterBtnFn);

export default class StopWatchTrackerSlide extends ProgressTrackerSlide {
  constructor(props) {
    super(props);
    const { tracker } = props;
    this.state = {
      ...super.state,
      lapTimeMs: 0,
      timeMs: tracker.value,
    };
    this.onLap = ::this.onLap;
    this.onTick = ::this.onTick;
    this.onStop = ::this.onStop;
    this.onTimer = ::this.onTimer;
  }

  get bodyControls() {
    const { timeMs, lapTimeMs } = this.state;
    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TimeLabel
            width={200}
            timeMs={timeMs}
            lapTimeMs={lapTimeMs}
          />
        </View>
      </View>
    );
  }

  get footerControls() {
    const { tracker, responsive } = this.props;
    return (
      <View style={styles.footerContainer}>
        <StartStopBtn
          active={tracker.active}
          responsive={responsive}
          onPress={tracker.active ? this.onStop : this.onTick}
        />
        <FooterBtn
          label="LAP"
          responsive={responsive}
          onPress={this.onLap}
        />
      </View>
    );
  }

  componentDidMount() {
    const { tracker } = this.props;
    const timer = Timers.getOrCreate(tracker.id, tracker.value, 1000);
    timer.events.on('onTimer', this.onTimer);
  }

  componentWillUnmount() {
    const { tracker } = this.props;
    const timer = Timers.getOrCreate(tracker.id);
    timer.events.off('onTimer', this.onTimer);
    Timers.dispose(tracker.id);
  }

  startTimer() {
    const { tracker } = this.props;
    const timer = Timers.getOrCreate(tracker.id);
    timer.start();
    this.onStart(0);
  }

  onTick() {
    Vibration.vibrate();

    this.startTimer();
  }

  onTimer(timeMs: number, lastTimeMs: number) {
    this.onProgress(lastTimeMs);
    this.setState({ timeMs });
  }

  onStop() {
    const { tracker } = this.props;
    const timer = Timers.getOrCreate(tracker.id);
    timer.stop();
    super.onStop();
  }

  onLap() {
    const { timeMs } = this.state;
    this.setState({ lapTimeMs: timeMs });
  }
}
