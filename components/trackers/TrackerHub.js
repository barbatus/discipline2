const React = require('react-native');
const {
  View,
  ListView,
  StyleSheet,
  Component,
  Text
} = React;

const TrackerScreen = require('../screens/TrackerScreen');
const Swiper = require('../swiper/Swiper');
var LinearGradient = require('react-native-linear-gradient');

const GoalTrackerCell = require('./GoalTrackerCell');
const CounterCell = require('./CounterCell');

var Trackers = require('../../trackers/Trackers');

class TrackerHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackers: [],
      colorBottom: '#E97490',
      colorTop: '#FBDDB7'
    };
    this.swiperDirection = 1;
    this.colors = [{
      colorBottom: '#E97490',
      colorTop: '#FBDDB7'
    }, {
      colorBottom: '#FBDDB7',
      colorTop: '#FFA878'
    }, {
      colorBottom: '#FA9E72',
      colorTop: '#9FC1E7'
    }, {
      colorBottom: '#96BAEF',
      colorTop: '#B454A6'
    }, {
      colorBottom: '#BA4699',
      colorTop: '#E68C7D'
    }];
  }

  componentDidMount() {
    this._loadInitialState();
  }

  async _loadInitialState() {
    var hasTestData = await depot.hasTestData();
    if (!hasTestData) {
      await depot.initTestData();
    }
    var trackers = await Trackers.getAll();
    this.setState({
      trackers: trackers
    });
  }

  renderTracker(tracker: Object) {
    var type = tracker.type;
    return type == depot.consts.GOAL_TRACKER ? 
        <GoalTrackerCell
          key={tracker.id}
          onSelect={() => this.selectTracker(tracker)}
          tracker={tracker}
        /> :
        <CounterCell
          key={tracker.id}
          onSelect={() => this.selectTracker(tracker)}
          tracker={tracker}
        />;
  }

  renderTrackSlide(tracker: Object) {
    return (
      <View style={styles.slide}>
        {this.renderTracker(tracker)}
      </View>
    );
  }

  selectTracker(tracker: Object) {
    this.props.navigator.push({
      title: tracker.title,
      component: TrackerScreen,
      passProps: {tracker}
    });
  }

  _onSlide(event, swiper) {
    var inc = swiper.state.inc;
    var index = swiper.state.index;
    var total = swiper.state.total;
    var offset = swiper.state.offset;

    var color = this.colors[(index + inc) % this.colors.length];
    this.setState({
      colorTop: color.colorTop,
      colorBottom: color.colorBottom
    });
  }

  render() {
    var trackerSlides = this.state.trackers.map((tracker) => {
      return this.renderTrackSlide(tracker);
    });

    var swiperView = trackerSlides.length ? 
      <Swiper showsButtons={false} loop={false}
        onMomentumScrollBegin={(event, state, swiper) => {this._onSlide(event, swiper)}}>
        {trackerSlides}
      </Swiper> : <View />;

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[this.state.colorTop, this.state.colorBottom]}
          style={styles.gradient} />
        {swiperView}
      </View>
    );
  }
}

// TODO: create absolute style helper.
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  slide: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: 'center'
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  }
});

module.exports = TrackerHub;
