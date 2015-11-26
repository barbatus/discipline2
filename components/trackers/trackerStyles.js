const React = require('react-native');
const {
  StyleSheet
} = React;

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const common = {
  slide: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    width: window.width - 50
  },
  innerView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    },
    opacity: 1,
    transform: [{rotateY: '0deg'}],
    backgroundColor: 'transparent'
  },
  headerContainer: {
    flex: 0.4,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  bodyContainer: {
    flex: 0.6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  barContainer: {
    flex: 0.20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 5,
    paddingBottom: 0
  },
  iconContainer: {
    flex: 0.45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textContainer: {
    flex: 0.35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 25,
    fontWeight: '300',
    textAlign: 'center'
  },
  mainIcon: {
    resizeMode: 'contain',
    height: 60
  },
  infoIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25
  },
  circleBtn: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50
  },
  checkBtn: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 40,
    height: 80,
    width: 80
  },
  filledBtn: {
    backgroundColor: '#3DCF43'
  }
};

const trackerStyles = StyleSheet.create(common);

const props = {
  innerView: {
    ...common.innerView,
    opacity: 0,
    transform: [{rotateY: '-180deg'}],
    backgroundColor: 'transparent'
  },
  headerContainer: {
    ...common.headerContainer,
    flex: 0.45
  },
  bodyContainer: {
    ...common.bodyContainer,
    flex: 0.55,
    backgroundColor: '#F5F5F5'
  },
  barContainer: {
    ...common.barContainer,
    alignItems: 'center',
    flex: 0.25
  },
  iconContainer: {
    ...common.iconContainer,
    alignItems: 'flex-end',
    flex: 0.4
  },
  textContainer: {
    ...common.textContainer,
    alignItems: 'center',
    flex: 0.35
  },
  inputTitle: {
    width: 200,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '300'
  },
  group: {
    marginTop: 20
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: window.width - 51,
    height: 45,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    fontWeight: '400'
  },
  colLeft: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15
  },
  colRight: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15
  },
  text: {
    fontSize: 16
  }
};

const propsStyles = StyleSheet.create({
  ...props,
  firstGroupRow: {
    ...props.row,
    borderBottomWidth: 0
  }
});

module.exports = {
  trackerStyles,
  propsStyles
};
