// example5_script.js
// 攔截 submit，聚焦第一個錯誤並模擬送出流程

const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach((control) => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) {
        firstInvalid = control;
      }
    }
  });
  return firstInvalid;
}

const agree = document.getElementById('agree');
const agreeModalEl = document.getElementById('agreeModal');
let agreeModal = null;
let bootstrapLoaded = false;

try {
  if (window.bootstrap && agreeModalEl) {
    agreeModal = new bootstrap.Modal(agreeModalEl, { backdrop: 'static', keyboard: false });
    bootstrapLoaded = true;
  }
} catch (e) { /* ignore */ }

const agreeConfirmBtn = document.getElementById('agreeConfirmBtn');
const agreeCancelBtn = document.getElementById('agreeCancelBtn');

agree?.addEventListener('change', () => {
  if (!agree) return;
  if (agree.checked) {
    if (agree.dataset.confirmed !== 'true') {
      if (bootstrapLoaded && agreeModal) {
        agreeModal.show();
      } else {
        const ok = window.confirm('送出前請再次確認：您已完整閱讀並同意本服務之使用條款與隱私政策。');
        if (ok) {
          agree.dataset.confirmed = 'true';
          agree.setCustomValidity('');
        } else {
          agree.checked = false;
          agree.dataset.confirmed = '';
          agree.setCustomValidity('請勾選並確認同意條款');
        }
      }
    } else {
      agree.setCustomValidity('');
    }
  } else {
    agree.dataset.confirmed = '';
    agree.setCustomValidity('請勾選並確認同意條款');
  }
});

agreeConfirmBtn?.addEventListener('click', () => {
  if (!agree) return;
  agree.dataset.confirmed = 'true';
  agree.checked = true;
  agree.setCustomValidity('');
  agree.classList.remove('is-invalid');
  agreeModal?.hide();
});

agreeCancelBtn?.addEventListener('click', () => {
  if (!agree) return;
  agree.dataset.confirmed = '';
  agree.checked = false;
  agree.setCustomValidity('請勾選並確認同意條款');
  agree.classList.add('is-invalid');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  if (agree) {
    if (!agree.checked) {
      agree.setCustomValidity('請勾選並確認同意條款');
    } else if (agree.dataset.confirmed !== 'true') {
      agree.setCustomValidity('請在彈窗中按下「我同意」以完成確認');
      if (bootstrapLoaded && agreeModal) {
        agreeModal.show();
      } else {
        const ok = window.confirm('送出前請再次確認：您已完整閱讀並同意本服務之使用條款與隱私政策。');
        if (ok) {
          agree.dataset.confirmed = 'true';
          agree.setCustomValidity('');
        }
      }
    } else {
      agree.setCustomValidity('');
    }
  }

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');
  form.reset();
  if (agree) {
    agree.dataset.confirmed = '';
    agree.setCustomValidity('');
    agree.classList.remove('is-invalid');
  }
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
    if (element instanceof HTMLInputElement) {
      element.setCustomValidity('');
    }
  });
  if (agree) {
    agree.dataset.confirmed = '';
  }
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});
