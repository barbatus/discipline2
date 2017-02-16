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
  Vibration,
} from 'react-native';

import {connect} from 'react-redux';

import {
  trackerDef,
  trackerStyles,
} from '../styles/trackerStyles';

import registry, {DlgType} from '../../dlg/registry';

import {formatDistance} from '../../../utils/format';

import {caller} from '../../../utils/lang';

import {tickGeoTracker} from '../../../model/actions';

import DistanceTracker from '../../../geo/DistanceTracker';

import {slideWidth} from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

import TimeLabel from './TimeLabel';

class DistanceData extends Component {
  constructor(props) {
    super(props);

    const { time, dist } = props;
    this.state = { time, dist };
  }

  setDistAndTime(dist, time) {
    this.setState({ dist, time });
  }

  shouldComponentUpdate(props, state) {
    if (props.dist !== this.props.dist ||
        props.time !== this.props.time) {
      this.state.time = props.time;
      this.state.dist = props.dist;
      return true;
    }

    return this.state.dist !== state.dist ||
           this.state.time !== state.time;
  }

  render() {
    const { time, dist } = this.state;

    const format = formatDistance(dist);
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
            timeMs={time}
          />
        </View>
      </View>
    );
  }
}

const DIST_INTRVL = 5.0;

const TIME_INTRVL = 100; // ms

class DistanceTrackerSlide extends TrackerSlide {
  _distTracker = null;

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this._distTracker = new DistanceTracker(DIST_INTRVL, TIME_INTRVL);
  }

  shouldComponentUpdate(props, state) {
    const should = super.shouldComponentUpdate(props, state);
    return should || this.state.active !== state.active;
  }

  get controls() {
    const { tracker } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <DistanceData
            ref='dist'
            dist={tracker.value}
            time={tracker.time}
          />
        </View>
      </View>
    );
  }

  get footer() {
    const { editable } = this.props;
    const renderBtn = (label, onPress) => {
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

    const active = this.state.active;
    return (
      <View style={styles.footerContainer}>
        <View style={styles.startStopBtn}>
          { active ? renderBtn('STOP', this._onStopBtn) :
                     renderBtn('START', this._onStartBtn) }
        </View>
        <View style={styles.seeMap}>
          <Text style={trackerStyles.footerText}>
            See {
              <Text
                style={styles.seeMapLink}
                onPress={::this._showMap}>
                map
              </Text>
            }
          </Text>
        </View>
      </View>
    );
  }

  _onStartBtn() {
    this._distTracker.start(::this._onDistStart, ::this._onDistUpdate);
  }

  _onStopBtn() {
    this._distTracker.stop(::this._onDistStop);
  }

  _onDistStart(error) {
    if (error) return;

    const { tracker } = this.props;
    this._initDist = tracker.value;
    this._initTime = tracker.time;

    Vibration.vibrate();

    this.setState({
      active: true,
    });
  }

  _onDistStop({ dist, time }) {
    this._onDistUpdate({ dist, time });

    this.setState({
      active: false,
    });

    const { onStop, tracker } = this.props;
    caller(onStop, tracker, dist, time);
  }

  _onDistUpdate({ dist, time }) {
    dist = this._initDist + dist;
    time = this._initTime + time; 
    this.refs.dist.setDistAndTime(dist, time);
  }

  _showMap() {
    const initRegion = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0121,
    };
    const dlg = registry.get(DlgType.MAPS);
    dlg.show(initRegion);
  }
};

export default connect(null,
  dispatch => {
    return {
      onStop: (tracker, dist, time) => dispatch(
        tickGeoTracker(tracker, dist, { time })
      )
    };
  }
)(DistanceTrackerSlide);

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  distData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '100',
  },
  label: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dist: {
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
    flex: 0.6,
  },
  seeMap: {
    flex: 0.4,
  },
  seeMapLink: {
    textDecorationLine: 'underline',
  },
});
