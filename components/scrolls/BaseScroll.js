'use strict';

import React, { Component } from 'react';

import { StyleSheet, Text, View, ScrollView, Animated } from 'react-native';

import { isBoolean } from 'lodash';

import { commonStyles, screenWidth } from '../styles/common';

import { caller } from '../../utils/lang';

class BaseScroll extends Component {
  _index = 0;

  _prevInd = 0;

  _offsetX = 0;

  _pageX = 0;

  _isScrolling = false;

  _onScrollToCb = null;

  constructor(props) {
    super(props);

    const { slideWidth } = this.props;
    this._index = 0;
    this._prevInd = this._index;
    this._offsetX = slideWidth * this._index;
    this._pageX = slideWidth;
  }

  static propTypes = {
    slideWidth: React.PropTypes.number.isRequired,
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
  };

  static defaultProps = {
    slides: [],
    horizontal: true,
    pagingEnabled: true,
    scrollEnabled: true,
    showsHorizontalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    keyboardDismissMode: 'on-drag',
  };

  // This is not reliable since it might be
  // incorrect if slides list has changed
  get index() {
    return this._index;
  }

  shouldComponentUpdate(props, state) {
    return this.props.slides !== props.slides ||
      this.props.scrollEnabled !== props.scrollEnabled;
  }

  scrollTo(index: number, callback?: Function | boolean, animated?: boolean) {
    const { slides, slideWidth } = this.props;

    if (isBoolean(callback)) {
      animated = callback;
      callback = null;
    }

    if (slides.length <= 1) {
      return caller(callback, false);
    }

    if (this._isScrolling) return;

    index = Math.min(index, slides.length - 1);
    if (this._index === index) {
      return caller(callback, false);
    }

    const offsetX = Math.max(index * slideWidth, 0);
    this._onScrollToCb = callback;
    this._isScrolling = true;
    this.refs.scrollView.scrollTo({
      x: offsetX,
      y: 0,
      animated: animated !== false,
    });

    if (animated === false) {
      this._endScrolling(offsetX);
    }
  }

  _onTouchStart(event) {
    this._pageX = event.nativeEvent.pageX;
  }

  _onTouchEnd(e) {}

  _onTouchMove(event) {
    const { slides, slideWidth, scrollEnabled } = this.props;
    const length = slides.length;

    if (!scrollEnabled || length <= 1) return;

    const dx = this._pageX - event.nativeEvent.pageX;
    this._pageX = event.nativeEvent.pageX;

    if (this._index === 0 && dx <= 0) return;
    if (this._index === length - 1 && dx >= 0) return;

    // Adjust offset and index after moving.
    // Offset and index become float.
    this._offsetX += dx;
    const index = this._index + dx / slideWidth;
    this._index = Math.min(Math.max(index, 0), length - 1);

    caller(this.props.onTouchMove, dx);
  }

  _onScrollEnd(event) {
    const { x } = event.nativeEvent.contentOffset;
    this._endScrolling(x);
  }

  _endScrolling(offsetX: number) {
    this._isScrolling = false;
    this._updateSlideIndexByOffset(offsetX);

    if (this._prevInd === this._index) {
      caller(this.props.onSlideNoChange);
    }

    if (this._prevInd !== this._index) {
      caller(this.props.onSlideChange, this._index, this._prevInd);
      this._prevInd = this._index;
    }

    caller(this._onScrollToCb, true);
    this._onScrollToCb = null;
  }

  _onScrollBegin(event) {
    this._isScrolling = true;

    caller(this.props.onScrollBegin, event);
  }

  // Used to update offset and current slide index
  // after scrolling. Offset and index are supposed to
  // be integer since slide width is an integer
  // and scrolling happens for an exact number of slides.
  _updateSlideIndexByOffset(offsetX: number) {
    const { slideWidth } = this.props;

    const diff = offsetX - this._offsetX;
    // Sometimes it's not round integer.
    this._index = Math.round(this._index + diff / slideWidth) >> 0;
    this._offsetX = slideWidth * this._index;
  }

  render() {
    const {
      slides,
      pagingEnabled,
      contentStyle,
      scrollEnabled,
    } = this.props;

    return (
      <ScrollView
        ref="scrollView"
        {...this.props}
        keyboardShouldPersistTaps="always"
        scrollEnabled={scrollEnabled}
        pagingEnabled={pagingEnabled}
        contentContainerStyle={contentStyle}
        onTouchStart={::this._onTouchStart}
        onTouchEnd={::this._onTouchEnd}
        onTouchMove={::this._onTouchMove}
        onMomentumScrollBegin={::this._onScrollBegin}
        onMomentumScrollEnd={::this._onScrollEnd}
      >
        {slides}
      </ScrollView>
    );
  }
}

export default BaseScroll;
