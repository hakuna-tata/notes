// 二分查找
function binarySearch(arr, target){
  let l = 0, r = arr.length - 1;
  while(l <= r){
    // let mid = l + Math.floor((r - l) / 2);
    let mid = Math.floor((l + r) / 2);
    if(arr[mid] === target) return mid;
    
    if(arr[mid] > target){
      r = mid - 1;
    }else{
      l = mid + 1;
    }
  }
  return -1;
}


// 二分查找法, 在有序数组arr中, 查找target
// 如果找到target, 返回第一个target相应的索引index
// 如果没有找到target, 返回比target小的最大值相应的索引, 如果这个最大值有多个, 返回最大索引
// 如果这个target比整个数组的最小元素值还要小, 则不存在这个target的floor值, 返回-1
function floor(arr, target){
  let l = 0, r = arr.length - 1;
  while(l <= r){
    let mid = Math.floor((l + r) / 2);
    if(arr[mid] === target) return mid;
    if(arr[mid] > target){
      r = mid - 1;
    }else{
      l = mid + 1;
    }
  }
  if(arr[l] > target) {
    return l - 1;
  }else{
    return l;
  }
}



// 二分搜索树（每个节点的键值大于左孩子小于右孩子）：递归
const insertNode = Symbol('insertNode');
const preOrderTraversal = Symbol('preOrderTraversal');
const inOrderTraversal = Symbol('inOrderTraversal');

class Node{
  constructor(value){
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BST{
  constructor(){
    this.root = null;
  }

  [insertNode](root, node){
    if(root === null || (root && root.value === node.value)){
      root = node;
    }else{
      if(root.value > node.value){
        root.left === null ? root.left = node : this[insertNode](root.left, node);
      }else{
        root.right === null ? root.right = node : this[insertNode](root.right, node);
      }
    }
    return root;
  }

  [preOrderTraversal](root, arr){
    if(root === null) return;
    arr.push(root.value);
    this[preOrderTraversal](root.left, arr);
    this[preOrderTraversal](root.right, arr);
  }

  [inOrderTraversal](root, arr){
    if(root === null) return;
    this[inOrderTraversal](root.left, arr);
    arr.push(root.value);
    this[inOrderTraversal](root.right, arr);
  }

  insert(value){
    let newNode = new Node(value);
    this.root = this[insertNode](this.root, newNode);
  }

  // 递归前序遍历
  preOrder(){
    let arr = [];
    this[preOrderTraversal](this.root, arr);
    return arr;
  }

  // 非递归前序遍历
  noRecursivePreOrder(){
    let arr = [], stack = [], temp = this.root;
    if(this.root === null) return [];
    while(temp !== null || stack.length){
      while(temp !== null){
        stack.push(temp);
        arr.push(temp.value);
        temp = temp.left;
      }
      if(stack.length){
        let node = stack.pop();
        temp = node.right;
      }
    }
    return arr;
  }
  
  // 递归中序遍历
  inOrder(){
    let arr = [];
    this[inOrderTraversal](this.root, arr);
    return arr;
  }
  // 非递归中序遍历
  noRecursiveInOrder(){
    let arr = [], stack = [], temp = this.root;
    if(this.root === null) return [];
    while(temp !== null || stack.length){
      while(temp !== null){
        stack.push(temp)
        temp = temp.left
      }
      if(stack.length){
        let node = stack.pop();
        arr.push(node.value);
        temp = node.right;
      }
    }
    return arr;
  }

  // 非递归后序遍历
  noRecursivePostOrder(){
    let arr = [], stack = [], temp = this.root;
    if(this.root === null) return [];
    stack.push(this.root);
    while(stack.length){
      let node = stack.pop();
      arr.push(node.value);
      node.left && stack.push(node.left);
      node.right && stack.push(node.right);
    }
    return arr.reverse();
  }

  // 层序遍历（广度优先）
  levelOrder(){
    let arr = [], stack = [], temp = this.root;
    if(this.root === null) return [];
    stack.push(this.root);
    while(stack.length){
      let node = stack.shift();
      arr.push(node.value);
      node.left && stack.push(node.left);
      node.right && stack.push(node.right);
    }
    return arr;
  }

}