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

export default class TrackerSlide extends Component {
  constructor(props) {
    super(props);

    this._isAnimated = false;
    this._moveView = new Animated.Value(0);
    this._moveEdit = new Animated.Value(1);

    let { tracker, scale } = props;
    this.state = {
      iconId: tracker.iconId,
      title: tracker.title,
      scale: new Animated.Value(scale),
      rotY: new Animated.Value(0)
    };
  }

  componentWillMount() {
    this.onChange();
    let { tracker } = this.props;
    tracker.onChange(this.onChange.bind(this));
  }

  onChange() {
    throw new Error('onChange is not implemented');
  }

  get controls() {
    throw new Error('controls is not implemented');
  }

  get footer() {
    throw new Error('footer is not implemented');
  }

  _animateFlip(stopVal, op1, op2, opCondition, callback) {
    this.state.rotY.removeAllListeners();
    let id = this.state.rotY.addListener(({ value }) => {
      if (opCondition(value)) {
        this.state.rotY.removeListener(id);
        this.refs.trackerView.opacity = op1;
        this.refs.editView.opacity = op2;
      }
    });

    Animated.timing(this.state.rotY, {
      duration: 1000,
      toValue: stopVal,
      easing: Easing.inOut(Easing.sin)
    }).start(callback);
  }

  _onAnimationDone(callback) {
    this._isAnimated = false;
    if (callback) {
      callback();
    }
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
      let title = this.refs.editView.title;
      let iconId = this.refs.editView.iconId;
      let icon = UserIconsStore.get(iconId);
      this.props.tracker.title = title;
      this.props.tracker.icon = icon;
      let saved = this.props.tracker.save();

      if (saved) {
        this.setState({
          title: title,
          iconId: iconId
        });

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
      if (callback) {
        callback();
      }
    });
  }

  render() {
    return (
      <Animated.View style={[
          trackerStyles.slide, {
            transform: [{
              scale: this.state.scale
            }]
          }
        ]}>
        <View style={trackerStyles.container}>
          <TrackerView
            ref='trackerView'
            shown={true}
            style={{
              transform: [
                {
                  rotateY: this.state.rotY.interpolate({
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
            iconId={this.state.iconId}
            title={this.state.title}
            controls={this.controls}
            footer={this.footer}
            onClick={this.onClick}
            onEdit={this.props.onEdit}
          />
          <TrackerEditView
            ref='editView'
            shown={false}
            style={{
              transform: [
                {
                  rotateY: this.state.rotY.interpolate({
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
            iconId={this.state.iconId}
            title={this.state.title}
            onRemove={this.props.onRemove}
            onIconEdit={this.props.onIconEdit}
          />
        </View>
      </Animated.View>
    );
  }
};
