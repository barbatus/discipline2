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

const { width, height } = Dimensions.get('window');

const stylesDef = {
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
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
  title: {
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    paddingLeft: 10,
    bottom: -30,
    left: 0,
    flexWrap: 'nowrap',
    width: 250,
    backgroundColor: 'transparent',
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
    showsVerticalScrollIndicator: React.PropTypes.bool,
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
      showsVerticalScrollIndicator: false,
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

  /**
   * Init states
   * @return {object} states
   */
  getInitialState() {
    let {
      slides,
      index
    } = this.props;

    this._isScrolling = false;
    this._isMoving = false;

    let state = {};
    this._index = slides.length ?
      Math.min(index, slides.length - 1) : 0;

    state.width = this.props.width || width;
    state.height = this.props.height || height;

    this._offsetX = state.width * this._index;
    this._pageX = state.width;
    this._prevInd = this._index;
    this._dir = 1;

    return state;
  },

  _onTouchStart(e) {
    this._isMoving = true;
    this._pageX = e.nativeEvent.pageX;
  },

  _onTouchEnd(e) {
    this._isMoving = false;
  },

  _onTouchMove(e) {
    let dx = this._pageX - e.nativeEvent.pageX;
    this._pageX = e.nativeEvent.pageX;

    let size = this.getSize();
    if (this._index === 0 && dx <= 0) return;
    if (this._index === size - 1 && dx >= 0) return;

    if (this.props.onTouchMove) {
      this.props.onTouchMove(dx);
    }
  },

  _onScrollEnd(e) {
    this._isScrolling = false;

    this._updateIndex(e.nativeEvent.contentOffset.x);

    if (this._prevInd !== this._index) {
      this._setActiveDot(this._index, this._prevInd);

      this._prevInd = this._index;
      this.props.onSlideChange &&
        this.props.onSlideChange(this._index, this._dir);
    } else {
      this.props.onSlideNoChange &&
        this.props.onSlideNoChange(this._dir);
    }
  },

  _onScrollBegin(e) {
    this._isScrolling = true;

    let offsetX = e.nativeEvent.contentOffset.x;
    let diff = offsetX - this._offsetX;
    this._dir = diff > 0 ? 1 : -1;

    this.props.onSlideBegin &&
      this.props.onSlideBegin(e, this.state, this);
  },

  _updateIndex(offsetX) {
    let state = this.state;
    let diff = offsetX - this._offsetX;
    let step = state.width;

    if (!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    this._index = this._index + diff / step;

    this._offsetX = this.state.width * this._index;
  },

  scrollTo(offsetInd) {
    if (this._isScrolling || this.getSize() <= 1) return;

    let state = this.state;
    let next = offsetInd + this._index; 
    let size = this.getSize();
    let offsetX = Math.min(next, size - 1) * state.width;
    this.refs.scrollView.scrollTo(0, offsetX);

    this._isScrolling = true;
  },

  getSize() {
    return this.props.slides.length;
  },

  getIndex() {
    return this._index;
  },

  getNextIndex() {
    return this.props.slides.length ? this._index + 1 : 0;
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

  render() {
    let state = this.state;
    let props = this.props;
    let slides = props.slides;

    let style = [{width: state.width}, styles.slide];
    slides = slides.map((slide, i) =>
      <View style={style} key={i}>
        {slide}
      </View>
    );

    let dots = this.props.scrollEnabled ?
      this._renderDots(slides.length) : null;

    return (
      <View style={[styles.container, {width: state.width}]}>
        <ScrollView ref='scrollView'
          {...props}
          scrollEnabled={this.props.scrollEnabled}
          contentContainerStyle={[styles.wrapper, props.style]}
          contentOffset={{x: 0}}
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
