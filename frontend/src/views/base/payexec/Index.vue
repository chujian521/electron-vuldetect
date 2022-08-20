<template>
  <div id="app-base-window">
    <div class="one-block-1">
      <span>
        开始执行支付漏洞检测任务
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button type="primary" :icon="isRunning? 'sync':'caret-right'" @click="openSoft">开始</a-button>
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
import { ipcApiRoute } from '@/api/main'
export default {
  data() {
    return {
      isRunning: false,
      socketMessageString: '',
      DetLogic:'.\\DetLogic\\DetLogic.exe'
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    startRun() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.openSoft();
      }
    },
    openSoft () {
      const self = this;   
      this.$ipcCall(ipcApiRoute.openSoftware, this.DetLogic).then(result => {
        if (!result) {
          self.$message.error('程序不存在');
        }
        this.isRunning = false;
      })       
    },
  }
}
</script>
<style lang="less" scoped>
#app-base-window {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
    font-weight:bold;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
