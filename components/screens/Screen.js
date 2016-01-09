const React = require('react-native');

const {
  StyleSheet,
  View,
  Component,
  Text,
  Animated
} = React;

const NavBar = require('../nav/NavBar');

class Screen extends Component {
  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      navBar: this.navBar
    }
  }

  get navBar() {
    return {
      setButtons: (leftBtn, rightBtn) => {
        this.refs.navBar.setButtons(leftBtn, rightBtn);
      },
      setTitle: navTitle => {
        this.refs.navBar.setTitle(navTitle);
      }
    };
  }

  render() {
    let {
      content,
      background,
      navigator
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          {background}
        </View>
        <NavBar ref='navBar' />
        <View style={styles.content}>
          {content}
        </View>
      </View>
    );
  }
}

Screen.childContextTypes = {
  navBar: React.PropTypes.object.isRequired
};

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  background: {
    position: 'absolute',
    height: window.height,
    width: window.width
  },
  content: {
    height: window.height - 64,
    width: window.width
  }
});

module.exports = Screen;
