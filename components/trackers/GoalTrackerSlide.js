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

const GoalTrackerSlide = React.createClass({
  getInitialState() {
    return {
      iconId: this.props.tracker.iconId,
      title: this.props.tracker.title,
      checked: false
    };
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
    return (
      <TrackerSlide
        ref='slide'
        tracker={this.props.tracker}
        controls={this._getControls()}
        onEdit={this.props.onEdit} />
    );
  }
});

module.exports = GoalTrackerSlide;