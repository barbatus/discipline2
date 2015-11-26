'use strict';

require('./globals');

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
  StyleSheet,
  Component
} = React;

var SideMenu = require('react-native-side-menu');
var MainScreen = require('./components/screens/MainScreen');
var Menu = require('./components/nav/Menu');

class DisciplineApp extends Component {
  constructor(props) {
    super(props);
    this.state = { touchToClose: false };
  }

  renderScene(route, navigator) {
    var Component = route.component;
    var menu = <Menu navigator={navigator} />;

    return (
      <SideMenu disableGestures={true} menu={menu}>
        <Component navigator={navigator} route={route} />
      </SideMenu>
    );
  }

  render() {
    return (
      <Navigator
        debugOverlay={false}
        initialRoute={{
          component: MainScreen
        }}
        renderScene={this.renderScene}
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

AppRegistry.registerComponent('Discipline', () => DisciplineApp);

module.exports = DisciplineApp;
