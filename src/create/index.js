/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const create = require('weexpack-create');
const _ = require('underscore');
const fs = require('fs');
const rm = require('rimraf').sync;
const path = require('path');
const ora = require('ora');
const utils = require('../utils');
const events = utils.events;
const ask = utils.ask;
const gituser = utils.gituser;
const defaultConfigs = {
  android: {
    AppName: 'WeexApp',
    AppId: 'com.alibaba.weex',
    SplashText: 'Hello\nWeex',
    WeexBundle: 'index.js'
  },
  ios: {
    AppId: 'com.alibaba.weex',
    AppName: 'WeexApp',
    Version: '1.0.0',
    BuildVersion: '1.0.0',
    WeexBundle: 'index.js',
    CodeSign: '',
    Profile: ''
  }
};

module.exports = function (dir, optionalId, optionalName, cfg, extEvents) {
  const tmp = path.resolve(dir);
  if (_.isEmpty(cfg)) {
    cfg = {};
  }
  if (fs.existsSync(tmp)) {
    const spinner = ora(`Remove ${tmp} ...`).start();
    rm(tmp);
    spinner.stop();
  }
  // Create a middleware for asking questions.
  const questions = {
    name:
    { type: 'string',
      required: true,
      message: 'Project name',
      default: dir,
      validate: function (name) {
        if (!name || !name.match(/^[$A-Z_][0-9A-Z_-]*$/i)) {
          return false;
        }
        return true;
      } },
    description:
    { type: 'string',
      required: false,
      message: 'Project description',
      default: 'A weex project' },
    version:
    { type: 'string',
      message: 'Project version',
      default: '1.0.0' },
    author:
    { type: 'string',
      message: 'Project author',
      default: gituser() },
    unit: {
      type: 'confirm',
      message: 'Set up unit tests?'
    },
    autoInstall: {
      type: 'list',
      message: 'Should we run `npm install` for you after the project has been created?',
      choices: [
          { name: 'Yes, use NPM', value: 'npm', short: 'npm' },
          { name: 'Yes, use Yarn', value: 'yarn', short: 'yarn' },
          { name: 'No, I will handle that myself', value: false, short: 'no' }
      ]
    }
  };

  ask(questions, cfg, () => {
    cfg = _.extend(defaultConfigs, cfg);
    if (extEvents) {
      return create(dir, optionalId, optionalName, cfg, extEvents, cfg.autoInstall);
    }
    else {
      return create(dir, optionalId, optionalName, cfg, events, cfg.autoInstall);
    }
  });
};

