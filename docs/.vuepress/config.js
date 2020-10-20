module.exports = {
  base: '/notes/',
  dest: './dist',
  title: 'FFFXUE',
  description: '开发笔记',
  head: [
    ['link', { rel: 'icon', href: '/flag.ico' }],
  ],
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    repo: 'hakuna-tata/notes/',
    nav: [
      { text: '计算机网络', link: '/network/' },
      { text: 'Docker', link: '/docker/' },
      { text: '设计模式', link: '/designPatterns/' },
      {   
        text: 'Web系列',
        items: [
          { text: 'Web安全', link: '/webSecurity/client/'},
          { text: '浏览器工作原理与实践', link: '/browser/'},
          { text: '玩具工具包', link: '/kit/bundler/' }
        ]
      }
    ],
    sidebar:{
      '/network/':[
        {
          title: '计算机网络',
          collapsable: false, 
          children:[
            ['','概述'],
            ['networkLayer','网络层'],
            ['transportLayer','传输层'],
            ['securityLayer', '安全层']
          ]
        }
      ],
      '/designPatterns/':[
        {
          title: '设计模式',
          collapsable: false, 
          children:[
            ['','介绍'],
            ['factory', '工厂模式'],
            ['singleton', '单例模式'],
            ['strategy', '策略模式'],
            ['state', '状态模式'],
            ['proxy', '代理模式'],
            ['exterior', '外观模式'],
            ['adapter', '适配器模式'],
            ['decorator', '装饰器模式'],
            ['share', '享元模式'],
            ['composite', '组合模式'],
            ['iterator', '迭代器模式'],
            ['observer', '观察者模式']
          ]
        }
      ],
      '/kit/':[
        {
          title: '玩具工具包',
          collapsable: false,
          children:[
            ['bundler','Bundler'],
            ['koa','Koa']
          ]
        }
      ],
      '/webSecurity/':[
        {
          title: 'Web安全漏洞分析与防御',
          collapsable: false, 
          children:[
            ['client','客户端脚本安全'],
            ['transport','流量劫持'],
            ['server','服务端应用安全']
          ]
        },
      ],
      '/browser/':[
        {
          title: '浏览器工作原理与实践',
          collapsable: false,
          children:[
            ['','探索浏览器']
          ]
        }
      ]
    },
    lastUpdated: '上次更新'
  }
}
