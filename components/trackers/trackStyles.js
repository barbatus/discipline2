const React = require('react-native');
const {
  StyleSheet
} = React;

var Dimensions = require('Dimensions');
var window = Dimensions.get('window');

const styles = StyleSheet.create({
  tracker: {
    flex: 1,
    width: window.width - 50,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  headerContainer: {
    flex: 0.4,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  bodyContainer: {
    flex: 0.6,
    backgroundColor: 'white',
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconContainer: {
    flex: 0.65,
    justifyContent: 'center'
  },
  textContainer: {
    flex: 0.35
  },
  title: {
    fontSize: 21,
    fontWeight: '300',
    marginBottom: 2,
  },
  icon: {
    resizeMode: 'contain',
    height: 50,
    width: 50
  },
  circleBtn: {
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    width: 50
  },
  checkBtn: {
    backgroundColor: 'white',
    borderRadius: 40,
    height: 80,
    width: 80
  },
  filledBtn: {
    backgroundColor: '#3DCF43'
  }
});

module.exports = styles;
