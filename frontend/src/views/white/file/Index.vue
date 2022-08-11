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
      <a-input v-model="target_info.src_dir" placeholder="jar/war路径" style="width: 460px">
      </a-input>  
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
      target_info: {
        src_dir: "",
      },
    };
  },
  methods: {
    
    execAnalyze() {
      let jar = this.target_info.src_dir;
      if (jar == '' || !(jar.endsWith('.jar') || jar.endsWith('.war')) ) {
        this.$message.error('请输入正确的jar/war路径');
        return;
      }
      
      const args = {
        jarpath: jar,
      };
      this.$ipcCall(ipcApiRoute.execJvdetector, args).then(res=>{
        if (res) {
          console.log("start exec jvdetector");
          this.$message.success('测试已开始');
        } else {
          this.$message.error('测试开启失败');
        }
      });
      
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
