import { self } from 'react-native-threads';
import Reactotron from 'reactotron-react-native';

self.onmessage = (message) => {
  Reactotron.log(message);
};
