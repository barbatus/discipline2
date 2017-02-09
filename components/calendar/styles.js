import {Dimensions, StyleSheet} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  calendarControls: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row'
  },
  controlButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  navIcon: {
    resizeMode: 'contain',
    height: 23,
    width: 23,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  calendarHeading: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
    color: '#cccccc',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 0,
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  outDayButton: {
    padding: 0,
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 16,
    textAlign: 'center',
  },
  dayCircle: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 33,
    height: 33,
    borderRadius: 16,
  },
  currentDayCircle: {
    backgroundColor: 'red',
  },
  currentDayText: {
    color: 'white',
  },
  selectedDayCircle: {
    backgroundColor: 'black',
  },
  selectedDayText: {
    color: 'white',
  },
  weekendDayText: {
    color: 'white',
  },
});

export default styles;
