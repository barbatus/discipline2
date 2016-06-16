'use strict';

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated
} from 'react-native';

import { commonStyles } from '../styles/common';

const BaseScroll = React.createClass({
  propTypes: {
    slideWidth: React.PropTypes.number.isRequired,
    index: React.PropTypes.number,
    slides: React.PropTypes.array.isRequired,
    horizontal: React.PropTypes.bool,
    style: View.propTypes.style,
    pagingEnabled: React.PropTypes.bool,
    scrollEnabled: React.PropTypes.bool,
    showsHorizontalScrollIndicator: React.PropTypes.bool,
    bounces: React.PropTypes.bool,
    scrollsToTop: React.PropTypes.bool,
    removeClippedSubviews: React.PropTypes.bool,
    automaticallyAdjustContentInsets: React.PropTypes.bool,
    keyboardDismissMode: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      index: 0,
      slides: [],
      horizontal: true,
      pagingEnabled: true,
      scrollEnabled: true,
      showsHorizontalScrollIndicator: false,
      bounces: false,
      scrollsToTop: false,
      removeClippedSubviews: true,
      automaticallyAdjustContentInsets: false,
      keyboardDismissMode: 'on-drag'
    }
  },

  getInitialState() {
    let { scrollEnabled } = this.props;
    return {
      scrollEnabled: scrollEnabled
    }
  },

  componentWillMount() {
    let { slideWidth } = this.props;

    this._index = this.props.index;
    this._prevInd = this._index;
    this._offsetX = slideWidth * this._index;
    this._pageX = slideWidth;
    this._diraction = 1;
    this._isScrolling = false;
    this._onScrollToCb = null;
  },

  scrollTo(index, callback, animated) {
    if (_.isBoolean(callback)) {
      animated = callback;
      callback = null;
    }

    if (this._isScrolling) return;

    if (this._index === index ||
        this.getSize() <= 1) {
      if (callback) {
        callback();
      }
      return;
    }

    this._onScrollToCb = callback;
    this._isScrolling = true;
    index = Math.min(index, this.getSize() - 1);
    let offsetX = index * this.getWidth();
    this.refs.scrollView.scrollTo({
      x: offsetX,
      y: 0,
      animated: animated !== false
    });

    if (animated === false) {
      this._endScrolling(offsetX);
    }
  },

  getSize() {
    return this.props.slides.length;
  },

  getWidth() {
    return this.props.slideWidth;
  },

  getIndex() {
    return this._index;
  },

  isEnabled() {
    return this.getSize() >= 2 &&
      this.state.scrollEnabled;
  },

  setEnabled(enabled, callback) {
    this.setState({
      scrollEnabled: enabled
    }, callback);
  },

  _onTouchStart(event) {
    this._pageX = event.nativeEvent.pageX;
  },

  _onTouchEnd(e) {
  },

  _onTouchMove(event) {
    if (!this.isEnabled()) return;

    let dx = this._pageX - event.nativeEvent.pageX;
    this._pageX = event.nativeEvent.pageX;

    let size = this.getSize();
    if (this._index === 0 && dx <= 0) return;
    if (this._index === size - 1 && dx >= 0) return;

    if (this.props.onTouchMove) {
      this.props.onTouchMove(dx);
    }
  },

  _onScrollEnd(event) {
    let offsetX = event.nativeEvent.contentOffset.x;
    this._endScrolling(offsetX);
  },

  _endScrolling(offsetX) {
    this._isScrolling = false;
    this._updateSlideIndex(offsetX);

    if (this._prevInd === this._index) {
      if (this.props.onSlideNoChange) {
        this.props.onSlideNoChange(this._diraction);
      }
    }

    if (this._prevInd !== this._index) {
      if (this.props.onSlideChange) {
        this.props.onSlideChange(this._index, this._prevInd,
          this._diraction);
      }
      this._prevInd = this._index;
    }

    if (this._onScrollToCb) {
      this._onScrollToCb();
      this._onScrollToCb = null;
    }
  },

  _onScrollBegin(event) {
    this._isScrolling = true;

    let offsetX = event.nativeEvent.contentOffset.x;
    let diff = offsetX - this._offsetX;
    this._diraction = diff > 0 ? 1 : -1;

    if (this.props.onScrollBegin) {
      this.props.onScrollBegin(event, this.state, this);
    }
  },

  _updateSlideIndex(offsetX) {
    let diff = offsetX - this._offsetX;

    if (!diff) return;

    let slideWidth = this.getWidth();
    this._index = this._index + (diff / slideWidth);
    this._offsetX = slideWidth * this._index;
  },

  render() {
    let state = this.state;
    let props = this.props;
    let slides = props.slides;

    return (
      <ScrollView ref='scrollView'
        {...props}
        onScroll={this._onScroll}
        keyboardShouldPersistTaps={true}
        scrollEnabled={this.isEnabled()}
        pagingEnabled={this.props.pagingEnabled}
        contentContainerStyle={this.props.contentStyle}
        contentOffset={{x: this._offsetX}}
        onTouchStart={this._onTouchStart}
        onTouchEnd={this._onTouchEnd}
        onTouchMove={this._onTouchMove}
        onMomentumScrollBegin={this._onScrollBegin}
        onMomentumScrollEnd={this._onScrollEnd}>
        {slides}
      </ScrollView>
    );
  }
});

module.exports = BaseScroll;

