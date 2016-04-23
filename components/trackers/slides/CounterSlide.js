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

const { trackerStyles } = require('../styles/trackerStyles');
const TrackerSlide = require('./TrackerSlide');

const CounterSlide = React.createClass({
  getInitialState() {
    return {count: 0};
  },

  componentWillMount() {
    this._loadInitialState();
  },

  showEdit(callback) {
    return this.refs.slide.showEdit(callback);
  },

  saveEdit(callback) {
    return this.refs.slide.saveEdit(callback);
  },

  cancelEdit(callback) {
    return this.refs.slide.cancelEdit(callback);
  },

  collapse(callback) {
    this.refs.slide.collapse(callback);
  },

  _loadInitialState: async function() {
    let tracker = this.props.tracker;
    let count = await tracker.getCount();
    this.setState({ count });
  },

  _onPlus: async function() {
    let tracker = this.props.tracker;
    await tracker.click();

    let count = this.state.count;
    this.setState({count: count + 1});
  },

  _onMinus: async function() {
    let count = this.state.count;
    if (count > 0) {
      let tracker = this.props.tracker;
      await tracker.removeLastTick();
      let count = await tracker.getCount();
      this.setState({ count });
    }
  },

  _getControls() {
    return (
      <View style={trackerStyles.controls}>
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
      </View>
    );
  },

  _getFooter() {
    return (
      <Text style={trackerStyles.footerText}>
        Tap to count the thing you've done
      </Text>
    );
  },

  render() {
    return (
      <TrackerSlide
        ref='slide'
        scale={this.props.scale}
        tracker={this.props.tracker}
        controls={this._getControls()}
        footer={this._getFooter()}
        onEdit={this.props.onEdit}
        onRemove={this.props.onRemove} />
    );
  }
});

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  countText: {
    fontSize: 54,
    fontWeight: '300',
    color: '#4A4A4A'
  }
});

module.exports = CounterSlide;
