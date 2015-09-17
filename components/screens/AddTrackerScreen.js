const React = require('react-native');
const {
  StyleSheet,
  View,
  Text,
  Component
} = React;

const { NavBackButton } = require('../nav/buttons');

const Screen = require('./Screen');

class AddTrackerScreen extends Component {
  get leftNavButton() {
    let { navigator } = this.props;
    return (
      <NavBackButton onPress={() => navigator.pop()} />
    );
  }

  render() {
    let { navigator } = this.props;
    return (
      <Screen navigator={navigator}
        title='Add Tracker'
        leftBtn={this.leftNavButton}
        content={<Text />} />         
    );
  }
}

module.exports = AddTrackerScreen;
