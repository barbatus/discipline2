import { StyleSheet } from 'react-native';

export const PATH_COLOR = '#2196F3';

export const mapStyles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    right: 25,
    bottom: 25,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  buttonIcon: {
    color: '#4A4A4A',
    backgroundColor: 'transparent',
    paddingTop: 1,
    paddingLeft: 1,
  },
});
