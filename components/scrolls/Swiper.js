'use strict'

const React = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated
} = require('react-native');

const TimerMixin = require('react-timer-mixin');

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');
const screenWidth = window.width;

const { commonStyles } = require('../styles/common');

const stylesDef = {
  slide: {
    flex: 1,
    width: screenWidth
  },
  dots: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'transparent',
  },
  basicDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 3,
    marginBottom: 3,
    marginRight: 5
  },
  activeDot: {
    backgroundColor: 'rgb(255, 255, 255)'
  }
};

const styles = StyleSheet.create(stylesDef);

const Swiper = React.createClass({
  propTypes: {
    slides: React.PropTypes.node.isRequired,
    style: View.propTypes.style,
    pagingEnabled: React.PropTypes.bool,
    showsHorizontalScrollIndicator: React.PropTypes.bool,
    bounces: React.PropTypes.bool,
    scrollsToTop: React.PropTypes.bool,
    removeClippedSubviews: React.PropTypes.bool,
    automaticallyAdjustContentInsets: React.PropTypes.bool,
    showsPagination: React.PropTypes.bool,
    index: React.PropTypes.number,
    keyboardDismissMode: React.PropTypes.string
  },

  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      horizontal: true,
      pagingEnabled: true,
      showsHorizontalScrollIndicator: false,
      bounces: false,
      scrollsToTop: false,
      removeClippedSubviews: true,
      automaticallyAdjustContentInsets: false,
      showsPagination: true,
      scrollEnabled: true,
      index: 0,
      keyboardDismissMode: 'on-drag',
      slides: []
    }
  },

  getInitialState() {
    this._index = this.props.index;
    this._prevInd = this._index;
    this._offsetX = screenWidth * this._index;
    this._pageX = screenWidth;
    this._diraction = 1;
    this._isScrolling = false;
    this._onScrollToCb = null;

    return {
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1)
    }
  },

  scrollTo(index, callback, animated) {
    if (this._isScrolling || this.getSize() <= 1) return;

    this._onScrollToCb = callback;
    this._isScrolling = true;
    let size = this.getSize();
    let offsetX = Math.min(index, size - 1) * screenWidth;
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

  getIndex() {
    return this._index;
  },

  getNextIndex() {
    return this.getSize() ? this.getIndex() + 1 : 0;
  },

  getPrevIndex() {
    let index = this.getIndex();
    let diff = index > 0 ? -1 : 1;
    return index + diff;
  },

  _onTouchStart(event) {
    this._pageX = event.nativeEvent.pageX;
  },

  _onTouchEnd(e) {
  },

  _onTouchMove(event) {
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
      this._setActiveDot(this._index, this._prevInd);

      this._prevInd = this._index;
      if (this.props.onSlideChange) {
        this.props.onSlideChange(this._index, this._diraction);
      }    
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

    if (this.props.onSlideBegin) {
      this.props.onSlideBegin(event, this.state, this);
    }
  },

  _updateSlideIndex(offsetX) {
    let diff = offsetX - this._offsetX;

    if (!diff) return;

    this._index = this._index + (diff / screenWidth);
    this._offsetX = screenWidth * this._index;
  },

  _renderDots(size) {
    if (size <= 1) return null;

    let dots = [];
    let basicDot = [styles.basicDot, this._scaleDot(size)];
    for(let i = 0; i < size; i++) {
      let dotStyle = i === this._index ? 
        [basicDot, styles.activeDot] : basicDot;
      dots.push(<View ref={'page' + i} key={i} style={dotStyle} />);
    }

    let opacity = new Animated.Value(0);
    this.setTimeout(() => {
      Animated.timing(opacity, {
        duration: 500,
        toValue: 1
      }).start();
    });

    return (
      <Animated.View
        pointerEvents='none'
        style={[styles.dots, { opacity }]}>
        {dots}
      </Animated.View>
    );
  },

  _setActiveDot(curInd, prevInd) {
    if (this.refs['page' + prevInd]) {
      this.refs['page' + prevInd].setNativeProps({
        style: {
          backgroundColor: stylesDef.basicDot.backgroundColor
        }
      });
    }

    if (this.refs['page' + curInd]) {
      this.refs['page' + curInd].setNativeProps({
        style: {
          backgroundColor: stylesDef.activeDot.backgroundColor
        }
      });
    }
  },

  /**
   * Scales dot radius.
   * Basic radius 7px, with scaling
   * propor. to the number of slides.
   */
  _scaleDot(size) {
    let radius = 7, margin = 7;
    if (size >= 18) {
      let ratio = 18 / size;
      radius = (7 * ratio) << 0;
      margin = (7 * ratio) << 0;
    }

    return {
      width: radius,
      height: radius,
      borderRadius: radius / 2,
      marginRight: margin
    };
  },

  _renderSlide(slide, key) {
    return (
      <View style={styles.slide} key={key}>
        {slide}
      </View>
    )
  },

  render() {
    let state = this.state;
    let props = this.props;
    let slides = props.slides;

    slides = slides.map((slide, i) =>
      this._renderSlide(slide, i)
    );

    let dots = props.scrollEnabled ?
      this._renderDots(slides.length) : null;

    return (
      <View
        style={commonStyles.flexFilled}>
        <ScrollView ref='scrollView'
          {...props}
          onScroll={this._onScroll}
          keyboardShouldPersistTaps={true}
          scrollEnabled={props.scrollEnabled}
          contentContainerStyle={commonStyles.flexFilled}
          contentOffset={{x: this._offsetX}}
          onTouchStart={this._onTouchStart}
          onTouchEnd={this._onTouchEnd}
          onTouchMove={this._onTouchMove}
          onMomentumScrollBegin={this._onScrollBegin}
          onMomentumScrollEnd={this._onScrollEnd}>
          {slides}
        </ScrollView>
        {dots}
      </View>
    );
  }
});

module.exports = Swiper;
