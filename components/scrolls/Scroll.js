'use strict'

const React = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated
} = require('react-native');

const { commonStyles } = require('../styles/common');

const Scroll = React.createClass({
  propTypes: {
    slides: React.PropTypes.node.isRequired,
    horizontal: React.PropTypes.bool,
    style: View.propTypes.style,
    pagingEnabled: React.PropTypes.bool,
    showsHorizontalScrollIndicator: React.PropTypes.bool,
    bounces: React.PropTypes.bool,
    scrollsToTop: React.PropTypes.bool,
    removeClippedSubviews: React.PropTypes.bool,
    automaticallyAdjustContentInsets: React.PropTypes.bool,
    keyboardDismissMode: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      slides: [],
      horizontal: true,
      pagingEnabled: false,
      showsHorizontalScrollIndicator: false,
      bounces: false,
      scrollsToTop: false,
      removeClippedSubviews: true,
      automaticallyAdjustContentInsets: false,
      keyboardDismissMode: 'on-drag'
    }
  },

  getInitialState() {
    this._onScrollToCb = null;
    this._isScrolling = false;

    return {};
  },

  getSize() {
    return this.props.slides.length;
  },

  scrollTo(index, callback, animated) {
    let { slideWidth } = this.props;

    let size = this.getSize();
    if (this._isScrolling || size <= 1) return;

    this._onScrollToCb = callback;
    this._isScrolling = true;
    let offsetX = Math.min(index, size - 1) * slideWidth;
    this.refs.scrollView.scrollTo({
      x: offsetX,
      y: 0,
      animated: animated !== false
    });

    if (animated === false) {
      this._endScrolling();
    }
  },

  _onScrollEnd(event) {
    this._endScrolling();
  },

  _endScrolling() {
    this._isScrolling = false;

    if (this._onScrollToCb) {
      this._onScrollToCb();
      this._onScrollToCb = null;
    }
  },

  _onSlide(index) {
    let { slideWidth} = this.props;

    let offset = slideWidth * index;
    this.refs.scrollView.scrollTo({x: offset});

    if (this.props.onSlideClick) {
      this.props.onSlideClick(index);
    }
  },

  render() {
    let { slides, slideWidth, index } = this.props;

    let slideStyle = { width: slideWidth };
    slides = slides.map((slide, i) =>
      <View style={slideStyle} key={i}>
        <TouchableOpacity
          style={commonStyles.flexFilled}
          onPress={this._onSlide.bind(this, i)}>
          {slide}
        </TouchableOpacity>
      </View>
    );

    let offset = slideWidth * index;
    let scrollStyle = [
      commonStyles.flexFilled,
      {
        paddingLeft: this.props.padding,
        paddingRight: this.props.padding
      }
    ];

    return (
      <View style={commonStyles.flexFilled}>
        <ScrollView ref='scrollView'
          horizontal={true}
          contentContainerStyle={scrollStyle}
          contentOffset={{x: offset}}
          onMomentumScrollEnd={this._onScrollEnd}>
          {slides}
        </ScrollView>
      </View>
    );
  }
});

module.exports = Scroll;
