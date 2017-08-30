import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import { commonStyles, screenWidth } from '../styles/common';

import BaseScroll from './BaseScroll';

import { caller } from '../../utils/lang';

class Scroll extends PureComponent {
  static propTypes = {
    slides: React.PropTypes.array.isRequired,
    slideWidth: React.PropTypes.number.isRequired,
    scrollEnabled: React.PropTypes.bool,
  };

  static defaultProps = {
    slides: [],
    scrollEnabled: true,
  };

  get index() {
    return this.refs.scroll.index;
  }

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  }

  render() {
    const { centered, slideWidth } = this.props;
    const padding = centered ? (screenWidth - slideWidth) / 2 : 0;
    const paddingStyle = {
      paddingLeft: padding,
      paddingRight: padding,
    };

    return (
      <BaseScroll
        ref="scroll"
        {...this.props}
        pagingEnabled={false}
        contentStyle={[commonStyles.centered, paddingStyle]}
      />
    );
  }
}

export default Scroll;
