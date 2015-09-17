'use strict'
/*
react-native-swiper

@author leecade<leecade@163.com>
 */
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} = require('react-native');

// Using bare setTimeout, setInterval, setImmediate
// and requestAnimationFrame calls is very dangerous
// because if you forget to cancel the request before
// the component is unmounted, you risk the callback
// throwing an exception.
var TimerMixin = require('react-timer-mixin');
var Dimensions = require('Dimensions');

let { width, height } = Dimensions.get('window');

/**
 * Default styles
 * @type {StyleSheetPropType}
 */
let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
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
    bottom: 25,
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
  }
})

var Swiper = React.createClass({

  /**
   * Props Validation
   * @type {Object}
   */
  propTypes: {
    horizontal                       : React.PropTypes.bool,
    children                         : React.PropTypes.node.isRequired,
    style                            : View.propTypes.style,
    pagingEnabled                    : React.PropTypes.bool,
    showsHorizontalScrollIndicator   : React.PropTypes.bool,
    showsVerticalScrollIndicator     : React.PropTypes.bool,
    bounces                          : React.PropTypes.bool,
    scrollsToTop                     : React.PropTypes.bool,
    removeClippedSubviews            : React.PropTypes.bool,
    automaticallyAdjustContentInsets : React.PropTypes.bool,
    showsPagination                  : React.PropTypes.bool,
    showsButtons                     : React.PropTypes.bool,
    loop                             : React.PropTypes.bool,
    autoplay                         : React.PropTypes.bool,
    autoplayTimeout                  : React.PropTypes.number,
    autoplayDirection                : React.PropTypes.bool,
    index                            : React.PropTypes.number,
    renderPagination                 : React.PropTypes.func,
  },

  mixins: [TimerMixin],

  /**
   * Default props
   * @return {object} props
   * @see http://facebook.github.io/react-native/docs/scrollview.html
   */
  getDefaultProps() {
    return {
      horizontal                       : true,
      pagingEnabled                    : true,
      showsHorizontalScrollIndicator   : false,
      showsVerticalScrollIndicator     : false,
      bounces                          : false,
      scrollsToTop                     : false,
      removeClippedSubviews            : true,
      automaticallyAdjustContentInsets : false,
      showsPagination                  : true,
      showsButtons                     : false,
      loop                             : true,
      autoplay                         : false,
      autoplayTimeout                  : 2.5,
      autoplayDirection                : true,
      index                            : 0,
    }
  },

  /**
   * Init states
   * @return {object} states
   */
  getInitialState() {
    let props = this.props;

    let initState = {
      isScrolling: false,
      autoplayEnd: false,
    };

    initState.total = props.children
      ? (props.children.length || 1)
      : 0;

    initState.index = initState.total > 1
      ? Math.min(props.index, initState.total - 1)
      : 0;

    // Default: horizontal
    initState.dir = props.horizontal == false ? 'y' : 'x';
    initState.inc = 1;
    initState.width = props.width || width;
    initState.height = props.height || height;
    initState.offset = {};

    if(initState.total > 1) {
      let setup = props.loop ? 1 : initState.index;
      initState.offset[initState.dir] = initState.dir == 'y'
        ? initState.height * setup
        : initState.width * setup;
    }

    return initState;
  },

  /**
   * autoplay timer
   * @type {null}
   */
  autoplayTimer: null,

  componentWillMount() {
    this.props = this.injectState(this.props);
  },

  componentDidMount() {
    this.autoplay();
  },

  /**
   * Automatic rolling
   */
  autoplay() {
    if(!this.props.autoplay
      || this.state.isScrolling
      || this.state.autoplayEnd) return;

    clearTimeout(this.autoplayTimer);

    this.autoplayTimer = this.setTimeout(() => {
      if(!this.props.loop && (this.props.autoplayDirection
          ? this.state.index == this.state.total - 1
          : this.state.index == 0)) return this.setState({
        autoplayEnd: true
      });
      this.scrollTo(this.props.autoplayDirection ? 1 : -1)
    }, this.props.autoplayTimeout * 1000);
  },

  /**
   * Scroll begin handle
   * @param  {object} e native event
   */
  onScrollBegin(e) {
    // update scroll state
    this.setState({
      isScrolling: true
    });

    this.setTimeout(() => {
      this.props.onScrollBeginDrag &&
        this.props.onScrollBeginDrag(e, this.state, this);
    });
  },

  /**
   * Scroll end handle
   * @param  {object} e native event
   */
  onScrollEnd(e) {

    // update scroll state
    this.setState({
      isScrolling: false
    });

    this.updateIndex(e.nativeEvent.contentOffset, this.state.dir);

    // Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
    // in setTimeout to ensure synchronous update `index`
    this.setTimeout(() => {
      this.autoplay();

      // if `onMomentumScrollEnd` registered will be called here
      this.props.onMomentumScrollEnd &&
        this.props.onMomentumScrollEnd(e, this.state, this);
    }); 
  },

  onMomentumScrollBegin(e) {
    var dir = this.state.dir;
    var offset = e.nativeEvent.contentOffset;
    let diff = offset[dir] - this.state.offset[dir];
    
    this.setState({
      inc: diff > 0 ? 1 : -1
    });

    this.setTimeout(() => {
      this.props.onMomentumScrollBegin &&
        this.props.onMomentumScrollBegin(e, this.state, this);
    });
  },

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   * @param  {string} dir    'x' || 'y'
   */
  updateIndex(offset, dir) {

    let state = this.state;
    let index = state.index;
    let diff = offset[dir] - state.offset[dir];
    let step = dir == 'x' ? state.width : state.height;

    // Do nothing if offset no change.
    if(!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    index = index + diff / step;

    if(this.props.loop) {
      if(index <= -1) {
        index = state.total - 1;
        offset[dir] = step * state.total;
      }
      else if(index >= state.total) {
        index = 0;
        offset[dir] = step;
      }
    }

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
    if(this.state.isScrolling) return;
    let state = this.state;
    let diff = (this.props.loop ? 1 : 0) + index + this.state.index;
    let x = 0;
    let y = 0;
    if(state.dir == 'x') x = diff * state.width;
    if(state.dir == 'y') y = diff * state.height;
    this.refs.scrollView && this.refs.scrollView.scrollTo(y, x);

    // update scroll state
    this.setState({
      isScrolling: true,
      autoplayEnd: false,
    });
  },

  /**
   * Render pagination
   * @return {object} react-dom
   */
  renderPagination() {

    // By default, dots only show when `total` > 2
    if(this.state.total <= 1) return null;

    let dots = [];
    for(let i = 0; i < this.state.total; i++) {
      dots.push(i === this.state.index
        ? (this.props.activeDot || <View style={{
            backgroundColor: '#007aff',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          }} />)
        : (this.props.dot || <View style={{
            backgroundColor:'rgba(0,0,0,.2)',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          }} />)
      )
    }

    return (
      <View pointerEvents='none' style={[styles['pagination_' + this.state.dir],
        this.props.paginationStyle]}>
        {dots}
      </View>
    );
  },

  renderTitle() {
    let child = this.props.children[this.state.index]
    let title = child && child.props.title
    return title
      ? (
        <View style={styles.title}>
          {this.props.children[this.state.index].props.title}
        </View>
      )
      : null;
  },

  /**
   * Inject state to ScrollResponder
   * @param  {object} props origin props
   * @return {object} props injected props
   */
  injectState(props) {
    for(let prop in props) {
      // if(~scrollResponders.indexOf(prop)
      if(typeof props[prop] === 'function'
        && prop !== 'onMomentumScrollEnd'
        && prop !== 'renderPagination'
        && prop !== 'onScrollBeginDrag'
        && prop !== 'onMomentumScrollBegin'
      ) {
        let originResponder = props[prop];
        props[prop] = (e) => originResponder(e, this.state, this);
      }
    }
    return props;
  },

  /**
   * Default render
   * @return {object} react-dom
   */
  render() {
    let state = this.state;
    let props = this.props;
    let children = props.children;
    let index = state.index;
    let total = state.total;
    let loop = props.loop;
    let dir = state.dir;
    let key = 0;

    let pages = [];
    let pageStyle = [{width: state.width}, styles.slide];

    // For make infinite at least total > 1
    if(total > 1) {

      // Re-design a loop model for avoid img flickering
      pages = Object.keys(children);
      if(loop) {
        pages.unshift(total - 1);
        pages.push(0);
      }

      pages = pages.map((page, i) =>
        <View style={pageStyle} key={i}>{children[page]}</View>
      );
    }
    else pages = <View style={pageStyle}>{children}</View>;

    return (
      <View style={[styles.container, {
        width: state.width
      }]}>
        <ScrollView ref="scrollView"
          {...props}
          contentContainerStyle={[styles.wrapper, props.style]}
          contentOffset={state.offset}
          onScrollBeginDrag={this.onScrollBegin}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onScrollEnd}>
          {pages}
        </ScrollView>
        {props.showsPagination && (props.renderPagination
          ? this.props.renderPagination(state.index, state.total, this)
          : this.renderPagination())}
        {this.renderTitle()}
        {this.props.showsButtons && this.renderButtons()}
      </View>
    );
  }
});

module.exports = Swiper;
