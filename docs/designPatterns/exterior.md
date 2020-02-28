> 定义： 定义了一个高层（统一）接口，这个接口使子系统业务更加容易使用。  
> **使用Vue中的createElement来介绍外观模式**

1. **Vue中createElement**
``` javascript
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 判断data是不是数组,或者是不是基本类型，来判断data是否传入
  if (Array.isArray(data) || isPrimitive(data)) {
    // children，normalizationType向前赋值，data为undefined
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

```