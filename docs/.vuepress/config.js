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
