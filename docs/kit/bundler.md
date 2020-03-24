## webpack介绍
> webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

打包的基本步骤可以拆分为以下三步：
1. 生成单个文件的依赖；

2. 从入口开始递归分析，生成依赖图谱；

3. 生成最后打包代码；

**webpack的打包过程，会基于这些基本步骤进行扩展，比如Loader就是用于打包前对模块源代码进行转换，Plugin就是在编译构建时将特定的任务注入特定的钩子中。**

## 简析实现一个打包工具
假如src目录有以下文件：
``` js
//index.js
import message from './message.js';
console.log(message);

//message.js
import { word } from './word.js';
const message = `say ${word}`;
export default message;

//word.js
export const word = 'hello';
```
使用一个bundler.js给src目录下文件进行打包

**1.从入口开始进行模块分析**
``` js
const fs = require('fs');
const path = require('path');
// 将代码解析为AST抽象语法树
const parser = require('@babel/parser');
// 遍历抽象语法树的工具，可以在语法树中解析特定的节点
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const moduleAnalyser = (filename) => {
  // 读取入口文件
  const content = fs.readFileSync(filename, 'utf-8');
  // 转为AST抽象语法树
  const ast = parser.parse(content,{
    sourceType: 'module'
  });
  const dependencies = {};
  // 遍历AST抽象语法树
  traverse(ast,{
    // type:ImportDeclaration的模块
    ImportDeclaration({ node }){
      const dirname = path.dirname(filename);
      const filePath = './' + path.join(dirname, node.source.value);
      // 保存入口文件的依赖模块的路径
      dependencies[node.source.value] = filePath;
    }
  })
  //通过@babel/core和@babel/preset-env进行代码的转换（webpack里Loader干的事情）
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })
  return {
    filename, // 分析模块所在的路径
    dependencies, // 分析模块的依赖相对于bundler.js文件路径
    code // 转换后的源代码
  }
}
// console.log(moduleAnalyser('./src/index.js'))
```
测试打印入口文件的依赖Map:
<img src="/notes/kit/bundler/singleMap.png" style="display:block;margin:0 auto"/>

**2.生成依赖图谱**
``` js
const makeDependenciesGraph = ( entry ) => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for(let i = 0; i < graphArray.length; i++){
    const item = graphArray[i];
    const { dependencies } = item;
    if(dependencies){
      for(let j in dependencies){
        graphArray.push(
          moduleAnalyser(dependencies[j])
        )
      }
    }
  }
  // 生成图谱
  const graph = {};
  graphArray.forEach(item => {
      graph[item.filename] = {
          dependencies: item.dependencies,
          code: item.code
      }
  })
  return graph;
}
// console.log(makeDependenciesGraph('./src/index.js'))
```
测试打印依赖图谱:
<img src="/notes/kit/bundler/graph.png" style="display:block;margin:0 auto"/>

**3.生成最后打包代码**
``` js
/**
 * 要让require/exports能正常运行，所以得定义这两个东西
 */
const generateCode = ( entry ) => {
  // 要先把对象转换为字符串，模板字符串中会默认调取对象的toString方法，参数变成[Object object]
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  return `
    (function(graph){
      function require(module){
        // 修改源代码中reuqire路径
        function localRequire(relativePath){
          return require(graph[module].dependencies[relativePath]);
        }
        var exports  = {};

        (function(require, exports, code){
          eval(code)
        })(localRequire, exports, graph[module].code);

        return exports;
      }

      require('${entry}')
    })(${graph})
  `
}
// console.log(generateCode('./src/index.js'))
```
测试生成的代码字符串:
<img src="/notes/kit/bundler/strFunction.png" style="display:block;margin:0 auto"/>
将生成的这段代码字符串放在浏览器端执行:
<img src="/notes/kit/bundler/browserTest.png" style="display:block;margin:0 auto"/>

## 对比使用webpack打包
``` js
/**
 * mode: 'development', // 不压缩
 * devtool: '' // 去掉sourcemap,模块不会被eval包裹更直观
 */ 
webpack --mode development --devtool none index.js --output dist/main.js
```
打包构建的main.js如下所示（做了简单的格式化）：
<img src="/notes/kit/bundler/webpackBundler.png" style="display:block;margin:0 auto"/>
> __webpack_require__和__webpack_exports__跟上面写的require和exports是不是很相似，详细细节就不多做介绍了。

## 总结
上述写的简易打包工具构建完成后新建一个dist目录，再将这些字符串放在main.js文件里，就跟平日里开发npm run build的效果很相似了。
> 当然这就是个简单玩具工具罢了，只是为了深入阅读webpack有个前置思想准备。