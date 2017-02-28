'use strict';

import React, { Component } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import { commonDef, commonStyles, screenWidth } from '../styles/common';

import { caller } from '../../utils/lang';

export default class ScrollScreenView extends Component {
  get rightView() {
    return null;
  }

  get leftView() {
    return null;
  }

  moveLeft(callback?: Function) {
    if (this.refs.left.onLeftMove) {
      this.refs.left.onLeftMove();
    }
    if (this.refs.right.onLeftMove) {
      this.refs.right.onLeftMove();
    }
    this._moveTo(0, callback);
  }

  moveRight(callback?: Function) {
    if (this.refs.left.onRightMove) {
      this.refs.left.onRightMove();
    }
    if (this.refs.right.onRightMove) {
      this.refs.right.onRightMove();
    }
    this._moveTo(1, callback);
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[commonStyles.flexFilled, style]}>
        <ScrollView
          ref="scroll"
          style={styles.scroll}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          removeClippedSubviews
          scrollEventThrottle={1000}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets
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

  _moveTo(index: number) {
    const scrollToX = index * screenWidth;
    this.refs.scroll.scrollTo({ y: 0, x: scrollToX, animated: true });
  }
}

ScrollScreenView.contextTypes = {
  navBar: React.PropTypes.object.isRequired,
};

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
