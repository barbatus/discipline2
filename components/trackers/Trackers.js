import React, { PureComponent } from 'react';

import { StyleSheet, Animated, InteractionManager } from 'react-native';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import { List } from 'immutable';

import TrackerSwiper from './TrackerSwiper';

import TrackerScroll from './TrackerScroll';

import MoveDownResponderAnim from '../animation/MoveDownResponderAnim';

import { MoveUpScaleResponderAnim } from '../animation/MoveUpScaleResponderAnim';

import { commonStyles } from '../styles/common';

import { slideHeight } from './styles/slideStyles';

import { caller } from '../../utils/lang';

const styles = StyleSheet.create({
  bigScroll: {
    flex: 0.65,
  },
  smallScroll: {
    flex: 0.35,
  },
});

export default class Trackers extends PureComponent {
  opacity = new Animated.Value(0);

  moveDown = new MoveDownResponderAnim(slideHeight);

  constructor(props) {
    super(props);
    this.state = {
      swTrackers: new List(),
      scTrackers: new List(),
      swiperEnabled: true,
    };
    this.onCenterSlideTap = ::this.onCenterSlideTap;
    this.onSmallSlideTap = ::this.onSmallSlideTap;
    this.onScaleStart = ::this.onScaleStart;
    this.onScaleMove = ::this.onScaleMove;
    this.onScaleDone = ::this.onScaleDone;
    this.onTap = ::this.onTap;
    this.onRemove = ::this.onRemove;
    this.onEdit = ::this.onEdit;
    this.onSlideChange = ::this.onSlideChange;
  }

  componentWillUnmount() {
    this.moveDown.dispose();
  }

  componentDidMount() {
    const {
      trackers,
      onSwiperMoveDown,
      onSwiperMoveDownStart,
    } = this.props;
    this.renderTracker(trackers.first(),
      () => this.renderTrackers(trackers));

    this.moveDown.subscribe(this.swiper.responder, onSwiperMoveDown,
      () => {
        this.setState({ swiperEnabled: false });
        caller(onSwiperMoveDownStart);
      });
  }

  componentWillReceiveProps({ trackers }) {
    if (this.props.trackers !== trackers) {
      this.renderTrackers(trackers);
    }
  }

  cancelEdit() {
    this.swiper.cancelEdit();
    caller(this.props.onCancel);
  }

  renderTracker(tracker, callback) {
    this.setState({ swTrackers: new List([tracker]) },
      () => Animated.timing(this.opacity, {
        duration: 500,
        toValue: 1,
      }).start(callback),
    );
  }

  renderTrackers(trackers, callback) {
    this.setState({
      swTrackers: trackers,
    });

    this.setTimeout(() => {
      this.setState(
        {
          scTrackers: trackers,
        },
        callback,
      );
    });
  }

  onEdit(tracker: Tracker) {
    this.swiper.showEdit();
    caller(this.props.onEdit, tracker);
  }

  onRemove(tracker: Tracker) {
    caller(this.props.onRemove, tracker);
  }

  onScaleStart() {
    // this.bscroll.hide();
    // this.bscroll.scrollTo(this.swiper.index, false);
    // this.sscroll.scrollTo(this.swiper.index, false);
  }

  onScaleMove(dv) {
    this.bscroll.opacity = 1 - dv;
    this.sscroll.opacity = 1 - dv;
    caller(this.props.onSwiperScaleMove, dv);
  }

  onScaleDone() {
    this.bscroll.show();
    this.sscroll.show();
    this.swiper.hide();
  }

  onTap() {
    if (this.moveDown.in) {
      caller(this.props.onSwiperMoveUpStart);
      this.moveDown.animateOut(() => {
        this.setState({ swiperEnabled: true });
        caller(this.props.onSwiperMoveUpDone);
      });
    }
  }

  onCenterSlideTap(index: number) {
    this.bscroll.hide();
    this.sscroll.hide();
    this.swiper.scrollTo(index, () => this.swiper.show(), false);
  }

  onSmallSlideTap(index: number) {
    this.bscroll.scrollTo(index, true);
    this.sscroll.scrollTo(index, true);
  }

  onSlideChange(index: number, previ: number, animated: boolean) {
    InteractionManager.runAfterInteractions(() => {
      this.bscroll.scrollTo(index, false);
      this.sscroll.scrollTo(index, false);
    });
    caller(this.props.onSlideChange, index, previ, animated);
  }

  render() {
    const { swTrackers, scTrackers, swiperEnabled } = this.state;
    const { style } = this.props;

    const combinedStyle = [
      style,
      this.moveDown.style,
      { opacity: this.opacity },
    ];
    return (
      <Animated.View style={combinedStyle}>
        <TrackerScroll
          ref={(el) => (this.bscroll = el)}
          {...this.props}
          trackers={scTrackers}
          style={styles.bigScroll}
          scale={1 / 1.6}
          onCenterSlideTap={this.onCenterSlideTap}
        />
        <TrackerScroll
          ref={(el) => (this.sscroll = el)}
          trackers={scTrackers}
          style={styles.smallScroll}
          scale={1 / 4}
          responsive={false}
          onSlideTap={this.onSmallSlideTap}
        />
        <TrackerSwiper
          ref={(el) => (this.swiper = el)}
          {...this.props}
          enabled={swiperEnabled}
          trackers={swTrackers}
          style={commonStyles.absFilled}
          onScaleStart={this.onScaleStart}
          onScaleMove={this.onScaleMove}
          onScaleDone={this.onScaleDone}
          onTap={this.onTap}
          onRemove={this.onRemove}
          onEdit={this.onEdit}
          onSlideChange={this.onSlideChange}
        />
      </Animated.View>
    );
  }
}

reactMixin(Trackers.prototype, TimerMixin);
