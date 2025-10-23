// example5_script.js
// 讓使用者輸入要顯示的乘法範圍（例如 2 到 5）

var start = prompt('請輸入起始數字（例如 2）：');
var end = prompt('請輸入結束數字（例如 5）：');

var s = parseInt(start, 10);
var e = parseInt(end, 10);
var output = '';

if (isNaN(s) || isNaN(e) || s < 1 || e > 9 || s > e) {
  output = '❌ 輸入錯誤！請輸入 1~9 之間的整數，且起始數 ≤ 結束數。';
} else {
  for (var i = s; i <= e; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + 'x' + j + '=' + (i * j) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;
