'use strict';

import React, {Component} from 'react';

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

import TimeLabel from './TimeLabel';

import {formatDistance} from '../../../utils/format';

class DistanceData extends Component {
  constructor(props) {
    super(props);

    let { time, dist } = props;
    this.state = { time, dist };
  }

  setDistAndTime(dist, time) {
    this.setState({ dist, time });
  }

  shouldComponentUpdate(props, state) {
    if (props.dist != this.props.dist ||
        props.time != this.props.time) {
      this.state.time = props.time;
      this.state.dist = props.dist;
      return true;
    }

    return this.state.dist != state.dist ||
           this.state.time != state.time;
  }

  render() {
    let { time, dist } = this.state;

    let format = formatDistance(dist);
    return (
      <View style={styles.distData}>
        <View style={[styles.label, styles.dist]}>
          <Text style={styles.labelText}>
            { format.format }
          </Text>
          <Text style={styles.titleText}>
            { format.unit }
          </Text>
        </View>
        <View style={styles.label}>
          <TimeLabel
            style={styles.labelText}
            width={200}
            timeMs={time} />
        </View>
      </View>
    );
  }
}

export default class DistanceTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    };
  }

  get controls() {
    let { time, dist } = this.state;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <DistanceData
            ref='dist'
            dist={dist}
            time={time} />
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

    let active = this.state.active;
    return (
      <View style={styles.footerContainer}>
        { active ? renderBtn('STOP', this._onStopBtn) :
                   renderBtn('START', this._onStartBtn) }
      </View>
    );
  }

  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      dist: tracker.value,
      time: tracker.time
    });
  }

  onTick() {
    Vibration.vibrate();

    this.setState({
      active: true
    });
  }

  onValue({ time, speed, dist }) {
    this.refs.dist.setDistAndTime(dist, time);
  }

  onStop() {
    this.setState({
      active: false
    });
  }

  _onStartBtn() {
    let { tracker } = this.props;
    tracker.tick();
  }

  _onStopBtn() {
    let { tracker } = this.props;
    tracker.stop();
  }
};

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  distData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '100'
  },
  label: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dist: {
    alignItems: 'flex-end'
  },
  labelText: {
    fontSize: 50,
    fontWeight: '100',
    textAlign: 'center'
  },
  titleText: {
    fontSize: 15,
    paddingBottom: 10,
    paddingLeft: 5,
    color: '#9B9B9B',
    textAlign: 'center',
    fontWeight: '200'
  }
});
