'use strict';

import React, { Component } from 'react';

import { View, StyleSheet, Animated } from 'react-native';

import { trackerStyles, propsStyles } from '../styles/trackerStyles';

import Keyboard from '../../../utils/keyboard';

import { commonStyles } from '../../styles/common';

import TrackerView from './basic/TrackerView';

import TrackerEditView from './basic/TrackerEditView';

import UserIconsStore from '../../../icons/UserIconsStore';

import Tracker from '../../../model/Tracker';

import Animation from '../../animation/Animation';

import FlipAnimation from '../../animation/FlipAnimation';

import ScaleAnimation from '../../animation/ScaleAnimation';

import { caller } from '../../../utils/lang';

const absFilled = commonStyles.absoluteFilled;

export default class TrackerSlide extends Component {
  constructor(props) {
    super(props);
    const { scale } = props;
    this._flip = new FlipAnimation();
    this._scale = new ScaleAnimation(scale);
    this.state = {
      tracker: props.tracker,
    };
  }

  shouldComponentUpdate(props, state) {
    if (this.props.tracker !== props.tracker) {
      this.state.tracker = props.tracker;
      return true;
    }
    return this.state.tracker !== state.tracker;
  }

  get bodyControls() {
    throw new Error('Controls is not implemented');
  }

  get footerControls() {
    throw new Error('Footer controls is not implemented');
  }

  get bodyStyle() {
    return null;
  }

  get footerStyle() {
    return null;
  }

  showEdit(callback) {
    const { tracker } = this.props;
    this.setState({
      tracker: tracker.clone(),
    });
    Keyboard.dismiss();
    this._flip.animateIn(callback);
  }

  cancelEdit(callback) {
    Keyboard.dismiss();
    this._flip.animateOut(callback);
  }

  collapse(callback) {
    this._scale.animateOut(callback);
  }

  shake(callback) {}

  render() {
    const { style } = this.props;
    const slideStyle = [trackerStyles.slide, style];
    return (
      <Animated.View style={[slideStyle, this._scale.style]}>
        {this._renderFrontView()}
        {this._renderBackView()}
      </Animated.View>
    );
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

  _renderBackView() {
    const { editable, onTrackerChange } = this.props;
    const { tracker } = this.state;
    if (editable) {
      return (
        <TrackerEditView
          ref="editView"
          style={[absFilled, this._flip.style2]}
          showType={false}
          allowDelete
          tracker={tracker}
          onRemove={::this.onRemove}
          onTrackerChange={onTrackerChange}
        />
      );
    }
  }

  _renderFrontView() {
    const { tracker } = this.props;
    return (
      <TrackerView
        ref="trackerView"
        style={this._flip.style1}
        tracker={tracker}
        backImg={this.backImg}
        bodyControls={this.bodyControls}
        footerControls={this.footerControls}
        onTap={::this.onTap}
        onEdit={::this.onEdit}
        bodyStyle={this.bodyStyle}
        footerStyle={this.footerStyle}
      />
    );
  }
}

TrackerSlide.defaultProps = {
  scale: 1,
  editable: true,
};

TrackerSlide.propTypes = {
  index: React.PropTypes.number,
  editable: React.PropTypes.bool,
  style: View.propTypes.style,
  tracker: React.PropTypes.instanceOf(Tracker),
};
