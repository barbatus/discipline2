const React = require('react-native');
const {
  TouchableOpacity,
  Text,
  Image,
  Component
} = React;

const styles = require('./styles');

class NavAddButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Add
        </Text>
      </TouchableOpacity>
    );
  }
}

class NavBackButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.navBarLeftButton}>
        <Image source={require('image!back')}
          style={styles.navBarIcon} />
      </TouchableOpacity>
    );
  }
}

class NavMenuButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.navBarLeftButton}>
        <Image source={require('image!menu')}
          style={styles.navBarIcon} />
      </TouchableOpacity>
    );
  }
}

module.exports = { NavAddButton, NavBackButton, NavMenuButton };
