import React, { PureComponent } from 'react';
import { ScrollView, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import isBoolean from 'lodash/isBoolean';

import { caller } from 'app/utils/lang';

export default class BaseScroll extends PureComponent {
  static propTypes = {
    index: PropTypes.number,
    slideWidth: PropTypes.number.isRequired,
    slides: PropTypes.array.isRequired,
    pagingEnabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    bounces: PropTypes.bool,
    contentStyle: ViewPropTypes.style,
    removeClippedSubviews: PropTypes.bool,
    automaticallyAdjustContentInsets: PropTypes.bool,
    keyboardDismissMode: PropTypes.string,
    onSlideNoChange: PropTypes.func,
    onSlideChange: PropTypes.func,
    onTouchMove: PropTypes.func,
    onScrollBeginDrag: PropTypes.func,
    onScrollEndDrag: PropTypes.func,
    onScrollBegin: PropTypes.func,
  };

  static defaultProps = {
    index: 0,
    pagingEnabled: true,
    scrollEnabled: true,
    bounces: true,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    keyboardDismissMode: 'on-drag',
    onSlideNoChange: null,
    onSlideChange: null,
    onTouchMove: null,
    onScrollBeginDrag: null,
    onScrollEndDrag: null,
    contentStyle: null,
    onScrollBegin: null,
  };

  indexInn = 0;
  prevInd = 0;
  offsetX = 0;
  pageX = 0;
  onScrollToCb = null;

  constructor(props) {
    super(props);

    const { slideWidth, index } = this.props;
    this.prevInd = index;
    this.offsetX = slideWidth * index;
    this.pageX = slideWidth;
    this.onTouchStart = ::this.onTouchStart;
    this.onTouchMove = ::this.onTouchMove;
    this.onScrollBegin = ::this.onScrollBegin;
    this.onScrollEnd = ::this.onScrollEnd;
  }

  get index() {
    return Math.round(this.indexInn);
  }

  onTouchStart(event) {
    this.pageX = event.nativeEvent.pageX;
  }

  onTouchMove(event) {
    const { slides, slideWidth, scrollEnabled } = this.props;

    if (!scrollEnabled || slides.length <= 1) return;

    const dx = this.pageX - event.nativeEvent.pageX;
    this.pageX = event.nativeEvent.pageX;

    if (this.indexInn === 0 && dx <= 0) return;
    if (this.indexInn === slides.length - 1 && dx >= 0) return;

    // Adjust offset and index after moving.
    // Offset and index become float.
    this.offsetX += dx;
    const index = this.indexInn + (dx / slideWidth);
    this.indexInn = Math.min(Math.max(index, 0), slides.length - 1);

    caller(this.props.onTouchMove, dx);
  }

  onScrollEnd(event) {
    const { x } = event.nativeEvent.contentOffset;
    this.endScrolling(x, true);
  }

  onScrollBegin(event) {
    caller(this.props.onScrollBegin, event);
  }

  /* eslint-disable no-param-reassign */
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
      caller(callback, false);
      return;
    }

    const newIndex = Math.min(index, slides.length - 1);
    if (this.indexInn === newIndex) {
      caller(callback, false);
      return;
    }

    const offsetX = Math.max(newIndex * slideWidth, 0);
    this.onScrollToCb = callback;
    this.scrollView.scrollTo({
      x: offsetX,
      y: 0,
      animated: animated !== false,
    });

    if (animated === false) {
      this.endScrolling(offsetX, false);
    }
  }
  /* eslint-enable no-param-reassign */

  endScrolling(offsetX: number, animated: boolean) {
    this.updateSlideIndexByOffset(offsetX);

    if (this.prevInd === this.indexInn) {
      caller(this.props.onSlideNoChange);
    } else {
      caller(this.props.onSlideChange, this.indexInn, this.prevInd, animated);
      this.prevInd = this.indexInn;
    }

    caller(this.onScrollToCb, true);
    this.onScrollToCb = null;
  }

  // Used to update offset and current slide index
  // after scrolling. Offset and index are supposed to
  // be integer since slide width is an integer
  // and scrolling happens for an exact number of slides.
  updateSlideIndexByOffset(offsetX: number) {
    const { slideWidth } = this.props;

    const diff = offsetX - this.offsetX;
    // Sometimes it's not round integer.
    this.indexInn = Math.round(this.indexInn + (diff / slideWidth));
    this.offsetX = slideWidth * this.indexInn;
  }

  render() {
    const {
      slides,
      index,
      slideWidth,
      pagingEnabled,
      contentStyle,
      scrollEnabled,
      removeClippedSubviews,
      bounces,
      onScrollBeginDrag,
      onScrollEndDrag,
    } = this.props;
    return (
      <ScrollView
        {...this.props}
        ref={(el) => (this.scrollView = el)}
        bounces={bounces}
        contentOffset={{ x: index * slideWidth, y: 0 }}
        keyboardShouldPersistTaps="always"
        automaticallyAdjustContentInsets={false}
        scrollEnabled={scrollEnabled}
        pagingEnabled={pagingEnabled}
        contentContainerStyle={contentStyle}
        onTouchMove={this.onTouchMove}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={this.onScrollBegin}
        onMomentumScrollEnd={this.onScrollEnd}
        scrollEventThrottle={30}
        removeClippedSubviews={removeClippedSubviews}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {slides}
      </ScrollView>
    );
  }
}
