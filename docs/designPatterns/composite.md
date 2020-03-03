> 定义：用小的子对象来构建更大的对象，将对象组合成树形结构以表示“部分整体”的结构层次。  
> **使用vue的虚拟DOM中的vnode来介绍组合模式**  

1. **Vue中vnode**
``` javascript
{
  tag:"div",
  attr:{
    id:"div",
    className:"container"
  },
  children:[
    {
      tag:"p",
      attr:{},
      children:['123']
    },
    {
      tag:"p",
      attr:{},
      children:['456']
    }
  ]
}

<div id="div" class="container">
  <p>123</p>
  <p>456</p>
</div>
```