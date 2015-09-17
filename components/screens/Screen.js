var React = require('react-native');
var {
  StyleSheet,
  View,
  Component
} = React;

var NavigationBar = require('react-native-navbar');

class Screen extends Component {
  render() {
    let { leftBtn, rightBtn, title, content, navigator } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <NavigationBar navigator={navigator}
            title={title}
            customPrev={leftBtn}
            customNext={rightBtn} />
        </View>
        <View style={styles.content}>
          {{content}}
        </View>
      </View>
    );
  }
}

var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  navbar: {
    height: 64,
    width: window.width
  },
  content: {
    height: window.height - 64,
    width: window.width
  }
});

module.exports = Screen;