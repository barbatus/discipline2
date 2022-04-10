import env from 'react-native-config';

export const IS_LOCAL = env.NAME === 'local';
export const IS_BETA = env.NAME === 'beta';
export const IS_PROD = env.NAME === 'prod';

export const DEBUG_GEO = Boolean(parseInt(env.DEBUG_GEO, 10));
export const DEBUG_MENU = Boolean(parseInt(env.DEBUG_MENU, 10));
