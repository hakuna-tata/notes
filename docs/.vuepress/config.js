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
      { text: '计算机网络', link: '/network/networkLayer' },
      { text: 'Docker', link: '/docker/singleMac' },
      { text: 'Webpack构建', link: '/bundler/' },
      {   
        text: 'Web系列',
        items: [
          { text: 'Web安全', link: '/webSecurity/client/'},
          { text: '浏览器工作原理与实践', link: '/browser/'},
        ]
      }
    ],
    sidebar:{
      '/network/':[
        {
          title: '计算机网络',
          collapsable: false, 
          children:[
            ['networkLayer','网络层'],
            ['transportLayer','传输层']
          ]
        }
      ],
      '/docker/': [
        {
          title: 'Docker 笔记',
          collapsable: false,
          children:[
            ['singleMac', '单机容器网络'],
            ['multipleMac', '多机容器网络'],
            ['volume', '持久化存储和数据共享']
          ]
        }
      ],
      '/bundler/':[
        {
          collapsable: false,
          children:[
            ['','探索Webpack']
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
          collapsable: false,
          children:[
            ['','浏览器工作原理与实践']
          ]
        }
      ]
    },
    lastUpdated: '上次更新'
  }
}
