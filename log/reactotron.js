import Reactotron, { trackGlobalErrors } from 'reactotron-react-native';

Reactotron.configure().useReactNative(trackGlobalErrors()).connect();
