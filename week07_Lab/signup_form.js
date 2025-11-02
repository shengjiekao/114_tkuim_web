const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const statusBox = document.getElementById('form-status');

const nameI = document.getElementById('name');
const emailI = document.getElementById('email');
const phoneI = document.getElementById('phone');
const pwI = document.getElementById('password');
const confirmI = document.getElementById('confirm');
const tosI = document.getElementById('tos');

const nameErr = document.getElementById('name-error');
const emailErr = document.getElementById('email-error');
const phoneErr = document.getElementById('phone-error');
const pwErr = document.getElementById('pw-error');
const confirmErr = document.getElementById('confirm-error');
const tagsErr = document.getElementById('tags-error');
const tosErr = document.getElementById('tos-error');

const tagsBox = document.getElementById('tags');

const pwBar = document.getElementById('pw-strength-bar');
const pwText = document.getElementById('pw-strength-text');

const touched = new Set();

function setError(inputEl, errEl, message) {
  inputEl.setCustomValidity(message);
  errEl.textContent = message || '';
}

function isAlpha(str){ return /[A-Za-z]/.test(str); }
function isDigit(str){ return /\d/.test(str); }

function evalStrength(pw){
  if (!pw) return { label:'尚未輸入', pct:0, tone:'danger' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (isAlpha(pw) && isDigit(pw)) score++;
  if (/[^\w]/.test(pw)) score++; 
  if (score <= 1) return { label:'弱', pct:33, tone:'danger' };
  if (score === 2) return { label:'中', pct:66, tone:'warn' };
  return { label:'強', pct:100, tone:'ok' };
}

function renderStrength(pw){
  const s = evalStrength(pw);
  pwBar.style.width = s.pct + '%';
  pwBar.style.backgroundColor = s.tone === 'danger' ? '#ef4444' : (s.tone === 'warn' ? '#f59e0b' : '#10b981');
  pwText.textContent = '強度：' + s.label;
}

function countCheckedTags(){
  return [...tagsBox.querySelectorAll('input[type="checkbox"]')].filter(c=>c.checked).length;
}

function validateName(showMsg=true){
  const v = nameI.value.trim();
  let msg = '';
  if (!v) msg = '請輸入姓名。';
  if (showMsg) setError(nameI, nameErr, msg);
  return !msg;
}

function validateEmail(showMsg=true){
  const v = emailI.value.trim();
  let msg = '';
  if (!v) msg = '請輸入 Email。';
  else {
    if (!emailI.checkValidity()) msg = 'Email 格式不正確，請確認輸入。';
  }
  if (showMsg) setError(emailI, emailErr, msg);
  return !msg;
}

function validatePhone(showMsg=true){
  const v = phoneI.value.trim();
  let msg = '';
  if (!v) msg = '請輸入手機號碼。';
  else if (!/^\d{10}$/.test(v)) msg = '手機需為 10 碼數字（不含 - 與空白）。';
  if (showMsg) setError(phoneI, phoneErr, msg);
  return !msg;
}

function validatePassword(showMsg=true){
  const v = pwI.value;
  let msg = '';
  if (!v) msg = '請輸入密碼。';
  else if (v.length < 8) msg = '密碼至少需 8 碼。';
  else if (!(isAlpha(v) && isDigit(v))) msg = '密碼需同時包含英文字母與數字。';
  if (showMsg) setError(pwI, pwErr, msg);
  return !msg;
}

function validateConfirm(showMsg=true){
  const v = confirmI.value;
  let msg = '';
  if (!v) msg = '請再次輸入密碼。';
  else if (v !== pwI.value) msg = '兩次密碼不一致。';
  if (showMsg) setError(confirmI, confirmErr, msg);
  return !msg;
}

function validateTags(showMsg=true){
  const n = countCheckedTags();
  let msg = '';
  if (n === 0) msg = '請至少勾選 1 個興趣。';
  if (showMsg) { tagsErr.textContent = msg; }
  return !msg;
}

function validateTOS(showMsg=true){
  let msg = '';
  if (!tosI.checked) msg = '請先勾選同意服務條款。';
  if (showMsg) setError(tosI, tosErr, msg);
  return !msg;
}

function validateAllAndFocus(){
  const checks = [
    [validateName, nameI],
    [validateEmail, emailI],
    [validatePhone, phoneI],
    [validatePassword, pwI],
    [validateConfirm, confirmI],
    [validateTags, tagsBox],
    [validateTOS, tosI]
  ];
  for (const [fn, el] of checks){
    const ok = fn(true);
    if (!ok){
      if (el.focus) el.focus();
      return false;
    }
  }
  return true;
}

function attachFieldValidation(inputEl, validator, errEl){
  inputEl.addEventListener('blur', () => {
    touched.add(inputEl.id);
    validator(true);
  });
  inputEl.addEventListener('input', () => {
    renderStrength(pwI.value); 
    if (touched.has(inputEl.id)) validator(true);
    if (inputEl === pwI && confirmI.value) validateConfirm(touched.has('confirm'));
  });
}

attachFieldValidation(nameI,    validateName,    nameErr);
attachFieldValidation(emailI,   validateEmail,   emailErr);
attachFieldValidation(phoneI,   validatePhone,   phoneErr);
attachFieldValidation(pwI,      validatePassword,pwErr);
attachFieldValidation(confirmI, validateConfirm, confirmErr);

tagsBox.addEventListener('click', (e) => {
  const label = e.target.closest('label.tag');
  if (!label) return;
  const box = label.querySelector('input[type="checkbox"]');
  if (!box) return;
  if (e.target !== box) {
    box.checked = !box.checked;
  }
  label.classList.toggle('checked', box.checked);

  if (!touched.has('tags')) touched.add('tags');
  validateTags(true);
  
  persistPartial();
});

tosI.addEventListener('change', ()=>{
  if (!touched.has('tos')) touched.add('tos');
  validateTOS(true);
  persistPartial();
});

renderStrength('');

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  ['name','email','phone','password','confirm','tags','tos'].forEach(id=>touched.add(id));

  const ok = validateAllAndFocus();
  if (!ok) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  statusBox.className = 'status';
  statusBox.textContent = '';

  await new Promise(r => setTimeout(r, 1000));

  clearPartial();
  form.reset();
  resetVisuals();

  statusBox.className = 'status ok';
  statusBox.textContent = '送出成功！';

  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  [nameErr,emailErr,phoneErr,pwErr,confirmErr,tagsErr,tosErr].forEach(el => el.textContent = '');
  statusBox.className = 'status';
  statusBox.textContent = '';
  touched.clear();
  resetVisuals();
  clearPartial(); 
});

function resetVisuals(){
  renderStrength('');
  [...tagsBox.querySelectorAll('label.tag')].forEach(l => l.classList.remove('checked'));
}

const LS_KEY = 'signup_partial_v1';

function persistPartial(){
  const data = {
    name: nameI.value,
    email: emailI.value,
    phone: phoneI.value,
    tags: [...tagsBox.querySelectorAll('input[type="checkbox"]')].filter(c=>c.checked).map(c=>c.value),
    tos: tosI.checked
  };
  try{
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }catch(_){}
}

function restorePartial(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return;

    if ('name' in data)  nameI.value  = data.name || '';
    if ('email' in data) emailI.value = data.email || '';
    if ('phone' in data) phoneI.value = data.phone || '';
    if (Array.isArray(data.tags)){
      [...tagsBox.querySelectorAll('input[type="checkbox"]')].forEach(c=>{
        c.checked = data.tags.includes(c.value);
        c.closest('label.tag').classList.toggle('checked', c.checked);
      });
    }
    if ('tos' in data) tosI.checked = !!data.tos;

  }catch(_){}
}

function clearPartial(){
  try{ localStorage.removeItem(LS_KEY); }catch(_){}
}

[nameI, emailI, phoneI].forEach(el=>{
  el.addEventListener('input', persistPartial);
});

window.addEventListener('load', restorePartial);
