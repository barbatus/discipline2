import React, { PureComponent } from 'react';

import { commonStyles as cs, screenWidth } from '../styles/common';

import BaseScroll from './BaseScroll';

class Scroll extends PureComponent {
  static propTypes = {
    slides: React.PropTypes.array.isRequired,
    slideWidth: React.PropTypes.number.isRequired,
    scrollEnabled: React.PropTypes.bool,
  };

  static defaultProps = {
    slides: [],
    scrollEnabled: true,
  };

  get index() {
    return this.scroll.index;
  }

  scrollTo(index, callback, animated) {
    this.scroll.scrollTo(index, callback, animated);
  }

  render() {
    const { centered, slideWidth } = this.props;
    const padding = centered ? (screenWidth - slideWidth) / 2 : 0;
    const paddingStyle = {
      paddingLeft: padding,
      paddingRight: padding,
    };

    return (
      <BaseScroll
        ref={(el) => (this.scroll = el)}
        {...this.props}
        pagingEnabled={false}
        contentStyle={[cs.centered, paddingStyle]}
      />
    );
  }
}

export default Scroll;
