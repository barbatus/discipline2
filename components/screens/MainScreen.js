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

const TrackerHub = require('../trackers/TrackerHub');
const NewTrackerCell = require('../trackers/NewTrackerCell');
const TrackerTypesCell = require('../trackers/TrackerTypesCell');

const IconsDlg = require('./IconsDlg');

const Tracker = require('../../trackers/Tracker');

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this._trackerIndex = 0;
    this.state = {
      navTitle: 'Trackers',
      rightNavBtn: this._getNewBtn(this._onNewTracker),
      leftNavBtn: this._getMenuBtn(this._onMenuToggle)
    };
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

  _getCancelBtn(onPress) {
    return (
      <NavCancelButton onPress={onPress.bind(this)} />
    );
  }

  _getAccetpBtn(onPress) {
    return (
      <NavAcceptButton onPress={onPress.bind(this)} />
    );
  }

  _getBackBtn(onPress) {
    return (
      <NavBackButton onPress={onPress.bind(this)} />
    );
  }

  _setMainViewBtns() {
    this.setState({
      navTitle: 'Trackers',
      rightNavBtn: this._getNewBtn(this._onNewTracker),
      leftNavBtn: this._getMenuBtn(this._onMenuToggle)
    });
  }

  _setNewTrackerBtns() {
    this.setState({
      navTitle: 'Add New Tracker',
      rightNavBtn: this._getAccetpBtn(this._acceptNewTracker),
      leftNavBtn: this._getCancelBtn(this._cancelNewTracker)
    });
  }

  _setEditTrackerBtns() {
    this.setState({
      navTitle: 'Edit Tracker',
      rightNavBtn: this._getAccetpBtn(() => {}),
      leftNavBtn: this._getCancelBtn(this._cancelTrackerEdit)
    });
  }

  _setChoseTypeBtns() {
    this.setState({
      navTitle: 'Choose Tracker Type',
      rightNavBtn: <View />,
      leftNavBtn: this._getBackBtn(this._onTypeChosen)
    });
  }

  _onSlideChange(index) {
    this._trackerIndex = index;
  }

  // Tracker edit events.

  _onTypeClick() {
    this._moveToLeft(this.newTrackerView, this.trackTypesView,
      this._setChoseTypeBtns.bind(this));
  }

  _onTypeChosen() {
    this.setState({
      newTrackerType: this.refs.trackerTypesCell.chosenType
    }, () => {
      this._moveToRight(this.newTrackerView, this.trackTypesView,
        this._setNewTrackerBtns.bind(this));
    });
  }

  _onIconEdit() {
    this.refs.iconDlg.show();    
  }

  // Edit tracker events.

  _cancelTrackerEdit() {
    this.refs.trackers.toggleTracker(
      this._setMainViewBtns.bind(this));
  }

  _onTrackerEdit() {
    this.refs.trackers.toggleTracker(
      this._setEditTrackerBtns.bind(this));
  }

  // New tracker events.

  async _acceptNewTracker() {
    let tracker = this.refs.newTrackerCell.tracker;

    tracker = await Tracker.addAt(
      tracker, this._trackerIndex + 1);

    this.refs.trackers.addTracker(tracker, () => {
        this.trackersView.opacity.setValue(0);
        this.trackersView.posX.setValue(0);

        this._exchangeViews(this.trackersView, this.newTrackerView,
          this._setMainViewBtns.bind(this));
      });
  }

  _cancelNewTracker() {
    this._moveToRight(this.trackersView, this.newTrackerView,
      this._setMainViewBtns.bind(this));
  }

  _onNewTracker() {
    this._moveToLeft(this.trackersView, this.newTrackerView,
      this._setNewTrackerBtns.bind(this));
  }

  // Common

  _moveToLeft(view1, view2, callback) {
    view2.posX.setValue(1);
    view2.opacity.setValue(1);

    Animated.parallel([
      Animated.timing(view1.posX, {
        duration: 1000,
        toValue: -1
      }),
      Animated.timing(view2.posX, {
        duration: 1000,
        toValue: 0
      }),
    ]).start(() => {
      if (callback) {
        callback();
      }
    });
  }

  _moveToRight(view1, view2, callback) {
    view1.posX.setValue(-1);
    view1.opacity.setValue(1);

    Animated.parallel([
      Animated.timing(view1.posX, {
        duration: 1000,
        toValue: 0
      }),
      Animated.timing(view2.posX, {
        duration: 1000,
        toValue: 1
      }),
    ]).start(() => {
      if (callback) {
        callback();
      }
    });
  }

  _exchangeViews(view1, view2, callback) {
    Animated.parallel([
      Animated.timing(view1.opacity, {
        toValue: 1
      }),
      Animated.timing(view2.opacity, {
        toValue: 0
      })
    ]).start(() => {
      if (callback) {
        callback();
      }
    });
  }

  _onMenuToggle() {
    let { menuActions } = this.context;
    if (menuActions) {
      menuActions.toggle();
    }
  }

  get trackersView() {
    return this.refs.trackersView;
  }

  get newTrackerView() {
    return this.refs.newTrackerView;
  }

  get trackTypesView() {
    return this.refs.trackerTypesView;
  }

  _renderContent() {
    return (
      <View style={styles.root}>
        <ScreenView
          ref='trackersView'
          posX={0}
          content={
            <TrackerHub
              ref='trackers'
              onIconEdit={this._onIconEdit.bind(this)}
              onTrackerSlideChange={this._onSlideChange.bind(this)}
              onTrackerEdit={this._onTrackerEdit.bind(this)} />
          } />

        <ScreenView
          ref='newTrackerView'
          posX={1}
          content={
            <NewTrackerCell
              ref='newTrackerCell'
              onIconEdit={this._onIconEdit.bind(this)}
              trackerType={this.state.newTrackerType}
              onTypeClick={this._onTypeClick.bind(this)} />
          } />

        <ScreenView
          ref='trackerTypesView'
          posX={1}
          content={
            <TrackerTypesCell
              ref='trackerTypesCell' />
          } />

        <IconsDlg ref='iconDlg' />
      </View>
    );
  }

  render() {
    let { navigator } = this.props;
    return (
      <Screen
        navigator={navigator}
        navTitle={this.state.navTitle}
        leftBtn={this.state.leftNavBtn}
        rightBtn={this.state.rightNavBtn}
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
