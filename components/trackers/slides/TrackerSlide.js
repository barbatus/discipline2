'use strict';

import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';

import {
  trackerStyles,
  propsStyles,
} from '../styles/trackerStyles';

import {commonStyles} from '../../styles/common';

import TrackerView from './basic/TrackerView';
import TrackerEditView from './basic/TrackerEditView';

import UserIconsStore from '../../../icons/UserIconsStore';

import Tracker from '../../../model/Tracker';

import Animation from '../../animation/Animation';
import FlipAnimation from '../../animation/FlipAnimation';
import ScaleAnimation from '../../animation/ScaleAnimation';

import {caller} from '../../../utils/lang';

const absFilled = commonStyles.absoluteFilled;

export default class TrackerSlide extends Component {
  constructor(props) {
    super(props);
    const { scale } = props;
    this._flip = new FlipAnimation();
    this._scale = new ScaleAnimation(scale);
    this.state = {};
  }

  shouldComponentUpdate(props, state) {
    return this.props.tracker !== props.tracker;
  }

  get controls() {
    throw new Error('controls is not implemented');
  }

  get footer() {
    throw new Error('footer is not implemented');
  }

  get editedTracker() {
    return this.refs.editView.tracker;
  }

  showEdit(callback) {
    this._flip.animateIn(callback);
  }

  cancelEdit(callback) {
    this._flip.animateOut(() => {
      this.refs.editView.reset();
      caller(callback);
    });
  }

  collapse(callback) {
    this._scale.animateOut(() => {
      //this.refs.editView.reset();
      caller(callback);
    });
  }

  shake(callback) {}

  render() {
    const { style } = this.props;

    const slideStyle = [trackerStyles.slide, style];
    return (
      <Animated.View style={[slideStyle, this._scale.style]}>
        { this._renderFrontView() }
        { this._renderBackView() }
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
    const { tracker, editable } = this.props;

    if (editable) {
      return (
        <TrackerEditView
          ref='editView'
          style={[absFilled, this._flip.style2]}
          showType={false}
          delete={true}
          tracker={tracker}
          onRemove={::this.onRemove}
        />
      );
    }
  }

  _renderFrontView() {
    const { tracker, editable } = this.props;

    return (
      <TrackerView
        ref='trackerView'
        style={this._flip.style1}
        tracker={tracker}
        backImg={this.backImg}
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
  editable: true,
};

TrackerSlide.propTypes = {
  index: React.PropTypes.number,
  editable: React.PropTypes.bool,
  style: View.propTypes.style,
  tracker: React.PropTypes.instanceOf(Tracker),
};
