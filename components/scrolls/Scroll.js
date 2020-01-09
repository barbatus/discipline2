import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import { commonStyles as cs, SCREEN_WIDTH } from '../styles/common';

import BaseScroll from './BaseScroll';

class Scroll extends PureComponent {
  static propTypes = {
    centered: PropTypes.bool,
    slideWidth: PropTypes.number.isRequired,
  };

  static defaultProps = {
    centered: false,
  };

  scroll = React.createRef();

  get index() {
    return this.scroll.current.index;
  }

  scrollTo(index, callback, animated) {
    this.scroll.current.scrollTo(index, callback, animated);
  }

  render() {
    const { centered, slideWidth } = this.props;
    const padding = centered ? (SCREEN_WIDTH - slideWidth) / 2 : 0;
    const paddingStyle = {
      paddingLeft: padding,
      paddingRight: padding,
    };

    return (
      <BaseScroll
        ref={this.scroll}
        {...this.props}
        pagingEnabled={false}
        contentStyle={[cs.centered, paddingStyle]}
      />
    );
  }
}

export default Scroll;
