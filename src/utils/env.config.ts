import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL ?? 'http://172.16.50.198:8080/xtrace-ui',
  TEST_USERNAME: process.env.TEST_USERNAME ?? '',
  TEST_PASSWORD: process.env.TEST_PASSWORD ?? '',
};
