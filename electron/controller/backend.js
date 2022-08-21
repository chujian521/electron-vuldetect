'use strict';

const Controller = require('ee-core').Controller;
const Utils = require('ee-core').Utils;
const path = require('path');
const fs = require('fs');

function logicPath(p) {
    return path.join(Utils.getExtraResourcesDir(), "LogicDetector", p);
}

class BackendController extends Controller {

    /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - IpcMainEvent 文档：https://www.electronjs.org/docs/latest/api/structures/ipc-main-event
   */

    constructor(ctx) {
        super(ctx);
    }

    ipcShowTip(args) {
        const channel = "controller.backend.ipcShowTip";
        // const channel = "controller.example.socketMessageStart"
        const mainWindow = this.app.electron.mainWindow;
        mainWindow.webContents.send(channel, args);
        mainWindow.show();
        return 0;
    }

    ipcIgnoreTip(args, event) {
        const channel = "ipcIgnoreTip";
        let comDir = logicPath("temp/front");
        if (!fs.existsSync(comDir)) {
            fs.mkdirSync(comDir, { recursive: true });
        }
        let msgPath = path.join(comDir, "ignore.msg");
        fs.writeFileSync(msgPath, args);
        this.app.logger.info("Created ignore file: " + msgPath);
        return 0;
    }

}

module.exports = BackendController;