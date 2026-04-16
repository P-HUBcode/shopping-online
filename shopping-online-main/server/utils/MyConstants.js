const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.resolve(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        return acc;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        return acc;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      acc[key] = value;
      return acc;
    }, {});
}

const fileEnv = loadEnvFile();
Object.entries(fileEnv).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});
const env = { ...fileEnv, ...process.env };

function getEnv(name, fallback = '') {
  return env[name] || fallback;
}

const MyConstants = {
  DB_URI: getEnv('DB_URI'),
  DB_SERVER: getEnv('DB_SERVER'),
  DB_USER: getEnv('DB_USER'),
  DB_PASS: getEnv('DB_PASS'),
  DB_DATABASE: getEnv('DB_DATABASE'),
  EMAIL_USER: getEnv('EMAIL_USER'),
  EMAIL_PASS: getEnv('EMAIL_PASS'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES: getEnv('JWT_EXPIRES', '3600000'),
};

module.exports = MyConstants;
