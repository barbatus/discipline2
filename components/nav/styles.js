import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navTitle: {
    paddingBottom: 5,
  },
  navTitleText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'white',
  },
  navBarIcon: {
    marginVertical: 10,
    resizeMode: 'contain',
    height: 23,
    width: 23,
  },
  cancelIcon: {
    height: 20,
    width: 20,
  },
  navBarTitleText: {
    color: 'black',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: 0,
  },
  navBarRightButton: {
    paddingRight: 20,
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 0,
  },
  navBarButtonText: {
    color: '#1A7CF9',
  },
});

module.exports = styles;
