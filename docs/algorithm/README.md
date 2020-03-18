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
``` java
public class TimeConsume {
    public static void main(String[] args) {
        for(int i = 1; i < 10; i++){
            int n = (int)Math.pow(10, i);
            int sum = 0;
            long start = System.currentTimeMillis();
            for(int j = 0; j < n; j++){
                sum += j;
            }
            long end = System.currentTimeMillis();
            System.out.println("10^" + i + "数量级消耗时间为:" + (end - start) + "ms");
        }
    }
}
// 10^1数量级消耗时间为:0ms
// 10^2数量级消耗时间为:0ms
// 10^3数量级消耗时间为:0ms
// 10^4数量级消耗时间为:0ms
// 10^5数量级消耗时间为:1ms
// 10^6数量级消耗时间为:5ms
// 10^7数量级消耗时间为:12ms
// 10^8数量级消耗时间为:114ms
// 10^9数量级消耗时间为:1187ms
```
所以，如果想要在1s内解决问题:
> O(n^2)的算法可以处理大约在 10^4 级别的数量  
> O(n)的算法可以处理大约在 10^8 级别的数量  
> O(nlogn)的算法可以处理大约在 10^7 级别的数量

## 试验自己算法的复杂度
> **通过实验，将数据规模从N => 2N，观察时间变化的趋势（这样做可以有效地排除 常数C 对计算带来的误差）**

1. **时间复杂度为O(logn)**

2. **时间复杂度为O(n)**
``` java
package com.fffxue.demo;

import java.util.*;

public class FindMax {
    public static void main(String[] args) {
        for(int i = 20; i <= 27; i++){
            int n = (int) Math.pow(2, i);
            int[] arr = new int[n];
            Arrays.fill(arr, 1);
            long start = System.currentTimeMillis();
            findMax(arr ,n);
            long end = System.currentTimeMillis();
            System.out.println("2^" + i + "所花费的时间为:" + (end - start) + "ms");
        }

    }
    static int findMax(int[] arr, int n){
        int res = arr[0];
        for(int i = 1; i < n; i++){
            if(arr[i] > res) res = arr[i];
        }
        return res;
    }
  }
}
// 2^20所花费的时间为:3ms
// 2^21所花费的时间为:1ms
// 2^22所花费的时间为:2ms
// 2^23所花费的时间为:4ms
// 2^24所花费的时间为:8ms
// 2^25所花费的时间为:15ms
// 2^26所花费的时间为:25ms
// 2^27所花费的时间为:50ms
```
> 所以时间复杂度为O(n)的算法，数据规模N 翻倍到 2N，对应消耗的时间也约为 2 倍。


3. **时间复杂度为O(nlogn)**

4. **时间复杂度为O(n^2)**