'use strict';

const React = require('react-native');
const {
  StyleSheet
} = React;

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

const cellDef = {
  cell: {
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bodyContainer: {
    flex: 0.5,
    backgroundColor: 'white'
  },
  footerContainer: {
    flex: 0.3,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
};

const cellStyles = StyleSheet.create(cellDef);

module.exports = {
  cellStyles: cellStyles,
  cellDef: cellDef
};
