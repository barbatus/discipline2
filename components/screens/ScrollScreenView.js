import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter3';

import { ScrollView, StyleSheet, View, ViewPropTypes } from 'react-native';

import { caller } from 'app/utils/lang';

import { commonDef, commonStyles as cs, SCREEN_WIDTH } from '../styles/common';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'hidden',
  },
  slideContainer: {
    ...commonDef.flexFilled,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
});

export default class ScrollScreenView extends PureComponent {
  static contextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  static propTypes = {
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    style: null,
  };

  emitter = new EventEmitter();

  constructor(props) {
    super(props);
    this.refHandler = ::this.refHandler;
  }

  get rightView() {
    throw new Error('rightView is not implemented');
  }

  get leftView() {
    throw new Error('leftView is not implemented');
  }

  moveLeft(callback?: Function) {
    this.emitter.emit('onMoveLeft');
    this.moveTo(0, callback);
  }

  moveRight(callback?: Function) {
    this.emitter.emit('onMoveRight');
    this.moveTo(1, callback);
  }

  moveTo(index: number, callback?: Function) {
    const scrollToX = index * SCREEN_WIDTH;
    this.scroll.scrollTo({ y: 0, x: scrollToX, animated: true });
    caller(callback);
  }

  refHandler(el) {
    this.scroll = el;
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[cs.flexFilled, style]}>
        <ScrollView
          // TODO: some strange issue when lambda is used
          ref={this.refHandler}
          style={styles.scroll}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          removeClippedSubviews
          scrollEventThrottle={0}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View key={0} style={styles.slideContainer}>
            {this.leftView}
          </View>
          <View key={1} style={styles.slideContainer}>
            {this.rightView}
          </View>
        </ScrollView>
      </View>
    );
  }
}
