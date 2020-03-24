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


function mergeSort(arr, left, right){
  function merge(arr, l, m, r){
    let i = l, j = m + 1, k = 0;
    
  }
  if(left >= right) return;
  let mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}