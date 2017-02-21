'use strict';

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
} from 'react-native';

import {commonStyles, screenWidth} from '../styles/common';

import {caller} from '../../utils/lang';

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
    keyboardDismissMode: React.PropTypes.string,
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

  shouldComponentUpdate(props, state) {
    return this.props.slides !== props.slides ||
           this.props.scrollEnabled !== props.scrollEnabled;
  },

  componentWillMount() {
    const { slideWidth, index } = this.props;

    this._index = index;
    this._prevInd = this._index;
    this._offsetX = slideWidth * this._index;
    this._pageX = slideWidth;
    this._isScrolling = false;
    this._onScrollToCb = null;
  },

  scrollTo(index, callback, animated) {
    if (_.isBoolean(callback)) {
      animated = callback;
      callback = null;
    }

    if (this.getSize() <= 1) {
      caller(callback, false);
      return;
    }

    if (this._isScrolling) return;

    index = Math.min(index, this.getSize() - 1);
    const offsetX = Math.max(index * this.getWidth(), 0);

    if (this._offsetX === offsetX) {
      caller(callback, false);
      return;
    }

    this._onScrollToCb = callback;
    this._isScrolling = true;
    this.refs.scrollView.scrollTo({
      x: offsetX, y: 0,
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

  // This is not reliable since it might be
  // incorrect if slides list has changed
  getIndex() {
    return this._index;
  },

  isEnabled() {
    return this.props.scrollEnabled;
  },

  _onTouchStart(event) {
    this._pageX = event.nativeEvent.pageX;
  },

  _onTouchEnd(e) {},

  _onTouchMove(event) {
    if (!this.isEnabled()) return;

    if (this.getSize() <= 1) return;

    const dx = this._pageX - event.nativeEvent.pageX;
    this._pageX = event.nativeEvent.pageX;

    const size = this.getSize();
    if (this._index === 0 && dx <= 0) return;
    if (this._index === size - 1 && dx >= 0) return;

    // Adjust offset and index after moving.
    // Offset and index become float.
    this._offsetX += dx;
    const slideWidth = this.getWidth();
    const index = this._index + (dx / slideWidth);
    this._index = Math.min(Math.max(index, 0), size - 1);

    caller(this.props.onTouchMove, dx);
  },

  _onScrollEnd(event) {
    const { x } = event.nativeEvent.contentOffset;
    this._endScrolling(x);
  },

  _endScrolling(offsetX) {
    this._isScrolling = false;
    this._updateSlideIndexByOffset(offsetX);

    if (this._prevInd === this._index) {
      caller(this.props.onSlideNoChange);
    }

    if (this._prevInd !== this._index) {
      caller(this.props.onSlideChange,
        this._index, this._prevInd);
      this._prevInd = this._index;
    }

    caller(this._onScrollToCb, true);
    this._onScrollToCb = null;
  },

  _onScrollBegin(event) {
    this._isScrolling = true;

    caller(this.props.onScrollBegin, event);
  },

  // Used to update offset and current slide index
  // after scrolling. Offset and index are supposed to
  // be integer since slide width is an integer
  // and scrolling happens for an exact number of slides. 
  _updateSlideIndexByOffset(offsetX) {
    const diff = offsetX - this._offsetX;

    if (!diff) return;

    const slideWidth = this.getWidth();
    // Sometimes it's not round integer. 
    this._index = Math.round(this._index + (diff / slideWidth)) >> 0;
    this._offsetX = slideWidth * this._index;
  },

  render() {
    const { slides, pagingEnabled,
            contentStyle, scrollEnabled } = this.props;
    return (
      <ScrollView ref='scrollView'
        {...this.props}
        onScroll={this._onScroll}
        keyboardShouldPersistTaps='always'
        scrollEnabled={scrollEnabled}
        pagingEnabled={pagingEnabled}
        contentContainerStyle={contentStyle}
        contentOffset={{x: this._offsetX}}
        onTouchStart={this._onTouchStart}
        onTouchEnd={this._onTouchEnd}
        onTouchMove={this._onTouchMove}
        onMomentumScrollBegin={this._onScrollBegin}
        onMomentumScrollEnd={this._onScrollEnd}>
        { slides }
      </ScrollView>
    );
  }
});

export default BaseScroll;
