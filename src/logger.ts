import pino from 'pino';
import config from 'config';

export default pino({
  enabled: config.get('App.logger.enabled'),
  level: config.get('App.logger.level'),
});
