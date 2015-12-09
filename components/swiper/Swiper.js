'use strict'

const React = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} = require('react-native');

const TimerMixin = require('react-timer-mixin');
const Dimensions = require('Dimensions');

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
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
  pagination_x: {
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
  pagination_y: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
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
});

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
    index: React.PropTypes.number
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
      index: 0,
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

    this.isScrolling = false;

    let state = {};
    state.index = slides.length ?
      Math.min(index, slides.length - 1) : 0;

    state.inc = 1;
    state.width = this.props.width || width;
    state.height = this.props.height || height;

    this._offsetX = state.width * state.index;

    return state;
  },

  _onTouchMove(e) {

  },

  _onScrollEnd(e) {
    this.isScrolling = false;

    this.updateIndex(e.nativeEvent.contentOffset.x);

    // Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
    // in setTimeout to ensure synchronous update `index`
    this.setTimeout(() => {
      this.props.onSlideChange &&
        this.props.onSlideChange(e, this.state.index);
    });
  },

  _onScrollBegin(e) {
    this.isScrolling = true;

    let offset = e.nativeEvent.contentOffset;
    let diff = offset - this._offsetX;
    
    this.setState({
      inc: diff > 0 ? 1 : -1
    });

    this.setTimeout(() => {
      this.props.onSlideBegin &&
        this.props.onSlideBegin(e, this.state, this);
    });
  },

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   */
  updateIndex(offset) {
    let state = this.state;
    let index = state.index;
    let diff = offset - this._offsetX;
    let step = state.width;

    if (!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    index = index + diff / step;

    this._offsetX = this.state.width * index;

    this.setState({
      index: index
    });
  },

  scrollTo(offset) {
    if (this.isScrolling ||
        this.props.slides.length <= 1) return;

    let state = this.state;
    let next = offset + this.state.index; 
    let size = this.props.slides.length; 
    let x = Math.min(next, size - 1) * state.width;
    this.refs.scrollView.scrollTo(0, x);

    this.isScrolling = true;
  },

  getIndex() {
    return this.state.index;
  },

  getNextIndex() {
    return this.props.slides.length ? 
      this.state.index + 1 : 0;
  },

  _renderPagination(size, index) {
    if (size <= 1) return null;

    let dots = [];
    let basicDot = [styles.basicDot, this._scaleDot(size)];
    for(let i = 0; i < size; i++) {
      let dotStyle = i === this.state.index ? 
        [basicDot, styles.activeDot] : basicDot;
      dots.push(<View key={i} style={dotStyle} />);
    }

    return (
      <View
        pointerEvents='none'
        style={styles.pagination_x}>
        {dots}
      </View>
    );
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

    return (
      <View style={[styles.container, {width: state.width}]}>
        <ScrollView ref='scrollView'
          {...props}
          pagingEnabled={true}
          scrollEnabled={this.props.scrollEnabled}
          contentContainerStyle={[styles.wrapper, props.style]}
          contentOffset={{x: this._offsetX}}
          onTouchMove={this._onTouchMove}
          onMomentumScrollBegin={this._onScrollBegin}
          onMomentumScrollEnd={this._onScrollEnd}>
          {slides}
        </ScrollView>
        {this._renderPagination(slides.length)}
      </View>
    );
  }
});

module.exports = Swiper;
