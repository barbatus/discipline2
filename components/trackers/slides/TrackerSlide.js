import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, ViewPropTypes } from 'react-native';

import Animation from 'app/components/animation/Animation';
import FlipAnimation from 'app/components/animation/FlipAnimation';
import ScaleAnimation from 'app/components/animation/ScaleAnimation';

import { caller } from 'app/utils/lang';
import Keyboard from 'app/utils/keyboard';
import Tracker from 'app/model/Tracker';
import { commonStyles } from 'app/components/styles/common';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerView from './common/TrackerView';
import TrackerEditView from './common/TrackerEditView';

const absFilled = commonStyles.absoluteFilled;

export default class TrackerSlide extends PureComponent {
  static defaultProps = {
    scale: 1,
    editable: true,
  };

  static propTypes = {
    editable: PropTypes.bool,
    scale: PropTypes.number,
    style: ViewPropTypes.style,
    tracker: PropTypes.instanceOf(Tracker).isRequired,
    onTap: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onTrackerEdit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: null,
  };

  constructor(props) {
    super(props);
    const { scale } = props;
    this.flip = new FlipAnimation();
    this.scale = new ScaleAnimation(scale);
    this.state = { editTracker: null };
    this.onTap = ::this.onTap;
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
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

  get trackerProps() {
    return Tracker.properties;
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

  showEdit(onStart, onDone) {
    if (Animation.on) return;

    caller(onStart);
    const { tracker } = this.props;
    Keyboard.dismiss();
    this.setState({ editTracker: tracker },
      () => this.flip.animateIn(onDone));
  }

  cancelEdit(callback) {
    Keyboard.dismiss();
    this.flip.animateOut(callback);
  }

  collapse(callback) {
    this.scale.animateOut(callback);
  }

  shake() {}

  renderBackView() {
    const { editable, onTrackerEdit } = this.props;
    if (!editable) return null;

    const { editTracker } = this.state;
    return editTracker ? (
      <TrackerEditView
        form="trackerForm"
        style={[absFilled, this.flip.style2]}
        props={this.trackerProps}
        allowType={false}
        allowDelete
        initialValues={editTracker}
        onRemove={this.onRemove}
        onSubmitSuccess={onTrackerEdit}
      />
    ) : null;
  }

  renderFrontView() {
    const { tracker } = this.props;
    return (
      <TrackerView
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
