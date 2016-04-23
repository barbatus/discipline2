'use strict';

const React = require('react-native');
const {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  DeviceEventEmitter
} = React;

const TimerMixin = require('react-timer-mixin');

const {
  trackerDef,
  trackerStyles
} = require('../styles/trackerStyles');
const TrackerSlide = require('./TrackerSlide');

const SumTrackerSlide = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    this._summing = false;

    return {
      iconId: this.props.tracker.iconId,
      title: this.props.tracker.title,
      sum: 0
    };
  },

  componentWillMount() {
    this._loadInitialState();
    DeviceEventEmitter.addListener(
      'keyboardWillHide', this._keyboardWillHide);
  },

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      'keyboardWillHide', this._keyboardWillHide);
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
    let sum = await tracker.getValue();
    this.setState({ sum });
  },

  _getCheckStyle() {
    return this.state.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  },

  _onPlus: function() {
    this.refs.added.blur();
    this._summing = true;
  },

  _keyboardWillHide: async function() {
    if (this._summing) {
      let tracker = this.props.tracker;
      let added = parseFloat(this.state.added);
      await tracker.click(added);
      let sum = await tracker.getValue();
      this.setState({sum: sum, added: ''});
      this._summing = false;
    }
  },

  _onChangeText(sumAdded) {
    this.setState({added: sumAdded});
  },

  _getControls() {
    return (
      <View style={[trackerStyles.controls, styles.controlsContainer]}>
        <View style={styles.controls}>
          <View style={styles.inputContainer}>
             <TextInput
              ref='added'
              placeholder='Enter value'
              style={styles.sumInput}
              onChangeText={added => this._onChangeText(added)}
              value={this.state.added}
              onSubmitEditing={this._onPlus}
            />
            <TouchableOpacity onPress={this._onPlus}>
              <Image
                source={getIcon('plus_sm')}
                style={[trackerStyles.circleBtnSm, styles.circleBtnSm]} />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sumText}>=</Text>
            <Text style={styles.sumText}>
              $ {this.state.sum}
            </Text>
          </View>
        </View>
      </View>
    );
  },

  _getFooter() {
    return (
      <Text style={trackerStyles.footerText}>
        Shake to undo
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

const width = trackerDef.container.width - 40;

const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 25
  },
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    paddingBottom: 20
  },
  sumInput: {
    height: 50,
    width: width - 40,
    paddingRight: 20,
    fontSize: 42,
    color: '#4A4A4A',
    textAlign: 'right',
    fontWeight: '100'
  },
  circleBtnSm: {
    width: 40
  },
  textContainer: {
    flex: 0.3,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8
  },
  sumText: {
    fontSize: 34,
    color: '#9B9B9B',
    fontWeight: '300'
  }
});

module.exports = SumTrackerSlide;
