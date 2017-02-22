'use strict'

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import {commonStyles, screenWidth} from '../styles/common';

import BaseScroll from './BaseScroll';

import {caller} from '../../utils/lang';

const Scroll = React.createClass({
  propTypes: {
    slides: React.PropTypes.array.isRequired,
    slideWidth: React.PropTypes.number.isRequired,
    scrollEnabled: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      slides: [],
      scrollEnabled: true,
    }
  },

  getSize() {
    return this.props.slides.length;
  },

  getIndex() {
    return this.refs.scroll.index;
  },

  shouldComponentUpdate(props, state) {
    return this.props.slides !== props.slides ||
           this.props.scrollEnabled !== props.scrollEnabled;
  },

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  },

  render() {
    const { centered, slideWidth } = this.props;
    const marginLeft = centered ? (screenWidth - slideWidth) / 2 : 0;

    return (
      <BaseScroll
        ref='scroll'
        {...this.props}
        pagingEnabled={false}
        contentStyle={[commonStyles.centered, {marginLeft}]}>
      </BaseScroll>
    );
  }
});

export default Scroll;
