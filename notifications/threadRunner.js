import { self } from 'react-native-threads';

import logger from 'app/log';

self.onmessage = (message) => {
  logger.log(message, { context: 'threadRunner' });
};
