const core = require('@actions/core');
const installer = require('./installer');

async function main() {
  try {
    const version = core.getInput('version');

    if (!version) throw new Error('no mage version provided');

    await installer(version);
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
