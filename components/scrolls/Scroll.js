'use strict'

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';

import {commonStyles} from '../styles/common';

import BaseScroll from './BaseScroll';

import {caller} from '../../utils/lang';

const Scroll = React.createClass({
  propTypes: {
    slides: React.PropTypes.array.isRequired,
    slideWidth: React.PropTypes.number.isRequired,
    scrollEnabled: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      slides: [],
      scrollEnabled: true
    }
  },

  getSize() {
    return this.props.slides.length;
  },

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  },

  render() {
    let { style, slides, slideWidth, scrollEnabled, index } = this.props;

    return (
      <BaseScroll
        ref='scroll'
        slides={slides}
        pagingEnabled={false}
        style={style}
        slideWidth={slideWidth}
        scrollEnabled={scrollEnabled}
        contentStyle={commonStyles.centered}>
      </BaseScroll>
    );
  }
});

module.exports = Scroll;
