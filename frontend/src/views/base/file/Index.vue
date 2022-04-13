<template>
  <div id="app-base-file">
    
    <div class="one-block-1">
      <span>
        1. 目标站点信息
      </span>
    </div>  
    <div class="one-block-2">
      <a-space style="margin: 5px">
        <span>网站入口</span>  
      </a-space>
      <div />
      <a-input v-model="url" placeholder="URL" style="width: 460px">
        <a-select slot="addonBefore" v-model="schema" default-value="https://" style="width: 80px">
          <a-select-option value="http://">
            Http://
          </a-select-option>
          <a-select-option value="https://">
            Https://
          </a-select-option>
        </a-select>
      </a-input>  
    </div>

    <div class="one-block-2" style="width: 600px">
      <a-space style="margin: 5px">
        <span>用户密码</span>
        <a-switch default-checked @change="authChange" />
      </a-space>
      
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入用户名' }] },
            ]"
            :disabled="noAuth"
            placeholder="用户名"
          >
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
          <a-input  
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码' }] },
            ]"
            :disabled="noAuth"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="noAuth||hasErrors(form.getFieldsError())">
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
      <a-row :gutter="[0,16]">
        <a-col :span="8">
          <a-card title="短信相关漏洞" style="width: 225px; height: 300px">
            <a-switch slot="extra" checked-children="全选" un-checked-children="否" default-checked style="width: 57px" @change="smsAllCheck" />
            <a-checkbox-group v-model="sms_state" >
              <a-row v-for="value in smsVul" :key="value">
                <a-col :span="12">
                  <a-checkbox :value="value" style="width: 200px">{{ value }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card title="验证码相关漏洞" style="width: 225px; height: 300px">
            <a-switch slot="extra" checked-children="全选" un-checked-children="否" default-checked style="width: 57px" @change="capAllCheck" />
            <a-checkbox-group v-model="cap_state" >
              <a-row v-for="value in captchaVul" :key="value">
                <a-col :span="12">
                  <a-checkbox :value="value" style="width: 200px">{{ value }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card title="其他漏洞" style="width: 225px; height: 300px">
            <a-switch slot="extra" checked-children="全选" un-checked-children="否" default-checked style="width: 57px" @change="otherAllCheck" />
            <a-checkbox-group v-model="other_state" >
              <a-row v-for="value in otherVul" :key="value">
                <a-col :span="12">
                  <a-checkbox :value="value" style="width: 200px">{{ value }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </a-col>

      </a-row>  
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
import { vulOptions } from '@/utils/vulConfig'
const fs = require('fs');

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const smsVul = [
  '短信轰炸', '短信验证码重复利用', '短信验证码未绑定',
  '短信验证码返回前端', '短信内容可控', '短信验证码可绕过',
  '短信验证码可爆破'
]

const captchaVul = [
  '图形验证码返回前端', '验证码过于简单', '验证码长度可控',
  '验证码可识别', '验证码重复利用', '邮件验证码安全',
  '无验证码', '图形验证码可绕过', '前端可控验证码生成'
]

const otherVul = [
  '登录绕过', '密码重置无需原密码', '会话令牌写入URL',
  '任意文件下载'
]

const httpRegx = new RegExp('^https?:\\/\\/.*$', 'i');

export default {
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      url: "",
      schema: "https://",
      noAuth: false,
      target_info: {
        "url": "",
        "username": "",
        "password": "",
        'modules': [],
      },
      smsVul,
      captchaVul,
      otherVul,
      sms_state: smsVul,
      cap_state: captchaVul,
      other_state: otherVul,
    };
  },
  methods: {
    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form;
      return (!this.noAuth) && isFieldTouched('userName') && getFieldError('userName');
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form;
      return (!this.noAuth) && isFieldTouched('password') && getFieldError('password');
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.target_info.username = values.userName;
          this.target_info.password = values.password;
        }
      });
    },
    authChange(checked) {
      console.log(`a-switch to ${checked}`);
      this.noAuth = !checked;
    },
    smsAllCheck(checked) {
      this.sms_state = checked? smsVul: [];
    },
    capAllCheck(checked) {
      this.cap_state = checked? captchaVul: [];
    },
    otherAllCheck(checked) {
      this.other_state = checked? otherVul: [];
    },
    saveConfig() {
      if (this.url=='') {
        this.$message.error('请输入目标网址');
        return;
      }

      this.target_info.url = httpRegx.test(this.url)? this.url : this.schema+this.url;
      console.log('Save url: ,', this.target_info.url);
      this.target_info.modules = [];
      for (const v of this.sms_state) {
        for (const key of vulOptions[v])
          this.target_info.modules.push(key);
      }
      for (const v of this.cap_state) {
        for (const key of vulOptions[v])
          this.target_info.modules.push(key);
      }
      for (const v of this.other_state) {
        for (const key of vulOptions[v])
          this.target_info.modules.push(key);
      }
      // console.log("Save config: ", JSON.stringify(this.target_info));
      const data = JSON.stringify(this.target_info);
      const args = {
        filename: '.\\LogicDetector\\options.json',
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
