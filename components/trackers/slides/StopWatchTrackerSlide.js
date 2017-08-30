import React from 'react';

import { caller } from '../../../utils/lang';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';

import { pure } from 'recompose';

import { trackerDef, trackerStyles } from '../styles/trackerStyles';

import { slideWidth } from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

import TimeLabel from './TimeLabel';

import Timers, { Timer } from '../../../time/Timers';

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

const FooterBtn = pure(FooterBtnFn);

export default class StopWatchTrackerSlide extends TrackerSlide {
  timer: Timer = null;

  constructor(props) {
    super(props);
    const { tracker } = props;
    this.state = {
      ...this.state,
      lapTimeMs: 0,
    };
    this.timer = Timers.get(tracker.id, 1000);
    this.timer.events.on('onTimer', ::this.onTimer);
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
        {
          tracker.active ?
            <FooterBtn
              label="STOP"
              responsive={responsive}
              onPress={this.onStop}
            /> :
              <FooterBtn
                label="START"
                responsive={responsive}
                onPress={this.onTick}
              />
        }
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

  onEdit() {
    const { tracker } = this.props;
    if (tracker.active) return;
    super.onEdit();
  }

  onTick() {
    Vibration.vibrate();

    this.timer.start(0);
    caller(this.props.onStart);
    caller(this.props.onTick);
  }

  onTimer(timeMs: number) {
    caller(this.props.onProgress, timeMs);
  }

  onStop() {
    this.timer.stop();
    caller(this.props.onStop);
  }

  onLap() {
    const { tracker } = this.props;
    this.setState({ lapTimeMs: tracker.value });
  }
}
