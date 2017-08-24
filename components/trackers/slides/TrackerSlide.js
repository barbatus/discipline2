'use strict';

import React, { PureComponent } from 'react';

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

export default class TrackerSlide extends PureComponent {
  static defaultProps = {
    scale: 1,
    editable: true,
  };

  static propTypes = {
    index: React.PropTypes.number,
    editable: React.PropTypes.bool,
    style: View.propTypes.style,
    tracker: React.PropTypes.instanceOf(Tracker),
  };

  constructor(props) {
    super(props);
    const { scale } = props;
    this.flip = new FlipAnimation();
    this.scale = new ScaleAnimation(scale);
    this.state = {
      tracker: props.tracker,
    };
    this.onTap = ::this.onTap;
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
  }

  componentWillReceiveProps(props) {
    if (this.props.tracker !== props.tracker) {
      this.state.tracker = props.tracker;
    }
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
    this.flip.animateIn(callback);
  }

  cancelEdit(callback) {
    Keyboard.dismiss();
    this.flip.animateOut(callback);
  }

  collapse(callback) {
    this.scale.animateOut(callback);
  }

  shake(callback) {}

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

  renderBackView() {
    const { editable, onTrackerChange } = this.props;
    const { tracker } = this.state;
    if (editable) {
      return (
        <TrackerEditView
          ref="editView"
          style={[absFilled, this.flip.style2]}
          showType={false}
          allowDelete
          tracker={tracker}
          onRemove={this.onRemove}
          onTrackerChange={onTrackerChange}
        />
      );
    }
  }

  renderFrontView() {
    const { tracker } = this.props;
    return (
      <TrackerView
        ref="trackerView"
        style={this.flip.style1}
        tracker={tracker}
        backImg={this.backImg}
        bodyControls={this.bodyControls}
        footerControls={this.footerControls}
        onTap={this.onTap}
        onEdit={this.onEdit}
        bodyStyle={this.bodyStyle}
        footerStyle={this.footerStyle}
      />
    );
  }

  render() {
    const { style } = this.props;
    const slideStyle = [trackerStyles.slide, style];
    return (
      <Animated.View style={[slideStyle, this.scale.style]}>
        {this.renderFrontView()}
        {this.renderBackView()}
      </Animated.View>
    );
  }
}
