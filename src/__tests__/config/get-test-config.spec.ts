import { getTestConfig } from '../../config/get-test-config';
import { Config, ProcessVariables } from '../../types/config';

describe('getTestConfig', () => {
  it('should return test config', () => {
    const processVariables: ProcessVariables = {
      TEST_PORT: '4000',
      ENV: 'test',
      LOG_LEVEL: 'info',
      JWT_SECRET: 'your-secret',
      MONGO_URI: 'your-mongo-uri',
    };

    const expectedConfig: Config = {
      port: '4000',
      environment: 'test',
      logLevel: 'info',
      jwtSecret: 'your-secret',
      mongoURI: 'your-mongo-uri',
    };

    const result = getTestConfig(processVariables);
    expect(result).toEqual(expectedConfig);
  });
});
