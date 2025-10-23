
var valStr = prompt('請輸入溫度數值（可輸入小數）：');
var unit = prompt('請輸入單位：C 或 F（不分大小寫）');

var msg = '';
var val = parseFloat(valStr);
var u = unit ? unit.trim().toUpperCase() : '';

if (isNaN(val) || (u !== 'C' && u !== 'F')) {
  msg = '輸入錯誤：請輸入數字溫度，單位請輸入 C 或 F。';
} else if (u === 'C') {
  var f = val * 9 / 5 + 32;
  msg = '輸入：' + val + ' °C\n換算為華氏：' + f.toFixed(2) + ' °F';
} else { // u === 'F'
  var c = (val - 32) * 5 / 9;
  msg = '輸入：' + val + ' °F\n換算為攝氏：' + c.toFixed(2) + ' °C';
}

alert(msg);
document.getElementById('result').textContent = msg;
