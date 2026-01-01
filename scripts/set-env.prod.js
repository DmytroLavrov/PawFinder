const fs = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.prod.ts';

const apiKey = process.env.THE_DOG_API_KEY || '';

const envConfigFile = `export const environment = {
  production: true,
  dogApiUrl: 'https://api.thedogapi.com/v1',
  dogApiKey: '${apiKey}'
};`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});
