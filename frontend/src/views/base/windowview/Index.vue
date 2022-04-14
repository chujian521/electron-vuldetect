<template>
  <div id="app-base-window-view">
    
    <div class="one-block-1">
      <a-space style="margin:5px">
        <a-icon type="file-word" />
        <span>漏洞报告</span>  
      </a-space>
      <a-space style="float:right; margin:5px; height:24px">
        <a-button type="primary" icon="folder" @click="openFolder">打开文件夹</a-button>
      </a-space>
    </div>  
    <div class="one-block-2">
      <span v-if="Object.keys(report_list)==0" style="margin-left:6px">暂无报告</span>
      <a-collapse v-model="activeKey">
        <a-collapse-panel v-for="(urlInfo, url) in report_list" :key="url" :header="url">
          <a-table :columns="reportCols" :data-source="getData(urlInfo)">
            <template slot="vul" slot-scope="text, record, index">
              <span v-if="text!=''">
                <a @click="() => openReport(text, index)">点击查看</a>
              </span>
              <span v-else>无</span>
            </template>
          </a-table>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div> 
</template>
<script>
import { ipcApiRoute } from '@/api/main'

// this.report_list:{
//   url1: {
//     date1: {
//       vul: xxx.docx,
//       notVul: xxx.docx,
//     },
//     date2: {
//       vul: xxx.docx,
//       notVul: xxx.docx,
//     },
//   },
//   url2: {
//     date1: {
//       vul: xxx.docx,
//       notVul: xxx.docx,
//     },
//   },
// }
const reportDir = '.\\LogicDetector\\reports';

export default {
  data() {
    return {
      reports: [],
      timer: '',
      report_list: {},
      activeKey: [],
      
      reportCols: [
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
          defaultSortOrder: 'descend',
          sorter: (a, b) => {
            const adate = new Date(a.date);
            const bdate = new Date(b.date);
            return adate > bdate;
          },
        },
        {
          title: '漏洞报告',
          dataIndex: 'vul',
          scopedSlots: { customRender: 'vul' },
        },
        {
          title: '无漏洞报告',
          dataIndex: 'notVul',
          scopedSlots: { customRender: 'vul' },
        },
      ],
      
    };
  },
  mounted() {
      this.timer = setInterval(this.parse_reports, 1000);
      this.parse_reports();
  },
  methods: {
    parse_reports() {
      this.$ipcCall(ipcApiRoute.listReports, reportDir).then(res=>{
        if (res) {
          this.updateReports(res);
        } else {
          this.updateReports([]);
        }
      });
    },
    updateReports(res) {
      if (res.length==this.reports.length) {return;}
      this.reports = res;
      this.report_list = {};
      let rlist = this.report_list;
      for (const r_obj of this.reports) {
        const url = r_obj.url;
        const reportName = r_obj.reportName;
        const date = r_obj.date;
        let isVul = reportName.indexOf('not_vul')==-1;
        if (rlist && url in rlist) {
          if (rlist[url] && date in rlist[url]) {
            rlist[url][date][isVul?'vul':'notVul'] = reportName;
          } else {
            rlist[url][date] = {};
            rlist[url][date][isVul?'vul':'notVul'] = reportName;
          }
        } else {
          rlist[url] = {};
          rlist[url][date] = {};
          rlist[url][date][isVul?'vul':'notVul'] = reportName;
        }
      }
    },
    getData(urlInfo) {
      let res = [];
        //console.log(JSON.stringify(urlInfo));
        for (const date in urlInfo) {
          const reports = urlInfo[date];
          res.push({
            date: date,
            vul: 'vul' in reports? reports.vul : '',
            notVul: 'notVul' in reports? reports.notVul : '',
          })
          
        }
        console.log(JSON.stringify(res));
        return res;
    },
    renderVul(path, row, index) {
      return <a href="javascript:;" >点击查看</a>;
    },
    openReport(key, index) {
      // this.$message.info(key);
      this.$ipcCall(ipcApiRoute.openFile, key).then(result => {
        if (!result) {
          this.$message.error('文件不存在');
        }
        this.isRunning = false;
      })
    },
    openFolder(){
      this.$ipcCall(ipcApiRoute.openFolder, reportDir).then(result => {
        if (!result) {
          this.$message.error('文件夹不存在');
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
#app-base-window-view {
  padding: 10px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    font-weight:bold;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid rgb(235, 237, 240);
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
