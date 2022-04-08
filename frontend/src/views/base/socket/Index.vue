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
      <span>
        开始执行任务
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button @click="openSoft">开始</a-button>
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
      socketMessageString: '',
      logicDetector:'.\\LogicDetector\\LogicDetector.exe'
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    openSoft () {
      const self = this;   
      this.$ipcCall(ipcApiRoute.openSoftware, this.logicDetector).then(result => {
        if (!result) {
          self.$message.error('程序不存在');
        }
      })       
    },
  }
}
</script>
<style lang="less" scoped>
#app-base-socket-ipc {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
