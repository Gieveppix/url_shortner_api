import { getLocalConfig } from '../../config/get-local.config';
import { Config, ProcessVariables } from '../../types/config.type';

describe('getLocalConfig', () => {
  it('should return local config', () => {
    const processVariables: ProcessVariables = {
      PORT: '3000',
      ENV: 'local',
      LOG_LEVEL: 'debug',
      JWT_SECRET: 'your-secret',
      MONGO_URI: 'your-mongo-uri',
      TRANSPORT_HOST: 'your-transport-host',
      TRANSPORT_PORT: 587,
      TRANSPORT_AUTH_USER: 'your-auth-user',
      TRANSPORT_AUTH_PASS: 'your-auth-pass',
      MAIL_OPTIONS_FROM: 'your-mail-options-from',
    };

    const expectedConfig: Config = {
      port: '3000',
      environment: 'local',
      logLevel: 'debug',
      jwtSecret: 'your-secret',
      mongoURI: 'your-mongo-uri',
      transportHost: 'your-transport-host',
      transportPort: 587,
      transportAuthUser: 'your-auth-user',
      transportAuthPass: 'your-auth-pass',
      mailOptionFrom: 'your-mail-options-from',
    };

    const result = getLocalConfig(processVariables);
    expect(result).toEqual(expectedConfig);
  });
});
