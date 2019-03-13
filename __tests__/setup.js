jest.mock('react-native-background-geolocation', () => ({
  configure: jest.fn(),
}));

jest.mock('react-native-device-info', () => ({
  getVersion: () => '0.0.1',
}));
