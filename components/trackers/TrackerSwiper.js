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

const Trackers = require('../../trackers/Trackers');

const { TrackerType } = require('../../depot/consts');

class TrackerSwiper extends Component {
  constructor(props) {
    super(props);
    this._trackerIndex = 0;
    this.state = {
      trackers: []
    };
  }

  componentWillMount() {
    this._loadInitialState();
  }

  get currentTracker() {
    return this.state.trackers[this._trackerIndex];
  }

  showEdit(callback) {
    let trackerId = this.currentTracker._id;
    this.refs[trackerId].showEdit(callback);
  }

  saveEdit(callback) {
    let trackerId = this.currentTracker._id;
    this.refs[trackerId].saveEdit(callback);
  }

  cancelEdit(callback) {
    let trackerId = this.currentTracker._id;
    this.refs[trackerId].cancelEdit(callback);
  }

  addTracker(tracker, callback) {
    let trackers = this.state.trackers;
    trackers.splice(this._trackerIndex + 1, 0, tracker);
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
    return type === TrackerType.GOAL_TRACKER ?
      <GoalTrackerSlide
        ref={tracker._id}
        key={tracker._id}
        onIconEdit={this.props.onIconEdit}
        onEdit={this.props.onEdit}
        tracker={tracker}
      /> :
      <CounterSlide
        ref={tracker._id}
        key={tracker._id}
        onIconEdit={this.props.onIconEdit}
        onEdit={this.props.onEdit}
        tracker={tracker}
      />;
  }

  _onSlideChange(event, index) {
    this._trackerIndex = index;

    if (this.props.onSlideChange) {
      this.props.onSlideChange(index);
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
        //index={this.state.trackerIndex}
        onSlideChange={this._onSlideChange.bind(this)}>
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

module.exports = TrackerSwiper;
