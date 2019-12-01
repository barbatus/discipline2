import env from 'react-native-config'; 

export const IS_LOCAL = env.NAME === 'local';
export const IS_BETA = env.NAME === 'beta';
export const IS_PROD = env.NAME === 'prod';

export const GEO_DEBUG = Boolean(parseInt(env.GEO_DEBUG, 10));
