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
const TrackerCell = require('./TrackerCell');

const GoalTrackerCell = React.createClass({
  getInitialState() {
    return {
      checked: false
    };
  },

  componentWillMount() {
    this._loadInitialState();
  },

  toggleView(callback) {
    this.refs.cell.toggleView(callback);
  },

  _loadInitialState: async function() {
    let tracker = this.props.tracker;
    let checked = await tracker.getChecked();
    this.setState({checked: checked});
  },

  _onCheck: async function() {
    let tracker = this.props.tracker;
    await tracker.addTick();
    this.setState({checked: true});
  },

  _getCheckStyle() {
    return this.state.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  },

  _getControls() {
    return (
      <TouchableOpacity onPress={this._onCheck}>
        <Image
          source={getIcon('check')}
          style={this._getCheckStyle()}
        />
      </TouchableOpacity>
    );
  },

  render() {
    let tracker = this.props.tracker;
    return (
      <TrackerCell
        ref='cell'
        icon={tracker.icon}
        title={tracker.title}
        controls={this._getControls()}
        onEdit={this.props.onEdit} />
    );
  }
});

module.exports = GoalTrackerCell;
