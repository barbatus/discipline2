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

var GoalTrackerCell = React.createClass({

  getInitialState() {
    return {checked: false};
  },

  componentDidMount: function() {
    this._loadInitialState();
  },

  _loadInitialState: async function() {
    var tracker = this.props.tracker;
    var checked = await tracker.getChecked();
    this.setState({checked: checked});
  },

  _onCheck: async function() {
    var tracker = this.props.tracker;
    await tracker.addTick();
    this.setState({checked: true});
  },

  getBtnStyle: function() {
    return this.state.checked ?
      [trackStyles.checkBtn, trackStyles.filledBtn] :
      trackStyles.checkBtn;
  },

  getControls: function() {
    return (
      <TouchableOpacity onPress={this._onCheck}>
        <Image
          source={getIcon('check')}
          style={this.getBtnStyle()}
        />
      </TouchableOpacity>
    );
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
});

module.exports = GoalTrackerCell;
