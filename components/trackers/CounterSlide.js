'use strict';

const React = require('react-native');
const {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} = React;

const { trackerStyles } = require('./trackerStyles');
const TrackerSlide = require('./TrackerSlide');

const CounterSlide = React.createClass({
  getInitialState() {
    return {count: 0};
  },

  componentWillMount() {
    this._loadInitialState();
  },

  showEdit(callback) {
    this.refs.slide.showEdit(callback);
  },

  saveEdit(callback) {
    this.refs.slide.saveEdit(callback);
  },

  cancelEdit(callback) {
    this.refs.slide.cancelEdit(callback);
  },

  _loadInitialState: async function() {
    var tracker = this.props.tracker;
    var count = await tracker.getCount();
    this.setState({count: count});
  },

  _onPlus: async function() {
    var tracker = this.props.tracker;
    await tracker.click();

    var count = this.state.count;
    this.setState({count: count + 1});
  },

  _onMinus() {
    var count = this.state.count;
    if (count > 0) {
      this.setState({count: count - 1});
    }
  },

  _getControls() {
    return (
      <View style={styles.controls}>
        <TouchableOpacity onPress={this._onMinus}>
          <Image
            source={getIcon('minus')}
            style={trackerStyles.circleBtn}
          />
        </TouchableOpacity>
        <Text style={styles.countText} numberOfLines={1}>
          {this.state.count}
        </Text>
        <TouchableOpacity onPress={this._onPlus}>
          <Image
            source={getIcon('plus')}
            style={trackerStyles.circleBtn}
          />
        </TouchableOpacity>
      </View>
    );
  },

  render() {
    return (
      <TrackerSlide
        ref='slide'
        tracker={this.props.tracker}
        controls={this._getControls()}
        onIconEdit={this.props.onIconEdit}
        onEdit={this.props.onEdit} />
    );
  }
});

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  countText: {
    fontSize: 54,
    fontWeight: '300',
    color: '#4A4A4A'
  }
});

module.exports = CounterSlide;
