'use strict';

const React = require('react-native');
const {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet
} = React;

const { trackerDef, trackerStyles } = require('./trackerStyles');
const TrackerSlide = require('./TrackerSlide');

const SumTrackerSlide = React.createClass({
  getInitialState() {
    return {
      iconId: this.props.tracker.iconId,
      title: this.props.tracker.title,
      sum: 0
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
    let sum = await tracker.getValue();
    this.setState({ sum });
  },

  _getCheckStyle() {
    return this.state.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  },

  _onPlus: async function() {
    let tracker = this.props.tracker;
    let added = parseFloat(this.state.added);
    await tracker.click(added);
    let sum = await tracker.getValue();
    this.setState({sum: sum, added: ''});
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
              keyboardType={'numeric'}
              style={styles.sumInput}
              onChangeText={added => this._onChangeText(added)}
              value={this.state.added}
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
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    paddingBottom: 20
  },
  sumInput: {
    flex: 0.8,
    marginRight: 40,
    fontSize: 46,
    color: '#4A4A4A',
    textAlign: 'right',
    fontWeight: '100'
  },
  circleBtnSm: {
    flex: 0.2
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
