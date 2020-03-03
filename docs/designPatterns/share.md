> 定义：运用共享技术有效地支持大量的细粒度的对象，避免对象间拥有相同的内容造成多余的开销。  
> **未找到很经典的应用场景，举个类似简单的示例**

1. **业务场景**
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- 无限下拉列表，将事件代理到高层节点上 -->
  <!-- 如果都绑定到<a>标签对内存开销太大 -->
  <div id="div">
    <a href="#">a1</a>
    <a href="#">a2</a>
    <a href="#">a3</a>
    <a href="#">a4</a>
    <a href="#">a5</a>
    <!-- a -->
  </div>
  <script>
    var div = document.getElementById("div")
    console.log(div)
    div.addEventListener("click", function(e){
      var target = e.target
      if(target.nodeName === 'A'){
        alert(target.innerHTML)
      }
    })
  </script>
</body>
</html>
```