<template>
  <div id="app-base-file">
    
    <div class="one-block-1">
      <span>
        1. 目标站点信息
      </span>
    </div>  
    <div class="one-block-2">
      <!-- todo 加入选择目录的按钮功能 -->
      <a-space style="margin: 5px">
        <span>源代码路径</span>  
      </a-space>
      <div />
      <a-input v-model="target_info.src_dir" placeholder="java源代码路径" style="width: 460px">
      </a-input>  
      <a-button 
      @click="selectFile">
      选择文件夹
      </a-button>
    </div>

    <div class="one-block-2" style="width: 600px">
      <a-space style="margin: 5px">
        <span>待检查数据表和字段</span>  
      </a-space>
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item :validate-status="tableNameError() ? 'error' : ''" :help="tableNameError() || ''">
          <a-input
            v-decorator="[
              'tableName',
              { rules: [{ required: true, message: '请输入数据库表名' }] },
            ]"
            placeholder="数据库表名"
          >
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item :validate-status="columnError() ? 'error' : ''" :help="columnError() || ''">
          <a-input  
            v-decorator="[
              'column',
              { rules: [{ required: true, message: '请输入待检查字段' }] },
            ]"
            type="column"
            placeholder="待检查字段"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="one-block-1">
      <span>
        2. 测试模式
      </span>
    </div>  
    <div class="one-block-2" style="width: 720px">
       <a-radio-group v-model="target_info.mode" defaultValue="mybatis">
        <a-radio-button value="mybatis">Mybatis</a-radio-button>
        <a-radio-button value="hibernate">Hibernate</a-radio-button>
      </a-radio-group>
    </div>

    <div class="one-block-1">
      <span>
        3. 保存配置
      </span>
    </div>  

    <div class="one-block-2">
      <a-button type="primary" icon="save" @click="saveConfig">
        保存配置
      </a-button>
    </div> 

    <div class="one-block-1">
      <span>
        4. 开始执行任务
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button type="primary" :icon="isRunning? 'sync':'caret-right'" @click="openSoft">开始</a-button>
        <!-- <a-button @click="socketMsgStop">结束</a-button> -->
      </a-space>
    </div>
  </div>
</template>
<script>

import { ipcApiRoute } from '@/api/main'
import { vulOptions } from '@/utils/vulConfig'
const fs = require('fs');

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export default {
  data() {
    return {
      isRunning: false,
      socketMessageString: '',
      logicDetector:'.\\SourceCodeDetector\\SourceCodeDetector.exe',
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      target_info: {
        src_dir: "",
        db_config:[],
        mode:"mybatis"
      },
    };
  },
  methods: {
    selectFile() {
      this.$ipcCall(ipcApiRoute.selectFolder, '').then(r => {
        this.target_info.src_dir = r;
        // this.$message.info(r);
      })      
    },
    startRun() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.openSoft();
      }
    },
    openSoft () {
      const self = this;   
      this.$ipcCall(ipcApiRoute.openSoftware, this.logicDetector).then(result => {
        if (!result) {
          self.$message.error('程序不存在');
        }
        this.isRunning = false;
      })       
    },
    // Only show error after a field is touched.
    tableNameError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('tableName') && getFieldError('tableName');
    },
    // Only show error after a field is touched.
    columnError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('column') && getFieldError('column');
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.target_info.db_config.push({"table_name":values.tableName,"belong_to_column":values.column});
          this.$message.success('已保存');
        }
      });
    },
  
    saveConfig() {
      if (this.target_info.src_dir=='') {
        this.$message.error('请输入源代码路径');
        return;
      }
      
      console.log("Save config: ", JSON.stringify(this.target_info));
      const data = JSON.stringify(this.target_info);
      const args = {
        filename: '.\\SourceCodeDetector\\config.json',
        data: data,
      };
      this.$ipcCall(ipcApiRoute.writeToFile, args).then(res=>{
        if (res) {
          console.log("write success.");
          this.$message.success('配置已保存');
        } else {
          this.$message.error('配置保存失败');
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
