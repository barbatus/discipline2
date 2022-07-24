import { StyleSheet } from 'react-native';

import { IS_IPHONE5, MAIN_TEXT } from 'app/components/styles/common';

import { slideDef, SLIDE_WIDTH } from './slideStyles';

export const BACK_COLOR = '#F5F5F5';

export const HINT_COLOR = '#DFDFDF';

export const ERROR_COLOR = '#FF001F';

export const trackerDef = {
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
    backgroundColor: BACK_COLOR,
  },
  bodyContainer: {
    ...slideDef.bodyContainer,
  },
  footerContainer: {
    ...slideDef.footerContainer,
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barContainer: {
    flex: 0.2,
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
    alignItems: IS_IPHONE5 ? 'center' : 'flex-start',
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
    width: IS_IPHONE5 ? 70 : 80,
    height: IS_IPHONE5 ? 70 : 80,
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
    width: 45,
    height: 45,
  },
  checkBtn: {
    resizeMode: 'contain',
    backgroundColor: 'white',
    borderRadius: 40,
    height: IS_IPHONE5 ? 70 : 80,
    width: IS_IPHONE5 ? 70 : 80,
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
    color: HINT_COLOR,
  },
  errorText: {
    color: ERROR_COLOR,
  },
};

export const trackerStyles = StyleSheet.create(trackerDef);

const editDef = {
  innerView: {
    ...trackerDef.innerView,
    opacity: 0,
    transform: [{ rotateY: '-180deg' }],
  },
  headerContainer: {
    ...trackerDef.headerContainer,
    flex: 0.45,
  },
  bodyContainer: {
    ...trackerDef.bodyContainer,
    flex: 0.55,
    backgroundColor: BACK_COLOR,
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
  },
  changeIconContainer: {
    flex: 0.65,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  titleContainer: {
    ...trackerDef.titleContainer,
    alignItems: 'center',
    flex: 0.35,
  },
  barContainer: {
    ...trackerDef.barContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
  },
  iconContainer: {
    ...trackerDef.iconContainer,
    alignItems: IS_IPHONE5 ? 'center' : 'flex-end',
    flex: 0.6,
  },
  titleInput: {
    flex: 1,
    paddingRight: 0,
    width: SLIDE_WIDTH - 40,
    fontSize: 30,
    textAlign: 'center',
    color: MAIN_TEXT,
    fontWeight: '200',
  },
  group: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: SLIDE_WIDTH - 1,
    height: 45,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginBottom: 10,
  },
  colLeft: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  colRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
    paddingLeft: 15,
  },
  colText: {
    fontSize: 16,
  },
  nextIcon: {
    resizeMode: 'contain',
    height: 13,
    marginLeft: 10,
  },
};

export const propsStyles = StyleSheet.create({
  ...editDef,
  deleteText: {
    ...editDef.colText,
    color: ERROR_COLOR,
  },
  colHintText: {
    ...editDef.colText,
    color: '#C4C4C4',
  },
  colLeftWide: {
    ...editDef.colLeft,
  },
  firstGroupRow: {
    ...editDef.row,
    borderBottomWidth: 0,
  },
  leftColfreq: {
    display: 'none',
  },
});
