## 时间复杂度和空间复杂度
>求解一个问题可能有多个算法，它的优劣主要从**算法执行时间**和**需要占用的存储空间**两个方面来衡量。

注：算法执行时间的衡量不是采用算法执行的绝对时间来计算的。因为一个算法在不同机器，不同时刻，不同网络等情况下使得算法执行的时间都是不一样的。所以:  
1. 算法时间复杂度**采用执行过程中其基本操作的执行次数，即计算量来度量**。
2. 算法空间复杂度考虑的是算法中除了存储数据本身以外**开辟了多少存储空间**。

## 什么是大O(Big O)
算法中基本操作的执行次数一般是与问题规模有关的(n)，**用T(n)表示算法基本操作的执行次数**。
>为评价算法的时间复杂度与空间复杂度，所以引入记号为“O”的数字符号。

例：设T(n)和f(n)是定义在正整数集合上的两个函数，如果存在常数C和n1，使得当n >= n1时都有 0 <= T(n) <= C * f(n)，则记T(n) = O(f(n))。
> 所以当比较不同算法的时间复杂度时，主要标准是看不同算法时间复杂度所处的**数量级**。

1. 常见算法的时间复杂度数量级排列：  
* O(1) < O(logn) < O(sqrt(n)) < O(n) < O(nlogn) < O(n^2) < O(n^3) < ... < O(2^n) < ...

2.  常见算法的空间复杂度：
* 它的度量方法和算法的时间复杂度相似（**递归调用具有严重空间代价**）

## 数据规模的概念
``` js
function TimeConsume(){
  for(let i = 1; i <= 10; i++){
    let n = Math.pow(10, i);
    let sum = 0;
    console.time(`10^${i}数量级消耗时间为`);
    for(let j = 0; j < n; j++){
      sum += j;
    }
    console.timeEnd(`10^${i}数量级消耗时间为`);
  }
}
TimeConsume()
// 10^1数量级消耗时间为: 0.005859375ms
// 10^2数量级消耗时间为: 0.01171875ms
// 10^3数量级消耗时间为: 0.0458984375ms
// 10^4数量级消耗时间为: 0.22509765625ms
// 10^5数量级消耗时间为: 5.206787109375ms
// 10^6数量级消耗时间为: 1.19189453125ms
// 10^7数量级消耗时间为: 11.2080078125ms
// 10^8数量级消耗时间为: 103.906005859375ms
// 10^9数量级消耗时间为: 1031.48974609375ms
// 10^10数量级消耗时间为: 12557.5361328125ms
```
所以，如果想要在1s内解决问题:
> O(n^2)的算法可以处理大约在 10^4 级别的数量  
> O(n)的算法可以处理大约在 10^8 级别的数量  
> O(nlogn)的算法可以处理大约在 10^7 级别的数量

## 试验自己算法的复杂度
> **通过实验，将数据规模从N => 2N，观察时间变化的趋势（这样做可以有效地排除 常数C 对计算带来的误差）**

1. **时间复杂度为O(logn)**
```js
(function(){
  var action = {
    generatorRandomArr: function(n){
      let arr = [];
      for(let i = 0; i < n; i++){
        arr.push(i)
      }
      return arr;
    },
    binarySearch: function(arr, target){
      let start = 0, 
        end = arr.length;
      while(start <= end){
        let mid = Math.floor((start + end) / 2);
        if(target === arr[mid]){
          return mid;
        }else if(target > arr[mid]){
          start = mid + 1;
        }else if(target < arr[mid]){
          end = mid - 1;
        }
      }
    },
    TimeConsume: function(){
      for(let i = 20; i <= 25; i++){
        let n = Math.pow(2, i);
        let arr = this.generatorRandomArr(n);
        console.time(`2^${i}所消耗的时间为`);
        this.binarySearch(arr, Math.floor(Math.random() * n));
        console.timeEnd(`2^${i}所消耗的时间为`);
      }
    }
  }
  return action.TimeConsume()
})()
// 2^20所消耗的时间为: 0.013ms
// 2^21所消耗的时间为: 0.018ms
// 2^22所消耗的时间为: 0.017ms
// 2^23所消耗的时间为: 0.022ms
// 2^24所消耗的时间为: 0.016ms
// 2^25所消耗的时间为: 0.016ms
```
> 所以时间复杂度为O(logn)的算法，数据规模N 翻倍到 2N，对应消耗的时间也约为 **1 + (log2/logn)** 倍。[n趋近于无穷大则log2/logN趋近于无穷小]

2. **时间复杂度为O(n)**
``` js
(function(){
  var action = {
    generatorRandomArr: function(n){
      let arr = [];
      for(let i = 0; i < n; i++){
        arr.push(Math.random() * (i + 1))
      }
      return arr;
    },
    findMax: function(arr, n){
      let res = arr[0];
      for(let i = 1; i < n; i++){
        if(arr[i] > res) res = arr[i];
      }
      return res;
    },
    TimeConsume: function(){
      for(let i = 20; i <= 25; i++){
        let n = Math.pow(2, i);
        let arr = this.generatorRandomArr(n);
        console.time(`2^${i}所消耗的时间为`);
        this.findMax(arr, n);
        console.timeEnd(`2^${i}所消耗的时间为`);
      }
    }
  }
  return action.TimeConsume()
})()
// 2^20所消耗的时间为: 1.018ms
// 2^21所消耗的时间为: 2.029ms
// 2^22所消耗的时间为: 4.077ms
// 2^23所消耗的时间为: 9.956ms
// 2^24所消耗的时间为: 22.813ms
// 2^25所消耗的时间为: 45.189ms
```
> 所以时间复杂度为O(n)的算法，数据规模N 翻倍到 2N，对应消耗的时间也约为 **2** 倍。


3. **时间复杂度为O(nlogn)**
```js
(function(){
  var action = {
    generatorRandomArr: function(n){
      let arr = [];
      for(let i = 0; i < n; i++){
        arr.push(Math.random() * (i + 1))
      }
      return arr;
    },
    merge: function(arr, from, mid, to){
      let leftArr = [];
      let rightArr = [];
      for(let i=from; i<= mid; i++) {
        leftArr.push(arr[i]);
      }
      for(let j=mid+1; j<= to; j++) {
        rightArr.push(arr[j]);
      }
      let i = 0, j = 0;
      for(let n = from; n<= to; n++) {
        if (i >= leftArr.length) {
          arr[n] = rightArr[j];
          j++;
          continue;
        }
        if (j >= rightArr.length) {
          arr[n] = leftArr[i];
          i++;
          continue;
        }
        if (leftArr[i] > rightArr[j]) {
          arr[n] = rightArr[j];
          j++;
        } else {
          arr[n] = leftArr[i];
          i++;
        }
      }
    },
    mergeSort: function(arr, from, to){
      let mid = Math.floor((from + to) / 2);
      if(to > from){
        this.mergeSort(arr, from, mid);
        this.mergeSort(arr, (mid+1), to);
        this.merge(arr, from, mid, to);
      }
    },
    TimeConsume: function(){
      for(let i = 20; i <= 25; i++){
        let n = Math.pow(2, i);
        let arr = this.generatorRandomArr(n);
        console.time(`2^${i}所消耗的时间为`);
        this.mergeSort(arr, 0, arr.length - 1);
        console.timeEnd(`2^${i}所消耗的时间为`);
      }
    }
  }
  return action.TimeConsume()
})()
// 2^20所消耗的时间为: 361.700ms
// 2^21所消耗的时间为: 667.906ms
// 2^22所消耗的时间为: 1422.435ms
// 2^23所消耗的时间为: 2991.644ms
// 2^24所消耗的时间为: 6389.287ms
// 2^25所消耗的时间为: 13957.756ms
```
> 所以时间复杂度为O(nlogn)的算法，数据规模N 翻倍到 2N，对应消耗的时间也约为 **2 + (log2/logn)** 倍。[n趋近于无穷大则log2/logN趋近于无穷小]

4. **时间复杂度为O(n^2)**
```js
(function(){
  var action = {
    generatorRandomArr: function(n){
      let arr = [];
      for(let i = 0; i < n; i++){
        arr.push(Math.random() * (i + 1))
      }
      return arr;
    },
    selectSort: function(arr){
      for(let i = 0; i < arr.length; i++){
        for(let j = i + 1; j < arr.length; j++){
          if(arr[i] > arr[j]){
            let temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
          }
        }
      }
      return arr;
    },
    TimeConsume: function(){
      for(let i = 12; i <= 17; i++){
        let n = Math.pow(2, i);
        let arr = this.generatorRandomArr(n);
        console.time(`2^${i}所消耗的时间为`);
        this.selectSort(arr);
        console.timeEnd(`2^${i}所消耗的时间为`);
      }
    }
  }
  return action.TimeConsume()
})()
// 2^12所消耗的时间为: 14.525ms
// 2^13所消耗的时间为: 63.829ms
// 2^14所消耗的时间为: 294.959ms
// 2^15所消耗的时间为: 1264.695ms
// 2^16所消耗的时间为: 5404.776ms
// 2^17所消耗的时间为: 22123.732ms
```
> 所以时间复杂度为O(n^2)的算法，数据规模N 翻倍到 2N，对应消耗的时间也约为 **4** 倍。