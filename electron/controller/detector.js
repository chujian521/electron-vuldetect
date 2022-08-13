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

function replace(str, substr, newstr) {
  var p = -1; // 字符出现位置
  var s = 0; // 下一次起始位置

  while((p = str.indexOf(substr, s)) > -1) {
    s = p + newstr.length; // 位置 + 值的长度
    str = str.replace(substr, newstr);
  }

  return str;
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
    
      listWhiteReports(dirPath) {
        let dirPath_ = path.join(Utils.getExtraResourcesDir(), dirPath);
        if (!dirPath_) {
          return nil;
        }

        let reportsList = fs.readdirSync(dirPath_);
        // this.app.logger.info('[listReports] reportsList:', reportsList);
        var res = new Array()
        for(const i of reportsList){
          if (!i) {
            continue;
          }
          if (i.startsWith('~')) {continue;}
          if (fs.statSync(dirPath_+"\\"+i).isDirectory()){continue;}//如果是目录也不处理
          var tmp = i.split("_",2)
          var url = tmp[0]
          var date = tmp[1].split(".",1)[0]
          const dateAry = date.split('');
          dateAry[10] = 'T';
          dateAry[13] = ':';
          dateAry[16] = ':';
          date = dateAry.join('');
          url = replace(url,",",":")
          url = replace(url,";","/")
          var out={
            "url": url,
            "reportName": path.join(dirPath_,i),
            "date": date
          }
          res.push(out)
        }
        // this.app.logger.info('[listReports] res: ',res)
        return res;
      }

}

module.exports = DetectorController;