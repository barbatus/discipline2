const React = require('react-native');
const {
  StyleSheet
} = React;

const styles = StyleSheet.create({
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarIcon: {
    marginVertical: 10,
    resizeMode: 'contain',
    height: 20,
    width: 20
  },
  menuIcon: {
    height: 17,
    width: 24
  },
  navBarTitleText: {
    color: 'black',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 20,
    marginTop: 0
  },
  navBarRightButton: {
    paddingRight: 20,
    marginTop: 0
  },
  navBarButtonText: {
    color: '#1A7CF9'
  }
});

module.exports = styles;
