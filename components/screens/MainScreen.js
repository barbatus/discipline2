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
  NavAcceptButton
} = require('../nav/buttons');

const Screen = require('./Screen');
const TrackerHub = require('../trackers/TrackerHub');
const NewTrackerCell = require('../trackers/NewTrackerCell');

const Tracker = require('../../trackers/Tracker');

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightNavBtn: this._getNewBtn(this._onNewTracker),
      leftNavBtn: this._getMenuBtn(this._onMenuToggle),
      moveXHub: new Animated.Value(0),
      moveXNew: new Animated.Value(0),
      opacityHub: new Animated.Value(1),
      opacityNew: new Animated.Value(1)
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

  // Edit tracker events.

  _cancelTrackerEdit() {
    this.refs.trackers.toggleCurTracker(() => {
      this.setState({
        rightNavBtn: this._getNewBtn(this._onNewTracker),
        leftNavBtn: this._getMenuBtn(this._onMenuToggle)
      });
    });
  }

  _onTrackerEdit() {
    this.refs.trackers.toggleCurTracker(() => {
      this.setState({
        rightNavBtn: this._getAccetpBtn(() => {}),
        leftNavBtn: this._getCancelBtn(
          this._cancelTrackerEdit
        )
      });
    });
  }

  // New tracker events.

  _acceptNewTracker() {
    this.refs.trackers.addTracker(
      new Tracker({
        _id: 'test',
        title: 'New one',
        type: 1,
        iconId: 'marker'
      }), () => {
        this.state.opacityHub.setValue(0);
        this.state.moveXHub.setValue(0);

        Animated.parallel([
          Animated.timing(this.state.opacityHub, {
            toValue: 1
          }),
          Animated.timing(this.state.opacityNew, {
            toValue: 0
          })
        ]).start(() => {
          this.setState({
            rightNavBtn: this._getNewBtn(this._onNewTracker),
            leftNavBtn: this._getMenuBtn(this._onMenuToggle)
          });
        });
      });
  }

  _cancelNewTracker() {
    Animated.parallel([
      Animated.timing(this.state.moveXHub, {
        duration: 1000,
        toValue: 0
      }),
      Animated.timing(this.state.moveXNew, {
        duration: 1000,
        toValue: 0
      }),
    ]).start(() => {
      this.setState({
        rightNavBtn: this._getNewBtn(this._onNewTracker),
        leftNavBtn: this._getMenuBtn(this._onMenuToggle)
      });
    });
  }

  _onNewTracker() {
    this.state.moveXNew.setValue(0);
    this.state.opacityNew.setValue(1);

    Animated.parallel([
      Animated.timing(this.state.moveXHub, {
        duration: 1000,
        toValue: 1
      }),
      Animated.timing(this.state.moveXNew, {
        duration: 1000,
        toValue: 1
      }),
    ]).start(() => {
      this.setState({
        rightNavBtn: this._getAccetpBtn(
          this._acceptNewTracker),
        leftNavBtn: this._getCancelBtn(
          this._cancelNewTracker)
      });
    });
  }

  _onMenuToggle() {
    let { menuActions } = this.context;
    if (menuActions) {
      menuActions.toggle();
    }
  }

  _renderContent() {
    return (
      <View style={styles.root}>
        <Animated.View style={[
            styles.viewContainer, {
              opacity: this.state.opacityHub,
              transform: [{
                  translateX: this.state.moveXHub.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -400]
                })
              }]
            }
          ]}>
          <TrackerHub
            ref='trackers'
            onTrackerEdit={this._onTrackerEdit.bind(this)} />
        </Animated.View>
        <Animated.View style={[
            styles.viewContainer, {
              opacity: this.state.opacityNew,
              transform: [{
                translateX: this.state.moveXNew.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0]
                })
              }]
            }
          ]}>
          <NewTrackerCell ref='newTracker' />
        </Animated.View>
      </View>
    )
  }

  render() {
    let { navigator } = this.props;
    return (
      <Screen
        navigator={navigator}
        title='HabMeter'
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
  },
  viewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }
});

module.exports = MainScreen;
