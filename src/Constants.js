import {Platform} from 'react-native';

// Composer
export const MAX_COMPOSER_HEIGHT = 100;
export const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});

export const COMPOSER_MARGIN_TOP = Platform.select({
  ios: 6,
  android: 0,
});

export const COMPOSER_MARGIN_BOTTOM = Platform.select({
  ios: 5,
  android: 3,
});

export default {
  MAX_COMPOSER_HEIGHT,
  MIN_COMPOSER_HEIGHT,
  COMPOSER_MARGIN_TOP,
  COMPOSER_MARGIN_BOTTOM
}
