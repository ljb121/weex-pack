#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const utils = require('../lib/utils')
const logger = utils.logger;

const {
  buildAndroid,
  buildIOS,
  buildWeb
} = require('../lib/build');

program
  .usage('<platform> [options]')
  .parse(process.argv);

function printExample() {
  logger.log('  Examples:')
  logger.log()
  logger.log(chalk.grey('    # build weex Android project'))
  logger.log('    $ ' + chalk.blue('weexpack build android'))
  logger.log()
  logger.log(chalk.grey('    # build weex iOS project'))
  logger.log('    $ ' + chalk.blue('weexpack build ios'))
  logger.log()
  logger.log(chalk.grey('    # build weex web project'))
  logger.log('    $ ' + chalk.blue('weexpack build web'))
  logger.log()
}

program.on('--help', printExample)

const isValidPlatform = (args) => {
  if (args && args.length) {
    return args[0] === 'android' || args[0] === 'ios' || args[0] === 'web'
  }
  return false
}

/**
 * Run weex app on the specific platform
 * @param {String} platform
 */
const build = (platform, options) => {
  switch (platform) {
    case 'android' : buildAndroid(options); break;
    case 'ios' : buildIOS(options); break;
    case 'web' : buildWeb(options); break;
  }
}

// check if platform exist
if (program.args.length < 1) {
  program.help()
  process.exit()
}

if (isValidPlatform(program.args)) {
  // TODO: parse config file
  build(program.args[0], {configPath:program.config,clean:program.clean})

} else {
  console.log()
  console.log(`  ${chalk.red('Unknown platform:')} ${chalk.yellow(program.args[0])}`)
  console.log()
  printExample()
  process.exit()
}
