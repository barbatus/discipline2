import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import { getIcon } from 'app/icons/icons';
import Tracker from 'app/model/Tracker';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerView from './common/TrackerView';

const styles = StyleSheet.create({
  view: {
    opacity: 0.35,
  },
});

export default class DummyTrackerSlide extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    style: null,
  };

  get bodyControls() {
    return (
      <View style={trackerStyles.controls}>
        <TouchableOpacity disabled>
          <Image source={getIcon('check')} style={trackerStyles.checkBtn} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[trackerStyles.slide, style]}>
        <TrackerView
          tracker={new Tracker({})}
          style={styles.view}
          bodyControls={this.bodyControls}
          footerControls={null}
        />
      </View>
    );
  }
}
