const React = require('react-native');
const Dimensions = require('Dimensions');
const {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Component
} = React;

const window = Dimensions.get('window');

class Menu extends Component {
  render() {
    return (
      <ScrollView style={styles.menu}>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20
  }
});

module.exports = Menu;
