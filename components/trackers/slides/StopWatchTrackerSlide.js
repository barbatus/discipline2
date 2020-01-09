import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';
import PropTypes from 'prop-types';

import Timers from 'app/model/Timers';

import { trackerStyles } from '../styles/trackerStyles';
import { SLIDE_WIDTH } from '../styles/slideStyles';

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
    width: SLIDE_WIDTH,
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

  async componentDidMount() {
    const { tracker, shown } = this.props;
    if (shown) {
      const timer = await Timers.getOrCreate(tracker.id, 1000);
      timer.on(this.onTimer, this.onTimerLimit, this);

      if (tracker.active) {
        timer.restart(tracker.value);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { shown, tracker } = this.props;
  
    if (prevProps.shown !== shown) {
      const { tracker } = this.props;
      const timer = await Timers.getOrCreate(tracker.id);
      if (shown) {
        timer.on(this.onTimer, this.onTimerLimit, this);
        this.setState({ timeMs: timer.value });
      } else {
        timer.off(this.onTimer, this.onTimerLimit, this);
      }
    }

    if (prevProps.tracker !== tracker) {
      this.setState({ lapTimeMs: 0, timeMs: tracker.value });
      this.manageTimer();
    }
  }

  async componentWillUnmount() {
    const { tracker } = this.props;
    const timer = await Timers.getOrCreate(tracker.id);
    timer.off(this.onTimer, this.onTimerLimit, this);
    Timers.dispose(tracker.id);
  }

  async manageTimer() {
    const { tracker } = this.props;
    const timer = await Timers.getOrCreate(tracker.id);

    if (tracker.active && !timer.active) {
      Vibration.vibrate();
      timer.start(tracker.value);
    }

    if (!tracker.active && timer.active) {
      timer.stop();
    }
  }

  onTick() {
    this.onStart(0);
  }

  onStop() {
    super.onStop();
  }

  onTimer(timeMs: number, lastTimeMs: number) {
    this.onProgress(lastTimeMs);
    this.setState({ timeMs });
  }

  onTimerLimit() {
    this.onStop();
  }

  onLap() {
    const { timeMs } = this.state;
    this.setState({ lapTimeMs: timeMs });
  }
}
