const React = require('react-native');

const {
  StyleSheet,
  View,
  Component,
  Text,
  Animated
} = React;

const NavigationBar = require('react-native-navbar');

const NavTitle = require('../nav/Title');

class Screen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(1)
    };
  }

  getChildContext() {
    return {
      navBar: this.navBar
    }
  }

  get navBar() {
    return {
      setButtons: (leftBtn, rightBtn) => {
        this._hideButtons(() => {
          this.setState({
            leftBtn,
            rightBtn
          });

          this._showButtons();
        });
      },
      setTitle: navTitle => {
        this.setState({
          navTitle
        });
      }
    };
  }

  _hideButtons(callback) {
    Animated.timing(this.state.opacity, {
      duration: 500,
      toValue: 0
    }).start(callback);
  }

  _showButtons(callback) {
    Animated.timing(this.state.opacity, {
      duration: 500,
      toValue: 1
    }).start();
  }

  _getAnimatedBtn(button) {
    return (
      <Animated.View style={{opacity: this.state.opacity}}>
        {button}
      </Animated.View>
    );
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
          {{background}}
        </View>
        <View style={styles.navbar}>
          <NavigationBar
            ref='navBar'
            tintColor='transparent'
            navigator={navigator}
            title={
              <NavTitle title={this.state.navTitle} />
            }
            leftButton={this._getAnimatedBtn(this.state.leftBtn)}
            rightButton={this._getAnimatedBtn(this.state.rightBtn)} />
        </View>
        <View style={styles.content}>
          {{content}}
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
  navbar: {
    height: 64,
    width: window.width,
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
