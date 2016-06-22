'use strict';

import React, { Component } from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  SwitchIOS
} from 'react-native';

import Easing from 'Easing';

import {
  trackerStyles,
  propsStyles
} from '../styles/trackerStyles';

import TrackerView from './basic/TrackerView';
import TrackerEditView from './basic/TrackerEditView';

import UserIconsStore from '../../../icons/UserIconsStore';

import { caller } from '../../../utils/lang';

export default class TrackerSlide extends Component {
  constructor(props) {
    super(props);

    this._isAnimated = false;
    this._moveView = new Animated.Value(0);
    this._moveEdit = new Animated.Value(1);
    this._scale = new Animated.Value(props.scale);
    this._rotY = new Animated.Value(0);
  }

  componentWillMount() {
    this.onChange();
    let { tracker } = this.props;
    tracker.onChange(this.onChange.bind(this));
  }

  onChange() {
    throw new Error('onChange is not implemented');
  }

  onTap() {
    caller(this.props.onTap);
  }

  onEdit() {
    if (this.props.editable) {
      caller(this.props.onEdit);
    }
  }

  onRemove() {
    if (this.props.editable) {
      caller(this.props.onRemove);
    }
  }

  get controls() {
    throw new Error('controls is not implemented');
  }

  get footer() {
    throw new Error('footer is not implemented');
  }

  showEdit(callback) {
    if (!this._isAnimated) {
      this._isAnimated = true;

      this._moveEdit.setValue(0);

      this._animateFlip(1, 0, 1,
        value => value > 0.5, () => {
          this._moveView.setValue(1);
          this._onAnimationDone(callback);
        });
    }
  }

  saveEdit(callback) {
    if (!this._isAnimated) {
      this._isAnimated = true;
      let { title, iconId } = this.refs.editView;
      let icon = UserIconsStore.get(iconId);
      this.props.tracker.title = title;
      this.props.tracker.icon = icon;
      let saved = this.props.tracker.save();

      if (saved) {
        this._moveView.setValue(0);

        this._animateFlip(0, 1, 0,
          value => value <= 0.5, () => {
            this._moveEdit.setValue(1);
            this.refs.editView.reset();
            this._onAnimationDone(callback);
          });
      }
    }
  }

  cancelEdit(callback) {
    if (!this._isAnimated) {
      this._isAnimated = true;

      this._moveView.setValue(0);

      this._animateFlip(0, 1, 0,
        value => value <= 0.5, () => {
          this._moveEdit.setValue(1);
          this.refs.editView.reset();
          this._onAnimationDone(callback);
        });
    }
  }

  collapse(callback) {
    Animated.timing(this.state.scale, {
      duration: 500,
      toValue: 0
    }).start(() => {
      this.refs.editView.reset();
      caller(callback);
    });
  }

  render() {
    let { style } = this.props;

    return (
      <Animated.View style={[
          trackerStyles.slide, style, {
            transform: [{
              scale: this._scale
            }]
          }
        ]}>
        <View style={[trackerStyles.container]}>
          {
            this._renderFrontView()
          }
          {
            this._renderBackView()
          }
        </View>
      </Animated.View>
    );
  }

  _renderBackView() {
    let { tracker, editable } = this.props;

    return  (
      editable ? 
        <TrackerEditView
          ref='editView'
          shown={false}
          style={{
            transform: [
              {
                rotateY: this._rotY.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-180deg', '0deg']
                })
              },
              {
                translateY: this._moveEdit.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000]
                })
              }
            ]
          }}
          showType={false}
          delete={true}
          iconId={tracker.iconId}
          title={tracker.title}
          onRemove={this.onRemove.bind(this)}
        />
      : null
    );
  }

  _renderFrontView() {
    let { tracker, editable } = this.props;

    return (
      <TrackerView
        ref='trackerView'
        shown={true}
        style={{
          transform: [
            {
              rotateY: this._rotY.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
              })
            },
            {
              translateY: this._moveView.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }
          ]
        }}
        iconId={tracker.iconId}
        title={tracker.title}
        controls={this.controls}
        footer={this.footer}
        onTap={this.onTap.bind(this)}
        onEdit={this.onEdit.bind(this)}
      />
    );
  }

  _animateFlip(stopVal, op1, op2, opCondition, callback) {
    this._rotY.removeAllListeners();
    let id = this._rotY.addListener(({ value }) => {
      if (opCondition(value)) {
        this._rotY.removeListener(id);
        this.refs.trackerView.opacity = op1;
        this.refs.editView.opacity = op2;
      }
    });

    Animated.timing(this._rotY, {
      duration: 1000,
      toValue: stopVal,
      easing: Easing.inOut(Easing.sin)
    }).start(callback);
  }

  _onAnimationDone(callback) {
    this._isAnimated = false;
    caller(callback);
  }
};

TrackerSlide.defaultProps = {
  scale: 1,
  editable: true
};
