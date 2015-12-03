'use strict';

const React = require('react-native');
const {
  TouchableOpacity,
  Text,
  Image,
  Component
} = React;

const styles = require('./styles');

class NavButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={this.props.style}>
        <Image
          source={getIcon(this.props.icon)}
          style={styles.navBarIcon} />
      </TouchableOpacity>
    );
  }
}

class NavAddButton extends Component {
  render() {
    return (
      <NavButton {...this.props}
        icon={'new'}
        style={styles.navBarRightButton} />
    );
  }
}

class NavBackButton extends Component {
  render() {
    return (
      <NavButton {...this.props}
        icon={'back'}
        style={styles.navBarLeftButton} />
    );
  }
}

class NavMenuButton extends Component {
  render() {
    return (
      <NavButton {...this.props}
        icon={'menu'}
        style={styles.navBarLeftButton} />
    );
  }
}

class NavCancelButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'cancel'}
        style={styles.navBarLeftButton} />
    );
  }
}

class NavAcceptButton extends Component {
  render() {
    return (
      <NavButton
        {...this.props}
        icon={'accept'}
        style={styles.navBarRightButton} />
    );
  }
}

module.exports = {
  NavButton,
  NavAddButton,
  NavBackButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton
};
