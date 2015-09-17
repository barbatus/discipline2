const React = require('react-native');
const {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Component
} = React;

const {
  NavAddButton,
  NavMenuButton
} = require('../nav/buttons');

const Screen = require('./Screen');
const AddTrackerScreen = require('./AddTrackerScreen');
const TrackerHub = require('../trackers/TrackerHub');

class MainScreen extends Component {
  getInitialState() {
    return null;
  }

  get rightNavButton() {
    let { navigator } = this.props;
    return (
      <NavAddButton
        onPress={() => navigator.push({
          component: AddTrackerScreen
        })} />
    );
  }

  get leftNavButton() {
    let { menuActions } = this.props;
    return (
      <NavMenuButton
        onPress={() => {
          if (menuActions) menuActions.toggle();
        }} />
    );
  }

  render() {
    let { navigator } = this.props;
    return (
      <Screen 
          navigator={navigator}
          title='HabMeter'
          leftBtn={this.leftNavButton}
          rightBtn={this.rightNavButton}
          content={
            <TrackerHub navigator={navigator} />
          } />
    );
  }
};

module.exports = MainScreen;
