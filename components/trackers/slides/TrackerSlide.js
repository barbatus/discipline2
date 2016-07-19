'use strict';

import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Animated
} from 'react-native';

import Easing from 'Easing';

import {
  trackerStyles,
  propsStyles
} from '../styles/trackerStyles';

import {commonStyles} from '../../styles/common';

import {slideWidth, slideHeight} from '../styles/slideStyles';

import TrackerView from './basic/TrackerView';
import TrackerEditView from './basic/TrackerEditView';

import UserIconsStore from '../../../icons/UserIconsStore';

import Animation from '../../animation/Animation';
import FlipAnimation from '../../animation/FlipAnimation';
import ScaleAnimation from '../../animation/ScaleAnimation';

import {caller} from '../../../utils/lang';

export default class TrackerSlide extends Component {
  constructor(props) {
    super(props);
    let { scale } = props;
    this._flip = new FlipAnimation();
    this._scale = new ScaleAnimation(scale);
  }

  componentWillMount() {
    this.onChange();
    let { tracker } = this.props;
    tracker.onChange(::this.onChange);
    tracker.onTick(::this.onTick);
  }

  onChange() {
    throw new Error('onChange is not implemented');
  }

  onTick() {
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
    this._flip.animateIn(callback);
  }

  saveEdit(callback) {
    if (!Animation.on) {
      let { title, iconId } = this.refs.editView;
      let icon = UserIconsStore.get(iconId);
      let { tracker } = this.props;
      tracker.title = title;
      tracker.icon = icon;
      let saved = tracker.save();

      if (saved) {
        this._flip.animateOut(() => {
          this.refs.editView.reset();
          caller(callback);
        });
      }
    }
  }

  cancelEdit(callback) {
    this._flip.animateOut(() => {
      this.refs.editView.reset();
      caller(callback);
    });
  }

  collapse(callback) {
    this._scale.animateOut(() => {
      this.refs.editView.reset();
      caller(callback);
    });
  }

  render() {
    let { scale, style } = this.props;

    let slideStyle = [trackerStyles.slide, style];
    return (
      <Animated.View style={[slideStyle, this._scale.style]}>
        {
          this._renderFrontView()
        }
        {
          this._renderBackView()
        }
      </Animated.View>
    );
  }

  _renderBackView() {
    let { tracker, editable } = this.props;

    if (editable) {
      return (
        <TrackerEditView
          ref='editView'
          style={[commonStyles.absoluteFilled, this._flip.style2]}
          showType={false}
          delete={true}
          iconId={tracker.iconId}
          title={tracker.title}
          onRemove={::this.onRemove}
        />
      );
    }
  }

  _renderFrontView() {
    let { tracker, editable } = this.props;

    return (
      <TrackerView
        ref='trackerView'
        style={this._flip.style1}
        iconId={tracker.iconId}
        title={tracker.title}
        controls={this.controls}
        footer={this.footer}
        onTap={::this.onTap}
        onEdit={::this.onEdit}
      />
    );
  }
};

TrackerSlide.defaultProps = {
  scale: 1,
  editable: true
};
