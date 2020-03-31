//
function selectSort(arr){
  for(let i = 0,len = arr.length; i < len; i++){
    for(let j = i + 1; j < len; j++){
      if(arr[i] > arr[j]){
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

// 写法1
function insertSort(arr){
  for(let i = 1; i < arr.length; i++){
    for(let j = i - 1; j >= 0 && arr[j] > arr[i] ;j--){
      let temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
      i--;
    }
  }
  return arr;
}

// 写法2
function insertSort(arr){
  for(let i = 1; i < arr.length; i++){
    let temp = arr[i], j;
    for(j = i - 1; j >= 0 && arr[j] > temp ;j--){
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = temp;
  }
  return arr;
}

//
function bubbleSort(arr){
  for(let i = 0; i < arr.length - 1; i++){
    for(let j = 0; j < arr.length - 1 - i; j++){
      if(arr[j] > arr[j + 1]){
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

// 写法1(自顶向下)left = 0  right = arr.length - 1
function mergeSort(arr, left, right){
  function merge(arr, l, m, r){
    let leftArr = [];
      let rightArr = [];
      for(let i = l; i <= m; i++) {
        leftArr.push(arr[i]);
      }
      for(let j = m+1; j <= r; j++) {
        rightArr.push(arr[j]);
      }
      let i = 0 , j = 0;
      for(let k = l; k <= r; k++){
        if (i >= leftArr.length) {
          arr[k] = rightArr[j];
          j++;
        }
        else if (j >= rightArr.length) {
          arr[k] = leftArr[i];
          i++;
        }
        else if(leftArr[i] > rightArr[j]){
          arr[k] = rightArr[j];
          j++
        }
        else{
          arr[k] = leftArr[i];
          i++;
        }
      }
  }
  if(left >= right) return;
  let mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  if(arr[mid] > arr[mid + 1]){
    merge(arr, left, mid, right);
  }
}

// 写法2(自底向上) n = arr.length
function mergeSort(arr, n){
  function merge(arr, l, m, r){
    let leftArr = [];
    let rightArr = [];
    for(let i = l; i <= m; i++) {
      leftArr.push(arr[i]);
    }
    for(let j = m+1; j <= r; j++) {
      rightArr.push(arr[j]);
    }
    let i = 0 , j = 0;
    for(let k = l; k <= r; k++){
      if (i >= leftArr.length) {
        arr[k] = rightArr[j];
        j++;
      }
      else if (j >= rightArr.length) {
        arr[k] = leftArr[i];
        i++;
      }
      else if(leftArr[i] > rightArr[j]){
        arr[k] = rightArr[j];
        j++
      }
      else{
        arr[k] = leftArr[i];
        i++;
      }
    }
  }
  for(let sz = 1; sz <= n; sz += sz){
    for(let i = 0; i + sz < n; i += sz + sz){
      merge(arr, i, i + sz -1, Math.min(i + sz + sz - 1, n - 1))
    }
  }
}

// 
function quickSort(arr, n){
  function _partition(arr, l, r){
    let temp = arr[l];
    let i, j = l + 1, r;
    while(true){
      while(i <= r && arr[i] < temp) i++;
      while(j >= l + 1 && arr[j] > temp) j--;
      if(i > j) break;
    }
    return j;
  }
  function _quickSort(arr, l, r){
    if( l >= r) return;
    let p = _partition(arr, l, r);
    _quickSort(arr, l, p - 1);
    _quickSort(arr, p + 1, r);
  }
}