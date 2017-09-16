import React, { PureComponent } from 'react';

import EventEmitter from 'eventemitter3';

import { ScrollView, StyleSheet, View } from 'react-native';

import { commonDef, commonStyles as cs, screenWidth } from '../styles/common';

const styles = StyleSheet.create({
  scroll: {
    overflow: 'hidden',
  },
  slideContainer: {
    ...commonDef.flexFilled,
    width: screenWidth,
    alignItems: 'center',
  },
});

export default class ScrollScreenView extends PureComponent {
  static contextTypes = {
    navBar: React.PropTypes.object.isRequired,
  };

  emitter = new EventEmitter();

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

  moveTo(index: number) {
    const scrollToX = index * screenWidth;
    this.scroll.scrollTo({ y: 0, x: scrollToX, animated: true });
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[cs.flexFilled, style]}>
        <ScrollView
          ref={(el) => (this.scroll = el)}
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
