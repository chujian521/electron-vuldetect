<template>
  <div id="app-base-file">
    
    <div class="one-block-1">
      <span>
        1. 目标应用信息
      </span>
    </div>  
    <div class="one-block-2">
      <!-- todo 加入选择目录的按钮功能 -->
      <a-space style="margin: 5px">
        <span>Java包路径</span>  
      </a-space>
      <div />
      <a-input v-model="src_dir" placeholder="jar/classes路径" style="width: 460px">
      </a-input>  
      <a-button 
      @click="selectFile">
      选择文件夹
      </a-button>
    </div>

    <div class="one-block-1">
      <span>
        2. 执行测试
      </span>
    </div>  

    <div class="one-block-2">
      <a-button type="primary" icon="caret-right" @click="execAnalyze">
        执行
      </a-button>
    </div> 
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main'

const fs = require('fs');


export default {
  data() {
    return {
      src_dir: "",
      isRunning: false,
      socketMessageString: '',
      DetLogic:['.\\SourceCodeDetector\\findsecbugs\\',"","findsecbugs.exe"]
    };
  },
  methods: {
    selectFile() {
      this.$ipcCall(ipcApiRoute.selectFolder, '').then(r => {
        this.src_dir = r;
        //this.$message.info(r);
      })      
    },
    execAnalyze() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.openSoft();
      }
      
    },
    getCurrentTime() {
      var date = new Date();//当前时间
      var year = date.getFullYear() //返回指定日期的年份
      var month = this.repair(date.getMonth() + 1);//月
      var day = this.repair(date.getDate());//日
      var hour = this.repair(date.getHours());//时
      var minute = this.repair(date.getMinutes());//分
      var second = this.repair(date.getSeconds());//秒
      
      //当前时间 
      var curTime = year + "-" + month + "-" + day
              + "-" + hour + "-" + minute + "-" + second;
      return curTime;
    },
    repair(i){
      if (i >= 0 && i <= 9) {
          return "0" + i;
      } else {
          return i;
      }
    },
    openSoft () {
      const self = this;  
      var time = this.getCurrentTime();

      this.DetLogic[1] = "\\SourceCodeDetector\\reports\\payment_"+ time +".htm " + this.src_dir;
      //self.$message.info(this.DetLogic[1]);
      this.$ipcCall(ipcApiRoute.openSoftwareWithParam, this.DetLogic).then(result => {
        if (!result) {
          self.$message.error('程序不存在');
        }
        this.isRunning = false;
      })       
    }

  }
};
</script>
<style lang="less" scoped>
#app-base-file {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    font-weight:bold;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
  .footer {
    padding-top: 10px;
  }
}
</style>
