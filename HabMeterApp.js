'use strict';

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  Navigator,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image
} = React;

var MainScreen = require('./MainScreen');

var AddMeterScreen = require('./AddMeterScreen');

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return (
        <TouchableOpacity
          style={styles.navBarLeftButton}>
          <Image source={require('image!menu')} style={styles.navBarIcon} />
        </TouchableOpacity>
      );
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Image source={require('image!back')} style={styles.navBarIcon} />
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {  
    return (
      <TouchableOpacity
        onPress={() => navigator.push({
          title: 'Add Meter',
          component: AddMeterScreen
        })}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Add
        </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};

var HabMeterApp = React.createClass({
  renderScene: function(route, navigator) {
    var Component = route.component;
    var navBar = route.navigationBar;

    console.log(navigator.props.navigationBar);

    return (
      <View style={styles.navigator}>
        <Component navigator={navigator} route={route} />
      </View>
    );
  },

  render: function() {
    return (
      <Navigator
        debugOverlay={false}
        style={styles.container}
        initialRoute={{
          title: 'HabMeter',
          component: MainScreen
        }}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarIcon: {
    marginVertical: 10
  },
  navBarTitleText: {
    color: 'black',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#1A7CF9',
  }
});

AppRegistry.registerComponent('HabMeterApp', () => HabMeterApp);

module.exports = HabMeterApp;
