'use strict';

const React = require('react-native');
const {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Component,
  Animated
} = React;

const {
  NavAddButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton,
  NavBackButton
} = require('../nav/buttons');

const Screen = require('./Screen');
const ScreenView = require('./ScreenView');

const TrackersView = require('./TrackersView');

const NewTrackerView = require('./NewTrackerView');

const IconsDlg = require('./IconsDlg');

const Trackers = require('../../trackers/Trackers');

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this._slideIndex = 0;

    this.state = {};
  }

  componentDidMount() {
    this._setMainViewBtns();
  }

  _getNewBtn(onPress) {
    return (
      <NavAddButton onPress={onPress.bind(this)} />
    );
  }

  _getMenuBtn(onPress) {
    return (
      <NavMenuButton onPress={onPress.bind(this)} />
    );
  }

  _setMainViewBtns() {
    let navBar = this.refs.screen.navBar;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this._getMenuBtn(this._onMenuToggle),
        this._getNewBtn(this._onNewTracker));
    }
  }

  // Edit tracker events.

  _cancelTrackerEdit() {
    this._setMainViewBtns();
  }

  _saveTrackerEdit() {
    this._setMainViewBtns();
  }

  // New tracker events.

  async _onAccept(tracker) {
    tracker = await Trackers.addAt(
      tracker, this._slideIndex + 1);

    this._setMainViewBtns();

    this.trackersView.addTracker(tracker, () => {
      this.trackersView.setOpacity(0, false);
      this.trackersView.moveRight(true);
      this.newTrackerView.setOpacity(0, true);
      this.trackersView.setOpacity(1, true);
    });
  }

  _cancelNewTracker() {
    this._setMainViewBtns();
    this._moveToRight(this.trackersView, this.newTrackerView);
  }

  _onNewTracker() {
    this._moveToLeft(this.trackersView, this.newTrackerView);
  }

  // Common

  _moveToLeft(view1, view2, callback) {
    view1.moveLeft();
    view2.moveLeft(callback);
  }

  _moveToRight(view1, view2, callback) {
    view2.moveRight();
    view1.moveRight(callback);
  }

  _onMenuToggle() {
    let { menuActions } = this.context;
    if (menuActions) {
      menuActions.toggle();
    }
  }

  _onSlideChange(index) {
    this._slideIndex = index;
  }

  get trackersView() {
    return this.refs.trackersView;
  }

  get newTrackerView() {
    return this.refs.newTrackerView;
  }

  _renderContent() {
    return (
      <View style={styles.root}>
        <TrackersView
          ref='trackersView'
          posX={0}
          onSlideChange={this._onSlideChange.bind(this)}
          onSave={this._saveTrackerEdit.bind(this)}
          onCancel={this._cancelTrackerEdit.bind(this)} />

        <NewTrackerView
          ref='newTrackerView'
          posX={1}
          onAccept={this._onAccept.bind(this)}
          onCancel={this._cancelNewTracker.bind(this)} />
      </View>
    );
  }

  render() {
    let { navigator } = this.props;

    return (
      <Screen
        ref='screen'
        navigator={navigator}
        content={this._renderContent()} />
    );
  }
};

MainScreen.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

module.exports = MainScreen;
