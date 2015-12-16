'use strict';

const React = require('react-native');
const {
  StyleSheet
} = React;

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const slideDef = {
  slide: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    width: window.width - 40
  },
  innerView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.3,
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
    flex: 0.2,
    backgroundColor: 'white'
  },
  bodyContainer: {
    flex: 0.5,
    backgroundColor: 'white'
  },
  footerContainer: {
    flex: 0.3,
    backgroundColor: 'white'
  },
  borderTopRadius: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  borderBottomRadius: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
};

const slideStyles = StyleSheet.create({
  ...slideDef,
  headerContainer: {
    ...slideDef.headerContainer,
    ...slideDef.borderTopRadius,
  },
  footerContainer: {
    ...slideDef.footerContainer,
    ...slideDef.borderBottomRadius,
  }
});

module.exports = {
  slideStyles,
  slideDef
};
