<template>
  <div id="app-base-socket-ipc">
    <!-- <div class="one-block-1">
      <span>
        1. 渲染进程与主进程IPC通信
      </span>
    </div>  
    <div class="one-block-2">
      <a-list bordered>
        <a-input-search v-model="content" @search="helloHandle">
          <a-button slot="enterButton">
            send
          </a-button>
        </a-input-search>
      </a-list>
    </div>
    <div class="one-block-1">
      <span>
        2. 主进程API执行网页函数
      </span>
    </div>  
    <div class="one-block-2">
      <a-list bordered>
        <a-input-search v-model="content2" @search="executeJSHandle">
          <a-button slot="enterButton">
            send
          </a-button>
        </a-input-search>
      </a-list>
    </div> -->
    <div class="one-block-1">
      <span> 开始执行任务 </span>
    </div>
    <div class="one-block-2">
      <a-modal
        v-model="modalVisible"
        title="提示"
        ok-text="确认"
        cancel-text="忽略"
        @ok="handleOk"
        @cancel="handleIgnore"
      >
        <p v-for="msg in modalMessages" :key="msg">
          {{ msg }}
        </p>
      </a-modal>
      <a-space>
        <a-button
          type="primary"
          :icon="isRunning ? 'sync' : 'caret-right'"
          @click="openSoft"
          >开始</a-button
        >
        <!-- <a-button @click="socketMsgStop">结束</a-button> -->
      </a-space>
      <p>
        <a-divider>测试输出</a-divider>
        {{ socketMessageString }}
      </p>
    </div>
  </div>
</template>
<script>
import { ipcApiRoute } from "@/api/main";

export default {
  data() {
    return {
      isRunning: false,
      modalVisible: false,
      socketMessageString: "",
      modalMessages: [""],
      logicDetector: ".\\LogicDetector\\LogicDetector.exe",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      // 避免重复监听，或者将 on 功能写到一个统一的地方，只加载一次
      this.$ipc.removeAllListeners(ipcApiRoute.ipcShowTip);
      this.$ipc.on(ipcApiRoute.ipcShowTip, (event, result) => {
        console.log(result);
        self.modalMessages = result;
        self.modalVisible = true;
      });
    },
    startRun() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.openSoft();
      }
    },
    openSoft() {
      const self = this;
      this.$ipcCall(ipcApiRoute.openSoftware, this.logicDetector).then(
        (result) => {
          if (!result) {
            self.$message.error("程序不存在");
          }
          this.isRunning = false;
        }
      );
    },
    handleOk() {
      this.modalVisible = false;
    },
    handleIgnore() {
      const url = this.modalMessages[0];
      this.$ipcCall(ipcApiRoute.ipcIgnoreTip, url).then((result) => {
        console.log(result);
      });
      this.modalVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
#app-base-socket-ipc {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
    font-weight: bold;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
