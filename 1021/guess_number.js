
document.addEventListener('DOMContentLoaded', function () {
  var answer = Math.floor(Math.random() * 100) + 1;
  var count = 0;
  var history = [];
  var msg = '';

  while (true) {
    var input = prompt('請輸入 1~100 的整數（取消結束）：');
    if (input === null) {
      alert('遊戲結束，感謝遊玩！');
      msg = '已結束遊戲。';
      break;
    }

    var n = parseInt(input, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      alert('請輸入 1~100 的整數！');
      continue;
    }

    count++;
    history.push(n);

    if (n === answer) {
      msg = '🎉 恭喜猜對！答案是 ' + answer + '\n'
          + '共猜了：' + count + ' 次（含這次）\n'
          + '猜測紀錄：' + history.join(', ');
      alert('猜對了！共猜了 ' + count + ' 次');
      break;
    } else if (n < answer) {
      alert('再大一點！');
    } else {
      alert('再小一點！');
    }
  }

  var box = document.getElementById('result');
  if (box) {
    box.textContent = msg;
  } else {
    console.error('#result 不存在，請在 HTML 裡放 <pre id="result"></pre>');
  }
});
