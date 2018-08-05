import React from 'react';

import { View, Animated } from 'react-native';

import RNShake from 'react-native-shake';

import isNumber from 'lodash/isNumber';

import { caller } from 'app/utils/lang';

import Swiper from '../scrolls/Swiper';

import Animation from '../animation/Animation';

import { minScale, MoveUpScaleResponderAnim }
  from '../animation/MoveUpScaleResponderAnim';

import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';

import { MoveUpDownResponder } from '../animation/responders';

import { commonStyles, SCREEN_WIDTH } from '../styles/common';

import { slideHeight } from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

export default class TrackerSwiper extends TrackerRenderer {
  upDown = new ScreenSlideUpDownAnim(minScale);
  moveScale = new MoveUpScaleResponderAnim(slideHeight);
  responder = new MoveUpDownResponder();

  updateIndex = null;
  addIndex = null;

  get current() {
    return this.state.trackers[this.index];
  }

  get index() {
    return this.swiper.index;
  }

  get shown() {
    return this.upDown.in;
  }

  componentWillUnmount() {
    RNShake.removeEventListener('shake');
    this.moveScale.dispose();
    this.responder.dispose();
  }

  componentDidMount() {
    RNShake.addEventListener('shake', ::this.shakeCurrent);
    this.handleMoveUp();
  }

  componentDidUpdate() {
    if (isNumber(this.updateIndex)) {
      this.cancelEdit();
      caller(this.props.onSaveCompleted, this.updateIndex);
      this.updateIndex = null;
    }

    if (isNumber(this.addIndex)) {
      this.scrollTo(this.addIndex);
      caller(this.props.onAddCompleted, this.addIndex);
      this.addIndex = null;
    }
  }

  componentWillReceiveProps(props, state) {
    super.componentWillReceiveProps(props, state);

    const { trackers, removeIndex, addIndex, updateIndex, enabled } = props;
    const {
      removeIndex: prevRemoveIndex,
      addIndex: prevAddIndex,
      updateIndex: prevUpdIndex,
    } = this.props;

    if (isNumber(removeIndex) && prevRemoveIndex !== removeIndex) {
      const prevTrackers = this.props.trackers;
      this.setState({ trackers: prevTrackers });
      this.animateRemove(prevTrackers, removeIndex,
        () => this.setState({ trackers, scrollEnabled: true })
      );
      caller(this.props.onRemoveCompleted, removeIndex);
    }

    if (isNumber(addIndex) && prevAddIndex !== addIndex) {
      this.setState({ trackers, scrollEnabled: true });
      this.addIndex = addIndex;
    }

    if (isNumber(updateIndex) && prevUpdIndex !== updateIndex) {
      this.updateIndex = updateIndex;
    }

    if (this.props.enabled !== enabled) {
      if (enabled) {
        this.handleMoveUp();
      } else {
        this.unhandleMoveUp();
      }
    }
  }

  handleMoveUp() {
    const { onScaleMove, onScaleDone, onScaleCancel, onScaleStart } = this.props;
    this.moveScale.subscribe(
      this.responder,
      onScaleMove,
      onScaleStart,
      onScaleDone,
      onScaleCancel,
    );
  }

  unhandleMoveUp() {
    this.moveScale.unsubscribe();
  }

  shakeCurrent() {
    const trackerId = this.current.id;
    this.refs[trackerId].shake();
  }

  showEdit(callback) {
    this.setState({ scrollEnabled: false }, () => {
      const trackerId = this.current.id;
      this.refs[trackerId].showEdit(callback);
    });
  }

  cancelEdit(callback) {
    const trackerId = this.current.id;
    return this.refs[trackerId].cancelEdit(
      () => this.onCancelEdit(callback));
  }

  hide(callback) {
    this.upDown.setOut();
    caller(callback);
  }

  show(callback) {
    this.upDown.setIn();
    this.moveScale.animateIn(callback);
  }

  scrollTo(index, callback, animated) {
    this.swiper.scrollTo(index, callback, animated);
  }

  // When animating the removal we always scroll to the prev index.
  animateRemove(trackers, index, callback) {
    const tracker = trackers[index];
    const trackerId = tracker.id;
    const prevInd = index + (index >= 1 ? -1 : 1);

    this.refs[trackerId].collapse(() =>
      this.scrollTo(prevInd, () => {
        // In case of removing the first tracker,
        // we move to the next, so adjust the index accordingly.
        this.scrollTo(index ? prevInd : 0, null, false);
        caller(callback);
      })
    );
  }

  onCancelEdit(callback) {
    this.setState({ scrollEnabled: true }, callback);
  }

  render() {
    const { trackers, scrollEnabled } = this.state;
    const { style, metric, enabled, onScroll, onSwiperMoveUpDone } = this.props;

    const slideStyle = {
      width: SCREEN_WIDTH,
      height: slideHeight,
    };
    const slides = trackers.map((tracker) => (
      <View
        key={tracker.id}
        style={[commonStyles.centered, slideStyle]}
      >
        {this.renderTracker(tracker, metric)}
      </View>
    ));

    const transform = Animation.combineStyles(this.moveScale, this.upDown);
    const swiperStyle = [style, transform];
    return (
      <Animated.View style={swiperStyle} {...this.responder.panHandlers}>
        <Swiper
          {...this.props}
          ref={(el) => (this.swiper = el)}
          style={commonStyles.flexFilled}
          slides={slides}
          scrollEnabled={enabled && scrollEnabled}
          onTouchMove={onScroll}
          onSwiperMoveUpDone={onSwiperMoveUpDone}
        />
      </Animated.View>
    );
  }
}
