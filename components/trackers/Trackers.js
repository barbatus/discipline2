import React, { PureComponent } from 'react';
import { View, StyleSheet, Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import { List } from 'immutable';

import { caller } from 'app/utils/lang';
import Tracker from 'app/model/Tracker';

import TrackerSwiper from './TrackerSwiper';
import TrackerScroll from './TrackerScroll';
import MoveDownResponderAnim from '../animation/MoveDownResponderAnim';
import { commonStyles } from '../styles/common';
import { slideHeight } from './styles/slideStyles';

const styles = StyleSheet.create({
  bigScroll: {
    flex: 0.65,
  },
  smallScroll: {
    flex: 0.35,
  },
});

export default class Trackers extends PureComponent {
  static propTypes = {
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onCancel: PropTypes.func,
    onSwiperMoveDown: PropTypes.func,
    onSwiperMoveDownStart: PropTypes.func,
    onSwiperScaleMove: PropTypes.func,
    onSwiperScaleDone: PropTypes.func,
    onSwiperMoveUpStart: PropTypes.func,
    onSwiperMoveUpDone: PropTypes.func,
    onSwiperShown: PropTypes.func,
    onSlideChange: PropTypes.func,
    trackers: PropTypes.instanceOf(List).isRequired,
    style: View.propTypes.style,
  };

  static defaultProps = {
    onEdit: null,
    onRemove: null,
    onCancel: null,
    onSwiperMoveDown: null,
    onSwiperMoveDownStart: null,
    onSwiperScaleMove: null,
    onSwiperScaleDone: null,
    onSwiperMoveUpStart: null,
    onSwiperMoveUpDone: null,
    onSwiperShown: null,
    onSlideChange: null,
    style: null,
  };

  opacity = new Animated.Value(0);
  moveDown = new MoveDownResponderAnim(slideHeight);

  rendered = false;
  scaleStart = false;
  searchView = false;

  constructor(props) {
    super(props);
    this.state = {
      swTrackers: [],
      scTrackers: [],
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
    this.onSwiperBeginDrag = ::this.onSwiperBeginDrag;
    this.onSwiperEndDrag = ::this.onSwiperEndDrag;
  }

  componentDidMount() {
    this.handleMoveDown();
  }

  componentWillReceiveProps({ trackers }) {
    // Don't rerender when scaling.
    if (this.scaleStart) { return; }

    if (this.props.trackers !== trackers) {
      if (!this.rendered) {
        this.renderInitial(trackers);
        this.rendered = true;
        return;
      }

      if (this.searchView) {
        this.renderSearchTrackers(trackers);
        return;
      }
      this.renderTrackers(trackers);
    }
  }

  componentWillUnmount() {
    this.moveDown.dispose();
  }

  onEdit(tracker: Tracker) {
    this.swiper.showEdit();
    caller(this.props.onEdit, tracker);
  }

  onRemove(tracker: Tracker) {
    caller(this.props.onRemove, tracker);
  }

  onScaleStart() {
    this.scaleStart = true;
  }

  onScaleMove(dv) {
    this.bscroll.opacity = 1 - dv;
    this.sscroll.opacity = 1 - dv;
    caller(this.props.onSwiperScaleMove, dv);
  }

  onScaleDone() {
    this.searchView = true;
    this.scaleStart = false;
    this.renderSearchTrackers(this.props.trackers);
    this.bscroll.show();
    this.sscroll.show();
    this.swiper.hide();
    caller(this.props.onSwiperScaleDone);
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
    this.searchView = false;
    // Scroll, show, update w/o flicking.
    this.bscroll.hide();
    this.sscroll.hide();
    this.swiper.scrollTo(index, () =>
      this.swiper.show(() => {
        InteractionManager.runAfterInteractions(() =>
          this.renderTrackers(this.props.trackers));
        caller(this.props.onSwiperShown);
      }), false);
  }

  onSmallSlideTap(index: number) {
    this.bscroll.scrollTo(index, true);
    this.sscroll.scrollTo(index, true);
  }

  onSlideChange(index: number, previ: number, animated: boolean) {
    // Don't hinder any animation.
    InteractionManager.runAfterInteractions(() => {
      this.bscroll.scrollTo(index, false);
      this.sscroll.scrollTo(index, false);
    });
    caller(this.props.onSlideChange, index, previ, animated);
  }

  onSwiperBeginDrag() {
    this.unhandleMoveDown();
  }

  onSwiperEndDrag() {
    this.handleMoveDown();
  }

  cancelEdit() {
    this.swiper.cancelEdit();
    caller(this.props.onCancel);
  }

  handleMoveDown() {
    const {
      onSwiperMoveDown,
      onSwiperMoveDownStart,
    } = this.props;
    this.moveDown.subscribe(this.swiper.responder,
      onSwiperMoveDown, onSwiperMoveDownStart,
      () => this.setState({ swiperEnabled: false }));
  }

  unhandleMoveDown() {
    this.moveDown.unsubscribe();
  }

  show(callback) {
    Animated.timing(this.opacity, {
      duration: 500,
      toValue: 1,
    }).start(callback);
  }

  renderInitial(trackers) {
    if (trackers.size) {
      this.renderTracker(trackers.first(), () => {
        this.renderTrackers(trackers);
        this.setTimeout(() => this.renderSearchTrackers(trackers));
      });
    } else {
      this.show();
    }
  }

  renderTracker(tracker, callback) {
    this.setState({ swTrackers: [tracker] }, () => this.show(callback));
  }

  renderTrackers(trackers, callback: Function) {
    this.setState({
      swTrackers: trackers.toArray(),
    }, callback);
  }

  renderSearchTrackers(trackers, callback: Function) {
    this.setState({
      scTrackers: trackers.toArray(),
    }, callback);
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
          scale={5 / 8}
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
          {...this.props}
          ref={(el) => (this.swiper = el)}
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
          onBeginDrag={this.onSwiperBeginDrag}
          onEndDrag={this.onSwiperEndDrag}
        />
      </Animated.View>
    );
  }
}

reactMixin(Trackers.prototype, TimerMixin);
