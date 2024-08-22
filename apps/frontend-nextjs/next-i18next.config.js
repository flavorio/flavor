const path = require('path');
const localePublicFolder = undefined;
const localPaths = [
  path.resolve('../frontend-nextjs/public/locales'),
  process.env.I18N_LOCALES_PATH,
];

function getLocalPath() {
  console.log('getLocalPath');
  if (typeof window === 'undefined') {
    const fs = require('node:fs');
    return localPaths.find((str) => {
      console.log(str);
      return fs.existsSync(str);
    });
  }

  return localePublicFolder;
}

const localePath = getLocalPath();

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
  },
  localePath,
};
