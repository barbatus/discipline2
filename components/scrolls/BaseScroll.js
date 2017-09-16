import React, { PureComponent } from 'react';

import { View, ScrollView } from 'react-native';

import isBoolean from 'lodash/isBoolean';

import { caller } from '../../utils/lang';

export default class BaseScroll extends PureComponent {
  index = 0;

  prevInd = 0;

  offsetX = 0;

  pageX = 0;

  isScrolling = false;

  onScrollToCb = null;

  constructor(props) {
    super(props);

    const { slideWidth } = this.props;
    this.prevInd = this.index;
    this.offsetX = slideWidth * this.index;
    this.pageX = slideWidth;
    this.onTouchStart = ::this.onTouchStart;
    this.onTouchEnd = ::this.onTouchEnd;
    this.onTouchMove = ::this.onTouchMove;
    this.onScrollBegin = ::this.onScrollBegin;
    this.onScrollEnd = ::this.onScrollEnd;
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
    keyboardDismissMode: 'on-drag',
  };

  scrollTo(
    index: number,
    callback?: Function | boolean,
    animated?: boolean,
  ) {
    const { slides, slideWidth } = this.props;

    if (isBoolean(callback)) {
      animated = callback;
      callback = null;
    }

    if (slides.length <= 1) {
      return caller(callback, false);
    }

    if (this.isScrolling) return;

    index = Math.min(index, slides.length - 1);
    if (this.index === index) {
      return caller(callback, false);
    }

    const offsetX = Math.max(index * slideWidth, 0);
    this.onScrollToCb = callback;
    this.isScrolling = true;
    this.scrollView.scrollTo({
      x: offsetX,
      y: 0,
      animated: animated !== false,
    });

    if (animated === false) {
      this.endScrolling(offsetX, false);
    }
  }

  onTouchStart(event) {
    this.pageX = event.nativeEvent.pageX;
  }

  onTouchEnd(e) {}

  onTouchMove(event) {
    const { slides, slideWidth, scrollEnabled } = this.props;
    const length = slides.length;

    if (!scrollEnabled || length <= 1) return;

    const dx = this.pageX - event.nativeEvent.pageX;
    this.pageX = event.nativeEvent.pageX;

    if (this.index === 0 && dx <= 0) return;
    if (this.index === length - 1 && dx >= 0) return;

    // Adjust offset and index after moving.
    // Offset and index become float.
    this.offsetX += dx;
    const index = this.index + dx / slideWidth;
    this.index = Math.min(Math.max(index, 0), length - 1);

    caller(this.props.onTouchMove, dx);
  }

  onScrollEnd(event) {
    const { x } = event.nativeEvent.contentOffset;
    this.endScrolling(x, true);
  }

  endScrolling(offsetX: number, animated: boolean) {
    this.isScrolling = false;
    this.updateSlideIndexByOffset(offsetX);

    if (this.prevInd === this.index) {
      caller(this.props.onSlideNoChange);
    }

    if (this.prevInd !== this.index) {
      caller(this.props.onSlideChange, this.index, this.prevInd, animated);
      this.prevInd = this.index;
    }

    caller(this.onScrollToCb, true);
    this.onScrollToCb = null;
  }

  onScrollBegin(event) {
    this.isScrolling = true;

    caller(this.props.onScrollBegin, event);
  }

  // Used to update offset and current slide index
  // after scrolling. Offset and index are supposed to
  // be integer since slide width is an integer
  // and scrolling happens for an exact number of slides.
  updateSlideIndexByOffset(offsetX: number) {
    const { slideWidth } = this.props;

    const diff = offsetX - this.offsetX;
    // Sometimes it's not round integer.
    this.index = Math.round(this.index + diff / slideWidth) >> 0;
    this.offsetX = slideWidth * this.index;
  }

  render() {
    const {
      slides,
      index,
      slideWidth,
      pagingEnabled,
      contentStyle,
      scrollEnabled,
    } = this.props;
    return (
      <ScrollView
        ref={(el) => (this.scrollView = el)}
        {...this.props}
        contentOffset={{ x: index * slideWidth, y: 0 }}
        keyboardShouldPersistTaps="always"
        automaticallyAdjustContentInsets={false}
        scrollEnabled={scrollEnabled}
        pagingEnabled={pagingEnabled}
        contentContainerStyle={contentStyle}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.onTouchMove}
        onMomentumScrollBegin={this.onScrollBegin}
        onMomentumScrollEnd={this.onScrollEnd}
        scrollEventThrottle={30}
      >
        {slides}
      </ScrollView>
    );
  }
}
