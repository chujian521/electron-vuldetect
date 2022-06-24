<template>
  <div id="app-base-db">
    <div class="one-block-1">
      <span>
        1. 目标站点信息
      </span>
    </div>  
    <div class="one-block-2">
      <a-space style="margin: 5px">
        <span>网站入口：</span>  
      </a-space>
      <a-input v-model="url" placeholder="URL" style="width: 460px">
      </a-input>  
    </div>

    <div class="one-block-2" style="width: 600px">
      <a-space style="margin: 5px">
        <span>用户密码</span>
        <a-switch @change="authChange" />
      </a-space>
      
      <a-form layout="inline" :form="form" @submit="handleSubmitUser">
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入用户名1' }] },
            ]"
            :disabled="noAuth"
            placeholder="用户名1"
          >
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input  
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码1' }] },
            ]"
            :disabled="noAuth"
            type="password"
            placeholder="密码1"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item >
          <a-input
            v-decorator="[
              'userName2',
              { rules: [{ required: true, message: '请输入用户名2' }] },
            ]"
            :disabled="noAuth"
            placeholder="用户名2"
          >
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item >
          <a-input  
            v-decorator="[
              'password2',
              { rules: [{ required: true, message: '请输入密码2' }] },
            ]"
            :disabled="noAuth"
            type="password"
            placeholder="密码2"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="noAuth">
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
      <a-space style="margin: 5px">
        <span>日志等级：</span>  
        <a-select slot="addonBefore" v-model="log_level" default-value="20" style="width: 80px">
          <a-select-option value="10">
            Debug
          </a-select-option>
          <a-select-option value="20">
            Info
          </a-select-option>
          <a-select-option value="30">
            Warning
          </a-select-option>
          <a-select-option value="40">
            Error
          </a-select-option>
        </a-select>
      </a-space>
      <a-space style="margin: 5px">
        <span>手机页面：</span>  
        <a-switch @change="mobileChange" />
      </a-space>
      <a-space style="margin: 5px">
        <span>测试过程展示浏览器：</span>  
        <a-switch @change="browserShowChange" />
      </a-space>
    </div>
    <div class="one-block-2">
      <a-space style="margin: 5px">
        <span>复测模式：</span>  
        <a-switch @change="retestChange" />
      </a-space>
      复测文件：<a-input 
        v-model="retestpath"
        :disabled="!retest"
        placeholder="yyyy-mm-dd_hh-mm-ss.py"
      style="width: 360px"></a-input>
      <a-button 
      :disabled="!retest"
      @click="selectFile">
      选择文件
      </a-button>
    </div>
    <div class="one-block-2">
      <a-space style="margin: 5px">
        <span>数据库检查模式：</span>  
        <a-switch @change="dbChange" />
      </a-space>
    </div>
    <div class="one-block-2">

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
  </div>
</template>
<script>

import { ipcApiRoute } from '@/api/main'


const httpRegx = new RegExp('^https?:\\/\\/.*$', 'i');

export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      url: "",
      schema: "https://",
      noAuth: true,
      log_level: 20,
      is_mobile_page: false,
      BROWSER_DEBUG_MODE: false,
      retest: false,
      retestpath: "",
      CHECK_METHOD_FLAG: false,
      target_info: {
        "url": "",
        "det_domain_name": "",
        "is_mobile_page": false,
        "log_level" : 20,
        "retest": false,
        "retestpath": "",
        "BROWSER_DEBUG_MODE" : false,
        "CHECK_METHOD_FLAG" : {"DB": true, "HTML": false},

        "user_id" : "3",
        "user_id_key_word" : "customer_id",
        "result_db_host" : "212.129.223.198",
        "result_db_user" : "remote_access",
        "result_db_password" : "123456",
        "result_db_database" : "open30",
        "result_db_table" : "oc_order",
        "result_db_order_id_keyword" : "order_id",
        "result_db_target_value" : {"payment": "payment_method", "price": "total", "status": "order_status_id", "voucher": false},

        "result_db_quantity_table" : "oc_order_product",
        "result_db_quantity_order_id_keyword" : "order_id",
        "result_db_quantity_product_key_keyword" : "model",
        "result_db_quantity_product_value_keyword" : "quantity",

        "userID": "",
        "password": "",
        "userID1": "",
        "password1": "",
      },
    };
  },
  methods: {
    handleSubmitUser(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.target_info.userID = values.userName;
          this.target_info.password = values.password;
          this.target_info.userID1 = values.userName2;
          this.target_info.password1 = values.password2;
        }
      });
    },
    selectFile() {
      this.$ipcCall(ipcApiRoute.selectFile, '').then(r => {
        let fileName = r.match(/[^\\/]+\.[^\\/]+$/)[0]; 
        this.retestpath = fileName;
        this.$message.info(r);
      })      
    },
    authChange(checked) {
      console.log(`a-switch to ${checked}`);
      this.noAuth = !checked;
    },
    mobileChange(checked) {
      console.log(`a-switch to ${checked}`);
      this.is_mobile_page = checked;
    },
    browserShowChange(checked){
      console.log(`a-switch to ${checked}`);
      this.BROWSER_DEBUG_MODE = checked;
    },
    retestChange(checked){
      console.log(`a-switch to ${checked}`);
      this.retest = checked;
    },
    dbChange(checked){
      console.log(`a-switch to ${checked}`);
      this.CHECK_METHOD_FLAG = checked;
    },
    saveConfig() {
      if (this.url=='' || !httpRegx.test(this.url)) {
        this.$message.error('请检查目标网址');
        return;
      }
      if (this.retestpath=='' && this.retest) {
        this.$message.error('请输入复测文件位置');
        return;
      }

      console.log('Save url: ,', this.target_info.url);
      this.target_info.url = this.url;
      this.target_info.is_mobile_page = this.is_mobile_page;
      this.target_info.log_level = parseInt(this.log_level);
      this.target_info.retest = this.retest;
      this.target_info.retestpath = "./UA_module/UA_record/"+this.retestpath;
      this.target_info.BROWSER_DEBUG_MODE = this.BROWSER_DEBUG_MODE;
      if (this.CHECK_METHOD_FLAG){
        this.target_info.CHECK_METHOD_FLAG = {"DB": true, "HTML": false};
      }else{
        this.target_info.CHECK_METHOD_FLAG = {"DB": false, "HTML": true};
      }
      if(this.url){
        var domain = this.url.split('/');
        if( domain[2] ) {
            this.target_info.det_domain_name = domain[2];
        } else {
            this.target_info.det_domain_name = ''; //如果url不正确就取空
        }
      }
      console.log("Save config: ", JSON.stringify(this.target_info));
      const data = JSON.stringify(this.target_info);
      const args = {
        filename: '.\\DetLogic\\config.json',
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
#app-base-db {
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
