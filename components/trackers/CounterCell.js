'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} = React;

var trackStyles = require('./trackStyles');
var TrackerCell = require('./TrackerCell');

var CounterCell = React.createClass({

  getInitialState() {
    return {count: 0};
  },

  componentDidMount: function() {
    this._loadInitialState();
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

  _onMinus: function() {
    var count = this.state.count;
    if (count > 0) {
      this.setState({count: count - 1});
    }
  },

  getControls: function() {
    return [
      <TouchableOpacity onPress={this._onMinus}>
        <Image
          source={getIcon('minus')}
          style={trackStyles.circleBtn}
        />
      </TouchableOpacity>,
      <Text style={styles.countText} numberOfLines={1}>
        {this.state.count}
      </Text>,
      <TouchableOpacity onPress={this._onPlus}>
        <Image
          source={getIcon('plus')}
          style={trackStyles.circleBtn}
        />
      </TouchableOpacity>
    ];
  },

  render: function() {
    var tracker = this.props.tracker;
    return (
      <TrackerCell icon={tracker.icon} title={tracker.title}
        controls={this.getControls()} />
    );
  }
});

var styles = StyleSheet.create({
  countText: {
    fontSize: 54,
    fontWeight: '300',
    color: '#4A4A4A'
  }
});

module.exports = CounterCell;
