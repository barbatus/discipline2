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
        <Image source={getIcon('new')}
          style={styles.navBarIcon} />
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
        <Image source={getIcon('back')}
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
        <Image source={getIcon('menu')}
          style={[styles.navBarIcon, styles.menuIcon]} />
      </TouchableOpacity>
    );
  }
}

class NavCancelButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.navBarLeftButton}>
        <Image source={getIcon('cancel')}
          style={styles.navBarIcon} />
      </TouchableOpacity>
    );
  }
}

class NavAcceptButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.navBarRightButton}>
        <Image source={getIcon('accept')}
          style={styles.navBarIcon} />
      </TouchableOpacity>
    );
  }
}

module.exports = {
  NavAddButton,
  NavBackButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton
};
