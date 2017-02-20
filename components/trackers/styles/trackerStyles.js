'use strict';

import React from 'react';

import {StyleSheet} from 'react-native';

import {slideDef, slideWidth} from './slideStyles';

const trackerDef = {
  ...slideDef,
  innerView: {
    ...slideDef.innerView,
    ...slideDef.borderRadius,
  },
  headerContainer: {
    ...slideDef.headerContainer,
    ...slideDef.borderRadius,
    ...slideDef.borderTopRadius,
    flex: 0.45,
    backgroundColor: '#F5F5F5',
  },
  bodyContainer: {
    ...slideDef.bodyContainer,
    flex: 0.4,
  },
  footerContainer: {
    ...slideDef.footerContainer,
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
    flex: 0.15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  barContainer: {
    flex: 0.20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 10,
    paddingBottom: 0,
  },
  iconContainer: {
    flex: 0.45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 0.35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '200',
    textAlign: 'center',
  },
  mainIcon: {
    resizeMode: 'contain',
    width: 80,
    height: 80,
  },
  infoIcon: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
  },
  circleBtn: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
  },
  circleBtnSm: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 18,
    width: 35,
    height: 35,
  },
  checkBtn: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  filledBtn: {
    backgroundColor: '#3DCF43',
  },
  footerText: {
    color: '#C4C4C4',
    fontSize: 15,
    textAlign: 'center',
    width: 150,
    fontWeight: '200',
  },
  hintText: {
    color: '#DFDFDF',
  },
};

const trackerStyles = StyleSheet.create(trackerDef);

const editDef = {
  innerView: {
    ...trackerDef.innerView,
    opacity: 0,
    transform: [{rotateY: '-180deg'}],
  },
  headerContainer: {
    ...trackerDef.headerContainer,
    flex: 0.45,
  },
  bodyContainer: {
    ...trackerDef.bodyContainer,
    flex: 0.55,
    backgroundColor: '#F5F5F5',
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
  },
  barContainer: {
    ...trackerDef.barContainer,
    alignItems: 'center',
    flex: 0.25,
  },
  iconContainer: {
    ...trackerDef.iconContainer,
    alignItems: 'flex-end',
    flex: 0.4,
    paddingTop: 15,
  },
  titleContainer: {
    ...trackerDef.titleContainer,
    alignItems: 'center',
    flex: 0.35,
  },
  titleInput: {
    flex: 0.35,
    paddingRight: 0,
    width: slideWidth - 40,
    fontSize: 30,
    textAlign: 'center',
    color: '#4A4A4A',
    fontWeight: '200',
  },
  group: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: slideWidth - 1,
    height: 45,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  colLeft: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  colRight: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  colText: {
    fontSize: 16,
  },
  nextIcon: {
    resizeMode: 'contain',
    height: 13,
    marginLeft: 10,
  }
};

const propsStyles = StyleSheet.create({
  ...editDef,
  colLeftWide: {
    ...editDef.colLeft,
    flex: 0.7
  },
  firstGroupRow: {
    ...editDef.row,
    borderBottomWidth: 0,
  }
});

module.exports = {
  trackerDef,
  trackerStyles,
  propsStyles,
};
