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
    children: React.PropTypes.node.isRequired,
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
      index: 0
    }
  },

  /**
   * Init states
   * @return {object} states
   */
  getInitialState() {
    let {
      children,
      index
    } = this.props;

    this.isScrolling = false;

    let state = {};
    state.total = children ? children.length : 0;
    state.index = index ? Math.min(index,
      Math.max(state.total - 1, 0)) : 0;

    state.inc = 1;
    state.width = this.props.width || width;
    state.height = this.props.height || height;
    state.offset = state.width * state.index;

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
    let diff = offset - this.state.offset.x;
    
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
    let diff = offset - state.offset;
    let step = state.width;

    if (!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    index = index + diff / step;

    this.setState({
      index: index,
      offset: offset
    });
  },

  /**
   * Scroll by index
   * @param  {number} index offset index
   */
  scrollTo(index) {
    if (this.isScrolling) return;

    let state = this.state;
    let diff = index + this.state.index;
    let x = diff * state.width;
    this.refs.scrollView.scrollTo(0, x);

    this.isScrolling = true;
  },

  _renderPagination(size) {
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
    let radius = 7, margin = 5;
    if (size >= 18) {
      let ratio = 18 / size;
      radius = (7 * ratio) << 0;
      margin = (5 * ratio) << 0;
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
    let children = props.children;

    let pageStyle = [{width: state.width}, styles.slide];
    let pages = Object.keys(children).map((page, i) =>
      <View style={pageStyle} key={i}>
        {children[page]}
      </View>
    );

    return (
      <View style={[styles.container, {width: state.width}]}>
        <ScrollView ref='scrollView'
          {...props}
          contentContainerStyle={[styles.wrapper, props.style]}
          //contentOffset={this.state.offset}
          onTouchMove={this._onTouchMove}
          onMomentumScrollBegin={this._onScrollBegin}
          onMomentumScrollEnd={this._onScrollEnd}>
          {pages}
        </ScrollView>
        {this._renderPagination(pages.length)}
      </View>
    );
  }
});

module.exports = Swiper;
