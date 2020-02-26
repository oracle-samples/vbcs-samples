/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/

'use strict';

const archiver = require('archiver');
const fs = require('fs-extra');
const path = require('path');
const themeName = 'ApplicationsCloudUI';

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
    //Setup
    const archiveDirectory = 'deploy';
    const configFile = path.join('src', 'themes', themeName, 'theme.json');
    const destination = path.join(archiveDirectory, themeName + '-export.zip');
    const sourceDirectory = path.join('web', 'css');
    if (!fs.existsSync(archiveDirectory)) {
      fs.mkdirSync(archiveDirectory);
    }
    //Based on the build type release | dev remove any surplus copies of the theme css that will just bulk up the export and are not needed
    const themeConfig = JSON.parse(fs.readFileSync(configFile, "utf8"));
    const themeCSSOutput = path.join(sourceDirectory, themeName, themeConfig.version, 'web');
    //Check to make sure the theme was actually requested.  If not abort the packaging
    if (!fs.existsSync(themeCSSOutput)) {
      const msg = 'You forgot to include the --theme directive on the ojet command line. Packaging will not take place';
      console.warn(`\x1b[31mError: ${msg}\x1b[0m`);
      resolve(); //Don't reject because user may be reverting to default theme for testing 
    }
    else {
      const debugFile =  path.join(themeCSSOutput, themeName + '.css');
      const minfiedFile =  path.join(themeCSSOutput, themeName + '.min.css');
      if (fs.existsSync(minfiedFile)) {
        fs.removeSync(debugFile);
        fs.renameSync(minfiedFile, debugFile);
      }

      console.log("Packaging theme ZIP file.....");
      const output = fs.createWriteStream(destination);
      const archive = archiver('zip');
      archive.pipe(output);
      archive.directory(sourceDirectory, false);
      archive.finalize();

      output.on('close', () => {
        console.log('Theme export ' + destination + ' created');
        resolve();
      });

      archive.on('warning', (error) => {
        archive.finalize();
        console.warn(error);
        reject(error);
      });

      archive.on('error', (error) => {
        archive.finalize();
        console.error(error);
        reject(error);
      });
    }
  });
};
