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

const GoalTrackerCell = require('./GoalTrackerCell');
const CounterCell = require('./CounterCell');

const Tracker = require('../../trackers/Tracker');

class TrackerHub extends Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.state = {
      trackers: [],
      trackerIndex: 0
    };
  }

  componentDidMount() {
    this._loadInitialState();
  }

  get currentTracker() {
    return this.state.trackers[this.index];
  }

  toggleCurTracker(callback) {
    let trackerId = this.currentTracker._id;
    this.refs[trackerId].toggleView(callback);
  }

  addTracker(tracker, callback) {
    let trackers = this.state.trackers;
    trackers.splice(this.index + 1, 0, tracker);
    this.setState({
      trackers: trackers
    }, () => {
      this.refs.swiper.scrollTo(1);
      if (callback) {
        callback();
      }
    });
  }

  async _loadInitialState() {
    let hasTestData = await depot.hasTestData();
    if (!hasTestData) {
      await depot.initTestData();
    }
    let trackers = await Tracker.getAll();
    this.setState({
      trackers: trackers
    });
  }

  _renderTracker(tracker: Object) {
    let type = tracker.type;
    return type === depot.consts.GOAL_TRACKER ?
      <GoalTrackerCell
        ref={tracker._id}
        key={tracker._id}
        onEdit={this.props.onTrackerEdit}
        tracker={tracker}
      /> :
      <CounterCell
        ref={tracker._id}
        key={tracker._id}
        onEdit={this.props.onTrackerEdit}
        tracker={tracker}
      />;
  }

  _onSlideChange(event, index) {
    this.index = index;

    if (this.props.onTrackerSlideChange) {
      this.props.onTrackerSlideChange(index);
    }
  }

  render() {
    let trackerSlides = this.state.trackers.map(
      tracker => {
        return this._renderTracker(tracker);
      });

    let swiperView = trackerSlides.length ? 
      <Swiper
        ref='swiper'
        index={this.state.trackerIndex}
        onSlideChange={
          this._onSlideChange.bind(this)
        }>
        {trackerSlides}
      </Swiper> : null;

    return (
      <View style={[styles.root, this.props.style]}>
        {swiperView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

module.exports = TrackerHub;
