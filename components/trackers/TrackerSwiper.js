import React from 'react';
import { Animated, View } from 'react-native';
import RNShake from 'react-native-shake';
import isNumber from 'lodash/isNumber';

import { caller } from 'app/utils/lang';

import Animation from '../animation/Animation';
import { minScale, MoveUpScaleResponderAnim } from '../animation/MoveUpScaleResponderAnim';
import { MoveUpDownResponder } from '../animation/responders';
import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';
import Swiper from '../scrolls/Swiper';
import { commonStyles, SCREEN_WIDTH } from '../styles/common';

import { SLIDE_HEIGHT } from './styles/slideStyles';
import TrackerRenderer from './TrackerRenderer';


export default class TrackerSwiper extends TrackerRenderer {
  responder = new MoveUpDownResponder();

  moveScale = new MoveUpScaleResponderAnim(SLIDE_HEIGHT);

  upDown = new ScreenSlideUpDownAnim(minScale);

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
    RNShake.removeEventListener('ShakeEvent');
    this.moveScale.dispose();
    this.responder.dispose();
  }

  componentDidMount() {
    RNShake.addEventListener('ShakeEvent', ::this.shakeCurrent);
    this.handleMoveUp();
  }

  componentDidUpdate({
    trackers: prevTrackers,
    updateIndex: prevUpdIndex,
    addIndex: prevAddIndex,
    enabled: prevEnabled,
    removeIndex: prevRemoveIndex,
  }) {
    const { updateIndex, addIndex, trackers, enabled, removeIndex } = this.props;

    if (isNumber(updateIndex) && prevUpdIndex !== updateIndex) {
      this.cancelEdit();
      caller(this.props.onSaveCompleted, updateIndex);
    }

    if (isNumber(addIndex) && prevAddIndex !== addIndex) {
      this.scrollTo(addIndex);
      caller(this.props.onAddCompleted, addIndex);
    }

    if (isNumber(removeIndex) && prevRemoveIndex !== removeIndex) {
      const tracker = prevTrackers[removeIndex];
      this.animateRemove(tracker.id, removeIndex, () => {
        this.setState({ trackers });
        caller(this.props.onRemoveCompleted, removeIndex);
        this.responder.enable();
      });
    }

    if (enabled !== prevEnabled) {
      if (enabled) {
        this.responder.enable();
      } else {
        this.responder.disable();
      }
    }
  }

  static getDerivedStateFromProps({ trackers, enabled, removeIndex }, prevState) {
    if (isNumber(removeIndex)) return null;

    if (trackers !== prevState.trackers || enabled !== prevState.enabled) {
      return { trackers, scrollEnabled: enabled };
    }
    return null;
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
    if (this.current) {
      const trackerId = this.current.id;
      this.mapRefs.get(trackerId).shake();
    }
  }

  showEdit(onStart, onDone) {
    this.responder.disable();
    this.setState({ scrollEnabled: false }, () => {
      const trackerId = this.current.id;
      this.mapRefs.get(trackerId).showEdit(onStart, onDone);
    });
  }

  cancelEdit(callback) {
    const trackerId = this.current.id;
    return this.mapRefs.get(trackerId).cancelEdit(
      () => {
        this.responder.enable();
        this.onCancelEdit(callback);
      },
    );
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
  animateRemove(trackerId: number, index: number, callback: Function) {
    const prevInd = index + (index >= 1 ? -1 : 1);

    this.mapRefs.get(trackerId).collapse(() => (
      this.scrollTo(prevInd, () => {
        // In case of removing the first tracker,
        // we move to the next, so adjust the index accordingly.
        this.scrollTo(index ? prevInd : 0, null, false);
        caller(callback);
      })
    ));
  }

  onCancelEdit(callback) {
    this.setState({ scrollEnabled: true }, callback);
  }

  render() {
    const { trackers, scrollEnabled } = this.state;
    const { style, metric, onScroll, onSwiperMoveUpDone } = this.props;

    const slideStyle = {
      width: SCREEN_WIDTH,
      height: SLIDE_HEIGHT,
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
          scrollEnabled={scrollEnabled}
          onTouchMove={onScroll}
          onSwiperMoveUpDone={onSwiperMoveUpDone}
        />
      </Animated.View>
    );
  }
}
