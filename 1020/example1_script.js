// example1_script.js
// 傳統語法：僅使用 var、function、字串串接

// 顯示提示窗
alert('歡迎來到 JavaScript！');

// 在 Console 顯示訊息
console.log('Hello JavaScript from console');

var el = document.getElementById('result');
el.textContent = '\n姓名：高聖傑　學號：412631110';

var btn = document.getElementById('showMsgBtn');
btn.onclick = function() {
  alert('你剛剛點擊了按鈕！');
};
