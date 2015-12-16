const React = require('react-native');
const {
  View,
  ListView,
  StyleSheet,
  Component,
  Text
} = React;

const Swiper = require('../swiper/Swiper');
const LinearGradient = require('react-native-linear-gradient');

const GoalTrackerSlide = require('./GoalTrackerSlide');
const CounterSlide = require('./CounterSlide');
const SumTrackerSlide = require('./SumTrackerSlide');

const Trackers = require('../../trackers/Trackers');

const { TrackerType } = require('../../depot/consts');

const { commonStyles } = require('../styles/common');

class TrackerSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackers: []
    };
  }

  componentWillMount() {
    this._loadInitialState();
  }

  get currentTracker() {
    let index = this.refs.swiper.getIndex();
    return this.state.trackers[index];
  }

  showEdit(callback) {
    this.setState({
      scrollEnabled: false
    }, () => {
      let trackerId = this.currentTracker._id;
      this.refs[trackerId].showEdit(callback);
    });
  }

  _onCancelEdit(callback) {
    this.setState({
      scrollEnabled: true
    });
    if (callback) {
      callback();
    }
  }

  saveEdit(callback) {
    let trackerId = this.currentTracker._id;
    return this.refs[trackerId].saveEdit(() => {
      this._onCancelEdit(callback);
    });
  }

  cancelEdit(callback) {
    let trackerId = this.currentTracker._id;
    return this.refs[trackerId].cancelEdit(() => {
      this._onCancelEdit(callback);
    });
  }

  addTracker(tracker, callback) {
    let trackers = this.state.trackers;
    let nextInd = this.refs.swiper.getNextIndex();
    trackers.splice(nextInd, 0, tracker);
    this.setState({
      trackers: trackers
    }, () => {
      this.refs.swiper.scrollTo(1);
      this._onCancelEdit(callback);
    });
  }

  get nextInd() {
    return this.refs.swiper.getNextIndex();
  }

  async removeTracker(callback) {
    let trackerId = this.currentTracker._id;
    await Trackers.remove(this.currentTracker);

    if (callback) {
      callback();
    }

    // TODO: optimize.
    this.refs[trackerId].collapse(() => {
      let index = this.refs.swiper.getIndex();
      let trackers = this.state.trackers
      trackers.splice(index, 1);
      let diff = index > 0 ? -1 : 1;
      this.refs.swiper.scrollTo(diff);
      setTimeout(() => {
        this.setState({
          trackers: trackers,
          scrollEnabled: true
        });
      }, 500);
    });
  }

  async _loadInitialState() {
    let hasTestData = await depot.hasTestData();
    if (!hasTestData) {
      await depot.initTestData();
    }
    let start = time.getDateMs();
    let trackers = await Trackers.getAll();
    this.setState({
      trackers: trackers
    });

    // setTimeout(() => {
    //   this.setState({
    //     trackers: trackers
    //   });
    // });
  }

  _renderTracker(tracker: Object) {
    let type = tracker.type;
    switch (type) {
      case TrackerType.GOAL_TRACKER:
        return (
          <GoalTrackerSlide
            ref={tracker._id}
            key={tracker._id}
            onIconEdit={this.props.onIconEdit}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            tracker={tracker}
          />
        );
      case TrackerType.COUNTER:
        return (
          <CounterSlide
            ref={tracker._id}
            key={tracker._id}
            onIconEdit={this.props.onIconEdit}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            tracker={tracker}
          />
        );
      case TrackerType.SUM:
        return (
          <SumTrackerSlide
            ref={tracker._id}
            key={tracker._id}
            onIconEdit={this.props.onIconEdit}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            tracker={tracker}
          />
        );
    }
  }

  render() {
    let trackerSlides = this.state.trackers.map(
      tracker => {
        return this._renderTracker(tracker);
      });

    let swiperView = (
      <Swiper
        ref='swiper'
        slides={trackerSlides}
        onTouchMove={this.props.onScroll}
        scrollEnabled={this.state.scrollEnabled}
        onSlideChange={this.props.onSlideChange}
        onSlideNoChange={this.props.onSlideNoChange}>
      </Swiper>
    );

    return (
      <View style={[commonStyles.flexFilled, this.props.style]}>
        {swiperView}
      </View>
    );
  }
}

module.exports = TrackerSwiper;
