'use strict';

import React, { Component } from 'react';

import { View, findNodeHandle } from 'react-native';

import NativeMethodsMixin from 'NativeMethodsMixin';

import { commonStyles } from '../styles/common';

export default class Tooltip extends Component {
  componentWillReceiveProps({ shown }) {
    if (this.props.shown !== shown) {
      const parent = findNodeHandle(this.refs.view);
      if (parent) {
        NativeMethodsMixin.measure.call(parent, (x, y, width, height) => {
          console.log(x);
        });
      }
    }
  }

  render() {
    const { shown } = this.props;

    return (
      <View ref="view" style={commonStyles.absFilled}>
        {shown ? this.props.children : null}
      </View>
    );
  }
}
