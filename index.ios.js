'use strict';

require('./globals');

const React = require('react-native');
const {
  AppRegistry,
  Navigator,
  StyleSheet,
  Component
} = React;

const SideMenu = require('react-native-side-menu');
const MainScreen = require('./components/screens/MainScreen');
const Menu = require('./components/nav/Menu');

class DisciplineApp extends Component {
  constructor(props) {
    super(props);
    this.state = { touchToClose: false, isOpen: false };
  }

  renderScene(route, navigator) {
    const Component = route.component;
    const menu = <Menu navigator={navigator} />;

    return (
      <SideMenu
        disableGestures={true}
        menu={menu}
        isOpen={this.state.isOpen}>
        <Component
          navigator={navigator}
          route={route}
          onMenu={() => this.setState({isOpen: true})} />
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
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

AppRegistry.registerComponent('Discipline', () => DisciplineApp);

module.exports = DisciplineApp;
