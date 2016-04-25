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

const BaseScroll = require('./BaseScroll');

const Scroll = React.createClass({
  propTypes: {
    slides: React.PropTypes.array.isRequired,
    slideWidth: React.PropTypes.number.isRequired,
    scrollEnabled: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      slides: [],
      scrollEnabled: true
    }
  },

  getSize() {
    return this.props.slides.length;
  },

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  },

  _onSlide(index) {
    this.scrollTo(index, () => {
      console.log('onSlideClick');
      if (this.props.onSlideClick) {
        this.props.onSlideClick(index);
      }
    });
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

    let scrollStyle = [
      commonStyles.flexFilled,
      {
        paddingLeft: this.props.padding,
        paddingRight: this.props.padding
      }
    ];

    return (
      <BaseScroll
        ref='scroll'
        slides={slides}
        pagingEnabled={false}
        style={commonStyles.flexFilled}
        slideWidth={this.props.slideWidth}
        scrollEnabled={this.props.scrollEnabled}
        contentStyle={scrollStyle}>
      </BaseScroll>
    );
  }
});

module.exports = Scroll;
