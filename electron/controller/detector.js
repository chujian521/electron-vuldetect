'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const is = require('electron-is');
const { exec, execSync } = require('child_process');
const Controller = require('ee-core').Controller;
const Utils = require('ee-core').Utils;
const electronApp = require('electron').app;
const { dialog, webContents, shell, BrowserWindow, BrowserView,
  Notification, powerMonitor, screen, nativeTheme } = require('electron');
const autoLaunchManager = require('../library/autoLaunch');

function rpath(p) {
    return path.join(Utils.getExtraResourcesDir(), p);
}

class DetectorController extends Controller {

    constructor(ctx) {
      super(ctx);
    }

    execJvdetector(args) {
        let jarPath = args["jarpath"];
        jarPath = jarPath.replaceAll('\\', '/');
        if (!jarPath) {
          return false;
        }
        let jarsDir = rpath('jvdetector/jars')
        if (!fs.existsSync(jarsDir)) {
            fs.mkdirSync(jarsDir);
        }
        if (!fs.existsSync(jarPath)) {
            this.app.logger.error('file not exist: ', jarPath);
            return false;
        }

        let jarname = path.posix.basename(jarPath);
        let inputPath = path.join(jarsDir, jarname);
        fs.copyFileSync(jarPath, inputPath);

        let jdPath = rpath('jvdetector/jvdetector.jar');
        let workDir = rpath('jvdetector');
        let javaCmd = 'java -jar '+'\"'+jdPath+'\"'+' -v -jp '+'\"jars/'+jarname+'\"';
        // 命令行字符串 并 执行
        let cwd = process.cwd();
        process.chdir(workDir);
        this.app.logger.info(javaCmd);
        exec(javaCmd);
        process.chdir(cwd);
        return true;
      }

}

module.exports = DetectorController;