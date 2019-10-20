const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

let mockMagePath = 'https://github.com/magefile/mage/releases/download/v1.9.0/mage_1.9.0_Linux-ARM.tar.gz';

if (!tempDirectory) {
  tempDirectory = path.join('/home', 'actions', 'temp');
}

/**
 * @param {string} version  x.x.x mage version
 */
async function installer(version) {
  // check for cached installation
  let toolPath = tc.find('mage', version);

  if (!toolPath) {
    toolPath = await installMage(version);
    core.debug(`mage is cached under ${toolPath}`);
  }

  // Add mage dir to bin
  core.addPath(toolPath);
}

/**
 * @param {string} version
 * @returns {Promise<string>}
 */
async function installMage(version) {
  // Download Mage
  const downloadUrl = `https://github.com/magefile/mage/releases/download/v${version}/mage_${version}_Linux-64bit.tar.gz`;
  let downloadPath = '';

  try {
    downloadPath = await tc.downloadTool(downloadUrl);
  } catch (err) {
    core.debug(err);

    throw new Error(`failed to download Mage v${version}: ${err.message}`);
  }

  // Extract tar
  const extractPath = await tc.extractTar(downloadPath);

  // Cache mage dir
  return await tc.cacheDir(extractPath, 'mage', version);
}

module.exports = installer;
