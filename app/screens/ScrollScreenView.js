import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter3';

import { ScrollView, StyleSheet, View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import { caller } from 'app/utils/lang';

import {
  commonDef,
  commonStyles as cs,
  SCREEN_WIDTH,
} from 'app/components/styles/common';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'visible',
  },
  slideContainer: {
    ...commonDef.flexFilled,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
});

export default class ScrollScreenView extends PureComponent {
  emitter = new EventEmitter();

  static propTypes = {
    style: ViewPropTypes.style,
  };

  static contextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  static defaultProps = {
    style: null,
  };

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
    // TODO: impl properly
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
          keyboardDismissMode="on-drag">
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
