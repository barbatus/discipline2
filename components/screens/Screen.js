const React = require('react-native');

const {
  StyleSheet,
  View,
  Component,
  Text,
  Animated
} = React;

const NavigationBar = require('react-native-navbar');
const LinearGradient = require('react-native-linear-gradient');

const NavTitle = require('../nav/Title');

class Screen extends Component {
  constructor(props) {
    super(props);
    this.colors = [{
      colorBottom: '#E97490',
      colorTop: '#FBDDB7'
    }, {
      colorBottom: '#FBDDB7',
      colorTop: '#FFA878'
    }, {
      colorBottom: '#FA9E72',
      colorTop: '#9FC1E7'
    }, {
      colorBottom: '#96BAEF',
      colorTop: '#B454A6'
    }, {
      colorBottom: '#BA4699',
      colorTop: '#E68C7D'
    }];

    this.state = {
      opacity: new Animated.Value(1)
    };

    // let color = this.colors[(index + inc) % this.colors.length];
    // this.setState({
    //   colorTop: color.colorTop,
    //   colorBottom: color.colorBottom
    // });
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
      navigator
    } = this.props;

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FBDDB7', '#E97490']}
          style={styles.gradient} />
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
  content: {
    height: window.height - 64,
    width: window.width
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  }
});

module.exports = Screen;
