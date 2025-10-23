// example5_script.js
// 根據輸入的分數（0~100）輸出等第（A/B/C/D/F）

var input = prompt('請輸入你的分數（0~100）：');
var score = parseFloat(input);
var grade = '';

if (isNaN(score) || score < 0 || score > 100) {
  grade = '❌ 輸入錯誤，請輸入 0~100 之間的數字。';
} else if (score >= 90) {
  grade = 'A';
} else if (score >= 80) {
  grade = 'B';
} else if (score >= 70) {
  grade = 'C';
} else if (score >= 60) {
  grade = 'D';
} else {
  grade = 'F';
}

var msg = '';
msg += '分數：' + score + '\n';
msg += '等第：' + grade;

alert('判斷完成，請看頁面結果與 Console');
console.log(msg);
document.getElementById('result').textContent = msg;
