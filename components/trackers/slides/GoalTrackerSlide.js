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
    let checked = await tracker.getChecked();
    this.setState({ checked });
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
      <View style={trackerStyles.controls}>
        <TouchableOpacity onPress={this._onCheck}>
          <Image
            source={getIcon('check')}
            style={this._getCheckStyle()}
          />
        </TouchableOpacity>
      </View>
    );
  },

  _getFooter() {
    return (
      <Text style={trackerStyles.footerText}>
        Tap when you've reached the goal
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

module.exports = GoalTrackerSlide;
