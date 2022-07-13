/* eslint react/no-unused-state: 0 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Animated,
  InteractionManager,
} from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
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
import { SLIDE_HEIGHT } from './styles/slideStyles';

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
    onSwiperMoveDownCancel: PropTypes.func,
    onSwiperScaleMove: PropTypes.func,
    onSwiperScaleDone: PropTypes.func,
    onSwiperMoveUpStart: PropTypes.func,
    onSwiperMoveUpDone: PropTypes.func,
    onSwiperMoveDownDone: PropTypes.func,
    onSwiperShown: PropTypes.func,
    onSlideChange: PropTypes.func,
    trackers: PropTypes.instanceOf(List).isRequired,
    style: ViewPropTypes.style,
    metric: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onEdit: null,
    onRemove: null,
    onCancel: null,
    onSwiperMoveDown: null,
    onSwiperMoveDownStart: null,
    onSwiperMoveDownCancel: null,
    onSwiperScaleMove: null,
    onSwiperScaleDone: null,
    onSwiperMoveUpStart: null,
    onSwiperMoveUpDone: null,
    onSwiperMoveDownDone: null,
    onSwiperShown: null,
    onSlideChange: null,
    style: null,
  };

  opacity = new Animated.Value(0);

  moveDown = new MoveDownResponderAnim(SLIDE_HEIGHT);

  bscroll = React.createRef();

  sscroll = React.createRef();

  swiper = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      swTrackers: [],
      scTrackers: [],
      swiperEnabled: true,
      searchView: false,
      trackers: props.trackers,
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

  componentDidMount() {
    this.handleMoveDown();

    const { trackers } = this.state;
    this.renderInitial(trackers);
  }

  static getDerivedStateFromProps({ trackers }, state) {
    if (trackers !== state.trackers) {
      const arr = trackers.toArray();
      return state.searchView ?
        { trackers, scTrackers: arr } : { trackers, swTrackers: arr };
    }
    return null;
  }

  componentWillUnmount() {
    this.moveDown.dispose();
  }

  onEdit(tracker: Tracker) {
    this.swiper.current.showEdit(() => caller(this.props.onEdit, tracker));
  }

  onRemove(tracker: Tracker) {
    caller(this.props.onRemove, tracker);
  }

  onScaleStart() {
    this.renderSearchTrackers(this.props.trackers);
  }

  onScaleMove(dv) {
    this.bscroll.current.opacity = 1 - dv;
    this.sscroll.current.opacity = 1 - dv;
    caller(this.props.onSwiperScaleMove, dv);
  }

  onScaleDone() {
    window.requestAnimationFrame(() => this.setState({ searchView: true }));
    this.bscroll.current.show();
    this.sscroll.current.show();
    this.swiper.current.hide();
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
    this.setState({ searchView: false });
    // Scroll, show, update w/o flicking.
    this.bscroll.current.hide();
    this.sscroll.current.hide();
    this.swiper.current.scrollTo(index, () => (
      this.swiper.current.show(() => {
        this.renderTrackers(this.props.trackers);
        caller(this.props.onSwiperShown);
      })
    ), false);
  }

  onSmallSlideTap(index: number) {
    this.bscroll.current.scrollTo(index, true);
    this.sscroll.current.scrollTo(index, true);
  }

  onSlideChange(index: number, previ: number, animated: boolean) {
    // Don't hinder any animation.
    InteractionManager.runAfterInteractions(() => {
      this.bscroll.current.scrollTo(index, false);
      this.sscroll.current.scrollTo(index, false);
    });
    caller(this.props.onSlideChange, index, previ, animated);
  }

  cancelEdit(callback) {
    this.swiper.current.cancelEdit(callback);
    caller(this.props.onCancel);
  }

  handleMoveDown() {
    const {
      onSwiperMoveDown,
      onSwiperMoveDownStart,
      onSwiperMoveDownDone,
      onSwiperMoveDownCancel,
    } = this.props;
    this.moveDown.subscribe(this.swiper.current.responder,
      onSwiperMoveDown,
      onSwiperMoveDownStart,
      () => {
        this.setState({ swiperEnabled: false });
        caller(onSwiperMoveDownDone);
      },
      onSwiperMoveDownCancel,
    );
  }

  unhandleMoveDown() {
    this.moveDown.unsubscribe();
  }

  show(callback) {
    Animated.timing(this.opacity, {
      duration: 500,
      toValue: 1,
      useNativeDriver: true,
    }).start(callback);
  }

  renderInitial(trackers) {
    if (trackers.size) {
      this.renderTracker(trackers.first(), () => {
        this.renderTrackers(trackers);
        InteractionManager.runAfterInteractions(
          () => this.renderSearchTrackers(trackers));
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
    const { swTrackers, scTrackers, swiperEnabled, searchView } = this.state;
    const { style } = this.props;

    const combinedStyle = [
      style,
      this.moveDown.style,
      { opacity: this.opacity },
    ];
    return (
      <Animated.View style={combinedStyle}>
        <TrackerScroll
          {...this.props}
          ref={this.bscroll}
          trackers={scTrackers}
          style={styles.bigScroll}
          scale={5 / 8}
          shown={searchView}
          onSlideTap={this.onSmallSlideTap}
          onCenterSlideTap={this.onCenterSlideTap}
        />
        <TrackerScroll
          {...this.props}
          ref={this.sscroll}
          trackers={scTrackers}
          style={styles.smallScroll}
          scale={1 / 4}
          responsive={false}
          shown={searchView}
          onSlideTap={this.onSmallSlideTap}
        />
        <TrackerSwiper
          {...this.props}
          ref={this.swiper}
          enabled={swiperEnabled}
          trackers={swTrackers}
          style={commonStyles.absFilled}
          shown={!searchView}
          onScaleStart={this.onScaleStart}
          onScaleCancel={this.onScaleDone}
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
