import { caller } from 'app/utils/lang';
import isNumber from 'lodash/isNumber';
import React from 'react';
import { Animated, View } from 'react-native';
import RNShake from 'react-native-shake';
import Animation from '../animation/Animation';
import { minScale, MoveUpScaleResponderAnim } from '../animation/MoveUpScaleResponderAnim';
import { MoveUpDownResponder } from '../animation/responders';
import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';
import Swiper from '../scrolls/Swiper';
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
      this.setState({ trackers, scrollEnabled: true });
      this.scrollTo(addIndex);
      caller(this.props.onAddCompleted, addIndex);
    }

    if (isNumber(removeIndex) && prevRemoveIndex !== removeIndex) {
      this.animateRemove(prevTrackers, removeIndex,
        () => this.setState({ trackers, scrollEnabled: true })
      );
      caller(this.props.onRemoveCompleted, removeIndex);
    }

    if (enabled !== prevEnabled) {
      if (enabled) {
        this.handleMoveUp();
      } else {
        this.unhandleMoveUp();
      }
    }
  }

  static getDerivedStateFromProps({ trackers, enabled, removeIndex }, prevState) {
    if (removeIndex !== prevState.removeIndex) return { removeIndex };

    if (trackers !== prevState.trackers || enabled !== prevState.enabled) {
      return { trackers, enabled };
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

  showEdit(callback) {
    this.setState({ scrollEnabled: false }, () => {
      const trackerId = this.current.id;
      this.mapRefs.get(trackerId).showEdit(callback);
    });
  }

  cancelEdit(callback) {
    const trackerId = this.current.id;
    return this.mapRefs.get(trackerId).cancelEdit(
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

    this.mapRefs.get(trackerId).collapse(() =>
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
