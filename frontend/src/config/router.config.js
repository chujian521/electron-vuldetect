/**
 * 基础路由
 * @type { *[] }
 */
import { AppSider, Menu } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}
export const constantRouterMap = [
  {
    path: '/',
    component: AppSider,
    children: [
      {
        path: '/base',
        name: 'Base',
        component: Menu,
        children: [
          {
            path: '/base/index',
            name: 'BaseIndex',
            component: () => import('@/views/base/config/Index')
          },
          {
            path: '/base/config/index',
            name: 'BaseConfigIndex',
            component: () => import('@/views/base/config/Index'),
            meta: {
              keepAlive: true
            }
          },
          {
            path: '/base/payconfig/index',
            name: 'BasePayConfigIndex',
            component: () => import('@/views/base/payconfig/Index'),
            meta: {
              keepAlive: true
            }
          },
          {
            path: '/base/exec/index',
            name: 'BaseExecIndex',
            component: () => import('@/views/base/exec/Index')
          },
          {
            path: '/base/report/index',
            name: 'BaseReportIndex',
            component: () => import('@/views/base/report/Index')
          },
          {
            path: '/base/payexec/index',
            name: 'BasePayExecIndex',
            component: () => import('@/views/base/payexec/Index')
          },
          {
            path: '/base/payreport/index',
            name: 'BasePayReportIndex',
            component: () => import('@/views/base/payreport/Index')
          },
          {
            path: '/base/powermonitor/index',
            name: 'BasePowerMonitorIndex',
            component: () => import('@/views/base/powermonitor/Index')
          },
          {
            path: '/base/screen/index',
            name: 'BaseScreenIndex',
            component: () => import('@/views/base/screen/Index')
          },
          {
            path: '/base/theme/index',
            name: 'BaseThemeIndex',
            component: () => import('@/views/base/theme/Index')
          },
          {
            path: '/base/software/open',
            name: 'BaseSoftwareIndex',
            component: () => import('@/views/base/software/Index')
          },
          {
            path: '/base/system/index',
            name: 'BaseSystemIndex',
            component: () => import('@/views/base/system/Index')
          },
          {
            path: '/base/testapi/index',
            name: 'BaseTestApiIndex',
            component: () => import('@/views/base/testapi/Index')
          },
          {
            path: '/base/updater/index',
            name: 'BaseUpdaterIndex',
            component: () => import('@/views/base/updater/Index')
          },
        ]
      },
      {
        path: '/white',
        name: 'White',
        component: () => import('@/views/white/Index'),
        children: [
          {
            path: '/white/index',
            name: 'WhiteIndex',
            component: () => import('@/views/white/authority/Index')
          },
          {
            path: '/white/authority/index',
            name: 'AuthorityIndex',
            component: () => import('@/views/white/authority/Index')
          },
          {
            path: '/white/file/index',
            name: 'FileUploadIndex',
            component: () => import('@/views/white/file/Index')
          },
          {
            path: '/white/payment/index',
            name: 'PaymentIndex',
            component: () => import('@/views/white/payment/Index')
          },
          {
            path: '/white/report/index',
            name: 'WReportIndex',
            component: () => import('@/views/white/report/Index')
          }
        ]
      },
      {
        path: '/other/index',
        name: 'OtherIndex',
        component: () => import('@/views/other/Index')
      }
    ]
  }
]
