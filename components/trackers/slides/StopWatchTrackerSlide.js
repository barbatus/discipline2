import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';
import PropTypes from 'prop-types';

import { pure } from 'recompose';

import Timers, { Timer } from 'app/time/Timers';

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

const FooterBtn = pure(FooterBtnFn);

export default class StopWatchTrackerSlide extends ProgressTrackerSlide {
  timer: Timer = null;

  constructor(props) {
    super(props);
    const { tracker } = props;
    this.state = {
      ...this.state,
      lapTimeMs: 0,
    };
    this.timer = Timers.get(tracker.id, 1000);
    this.onLap = ::this.onLap;
    this.onTick = ::this.onTick;
    this.onStop = ::this.onStop;
  }

  get bodyControls() {
    const { tracker } = this.props;
    const { lapTimeMs } = this.state;
    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TimeLabel
            width={200}
            timeMs={tracker.value}
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

  componentWillUnmount() {
    const { tracker } = this.props;
    Timers.dispose(tracker.id);
    this.timer = null;
  }

  onTick() {
    Vibration.vibrate();

    this.timer.start(0);

    this.timer.events.on('onTimer', ::this.onTimer);
    this.onStart(0);
  }

  onTimer(timeMs: number) {
    this.onProgress(timeMs);
  }

  onStop() {
    this.timer.stop();
    this.timer.events.removeAllListeners('onTimer');
    super.onStop();
  }

  onLap() {
    const { tracker } = this.props;
    this.setState({ lapTimeMs: tracker.value });
  }
}
