<template>
  <a-layout id="app-menu">
    <a-layout-sider
      theme="light"
      class="layout-sider"
      width="120"
    >
      <a-menu theme="light" mode="inline" :default-selected-keys="['menu_100']">
        <a-menu-item v-for="(menuInfo, subIndex) in showList" :key="subIndex" >
          <router-link :to="{ name: menuInfo.pageName, params: menuInfo.params}">
            <span >{{ menuInfo.title }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <keep-alive>
          <router-view />
        </keep-alive>
        
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      menu: {
        'menu_100' : {
          icon: 'profile',
          title: '文件上传',
          pageName: 'FileUploadIndex',
          params: {},
          show: true
        },
        'menu_101' : {
          icon: 'profile',
          title: '支付漏洞',
          pageName: 'PaymentIndex',
          params: {},
          show: true
        },
        'menu_200' : {
          icon: 'profile',
          title: '检测结果',
          pageName: 'WReportIndex',
          params: {},
          show: true
        }
                                        
      }
    };
  },
  computed: {
    showList() {
      let fdict = {};
      for (var key in this.menu) {
        if (this.menu[key].show) {
          fdict[key] = this.menu[key]
        }
      }
      return fdict
    }
  },
  created () {
  },
  mounted () {
    this.menuHandle({key: 'menu_100'})
  },
  methods: {
    menuHandle (item) {
      const linkInfo = this.menu[item.key]
      this.$router.push({ name: linkInfo.pageName, params: linkInfo.params})
    }
  }
  
};
</script>
<style lang="less" scoped>
#app-menu {
  height: 100%;
  text-align: center;
  .layout-sider {
    border-top: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    background-color: #FAFAFA;
    overflow: auto;
  }
}
</style>
