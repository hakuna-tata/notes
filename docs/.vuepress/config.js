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
      { text: 'Web安全', link: '/webSecurity/' },
      { text: '设计模式', link: '/designPatterns/' },
      { text: '算法与数据结构', link: '/algorithm/' }
    ],
    sidebar:{
      '/webSecurity/':[
        {
          title: 'Web安全漏洞分析与防御',
          collapsable: false, 
          children:[
            ['','介绍'],
            ['client','客户端脚本安全'],
            ['transport','流量劫持'],
            ['server','服务端应用安全']
          ]
        },
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
            ['proxy', '代理模式'],
            ['exterior', '外观模式'],
            ['adapter', '适配器模式'],
            ['decorator', '装饰器模式'],
            ['iterator', '迭代器模式'],
            ['state', '状态模式'],
            ['share', '享元模式'],
            ['observer', '观察者模式'],
            ['command', '命令模式'],
            ['chain', '职责链模式']
          ]
        }
      ],
      '/algorithm/':[
        {
          title: '介绍',
          children:[
            ['','介绍']
          ]
        },
        {
          title: '算法复杂度',
          children: [
            ['algorithmComplexity','什么是大O(Big O)']
          ]
        },
        {
          title: '链表',
          children: [
            'link'
          ]
        }
      ]
    },
    lastUpdated: '上次更新'
  }
}
