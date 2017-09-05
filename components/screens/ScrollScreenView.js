import React, { PureComponent } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import { commonDef, commonStyles, screenWidth } from '../styles/common';

import { caller } from '../../utils/lang';

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

  get rightView() {
    throw new Error('rightView is not implemented');
  }

  get leftView() {
    throw new Error('leftView is not implemented');
  }

  get leftTrueViewRef() {
    if (!this.leftViewRef) return null;

    return this.leftViewRef.getWrappedInstance ?
      this.leftViewRef.getWrappedInstance() : this.leftViewRef;
  }

  get rightTrueViewRef() {
    if (!this.rightViewRef) return null;

    return this.rightViewRef.getWrappedInstance ?
      this.rightViewRef.getWrappedInstance() : this.rightViewRef;
  }

  moveLeft(callback?: Function) {
    if (this.leftTrueViewRef.onLeftMove) {
      this.leftTrueViewRef.onLeftMove();
    }
    if (this.rightTrueViewRef.onLeftMove) {
      this.rightTrueViewRef.onLeftMove();
    }
    this.moveTo(0, callback);
  }

  moveRight(callback?: Function) {
    if (this.leftTrueViewRef.onRightMove) {
      this.leftTrueViewRef.onRightMove();
    }
    if (this.rightTrueViewRef.onRightMove) {
      this.rightTrueViewRef.onRightMove();
    }
    this.moveTo(1, callback);
  }

  moveTo(index: number) {
    const scrollToX = index * screenWidth;
    this.scroll.scrollTo({ y: 0, x: scrollToX, animated: true });
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[commonStyles.flexFilled, style]}>
        <ScrollView
          ref={(el) => this.scroll = el}
          style={styles.scroll}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          removeClippedSubviews
          scrollEventThrottle={1000}
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
