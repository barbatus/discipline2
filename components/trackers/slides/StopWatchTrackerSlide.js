'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput,
  Vibration
} from 'react-native';

import {
  trackerDef,
  trackerStyles
} from '../styles/trackerStyles';

import {slideWidth} from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

export default class StopWatchTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);

    this.state = {
      ticking: false
    };
  }

  componentWillMount() {
    super.componentWillMount();
    let { tracker } = this.props;
    tracker.onTicking(::this._onTicking);
    tracker.onStart(::this._onStart);
    tracker.onStop(::this._onStop);
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <View style={styles.textContainer}>
            <View>
              <TextInput
                ref='time'
                style={styles.timeTextInput}
                value={time.formatTimeMs(this.state.time)}
                editable={false}>
              </TextInput>
            </View>
          </View>
        </View>
      </View>
    );
  }

  get footer() {
    let { editable } = this.props;

    let renderBtn = (label, onPress) => {
      return (
        <TouchableOpacity
          style={styles.button}
          disabled={!editable}
          onPress={this::onPress}>
          <Text style={styles.btnText}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    };

    let ticking = this.state.ticking;
    return (
      <View style={styles.footerContainer}>
        { ticking ? renderBtn('STOP', this._onStopBtn) :
                    renderBtn('START', this._onStartBtn) }
        { renderBtn('LAP', this._onLap) }
      </View>
    );
  }

  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      time: tracker.value
    });
  }

  onTick() {}

  _onTicking(value) {
    this.refs.time.setNativeProps({
      text: time.formatTimeMs(value)
    });
  }

  _onStart() {
    Vibration.vibrate();

    this.setState({
      ticking: true
    });
  }

  _onStartBtn() {
    let { tracker } = this.props;
    tracker.tick();
  }

  _onStop() {
    this.setState({
      ticking: false
    }); 
  }

  _onStopBtn() {
    let { tracker } = this.props;
    tracker.stop();
  }

  _onLap() {

  }
};

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeText: {
    fontSize: 56,
    textAlign: 'center',
    color: '#4A4A4A',
    fontWeight: '200'
  },
  footerContainer: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '100'
  },
  timeTextInput: {
    fontFamily: 'Courier',
    height: 40,
    width: slideWidth,
    fontSize: 52,
    color: '#4A4A4A',
    textAlign: 'center',
    fontWeight: '100'
  }
});
