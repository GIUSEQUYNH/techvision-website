(() => {
  'use strict';
  const searchButton = document.querySelector('#search');
  const searchPanel = document.querySelector('#site-search');
  searchButton?.addEventListener('click', () => {
    const open = searchPanel.classList.toggle('open');
    searchButton.setAttribute('aria-expanded', String(open));
    if (open) searchPanel.querySelector('input[type="search"]').focus();
  });
  const modal = document.querySelector('.modal');
  const login = document.querySelector('#login');
  const closeModal = () => {modal?.classList.remove('open');login?.focus()};
  if (modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Đăng nhập');
    const fields = [...modal.querySelectorAll('input')];
    fields.forEach((field, i) => {
      field.id = `login-field-${i}`;
      field.previousElementSibling?.setAttribute('for', field.id);
    });
    // The original login is a placeholder. Do not collect credentials as if it were live.
    fields.forEach(field => {field.disabled = true;field.required = false});
    const submit = modal.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    modal.querySelector('#note').textContent = 'Đăng nhập chưa được kết nối. Vui lòng liên hệ qua email để được hỗ trợ.';
    login?.addEventListener('click', () => {modal.classList.add('open');modal.querySelector('#close').focus()});
    modal.querySelector('#close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {if (e.target === modal) closeModal()});
    modal.querySelector('form')?.addEventListener('submit', e => e.preventDefault());
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('open')) closeModal();
      if (searchPanel?.classList.contains('open')) {searchPanel.classList.remove('open');searchButton.setAttribute('aria-expanded','false');searchButton.focus()}
    }
    if (e.key === 'Tab' && modal?.classList.contains('open')) {e.preventDefault();modal.querySelector('#close').focus()}
  });
  const language = document.querySelector('#lang');
  // No English content exists: keep the displayed language truthful.
  language?.setAttribute('title', 'Nội dung hiện có bằng tiếng Việt');
  language?.addEventListener('click', () => {
    language.setAttribute('aria-label', 'Website hiện cung cấp nội dung bằng tiếng Việt');
    let status = document.querySelector('#language-status');
    if (!status) {status=document.createElement('span');status.id='language-status';status.className='sr-status';status.setAttribute('role','status');language.after(status)}
    status.textContent='Nội dung tiếng Anh chưa có. Website hiện sử dụng tiếng Việt.';
  });
  const checklist = document.querySelector('#ai-readiness');
  checklist?.addEventListener('submit', e => {
    e.preventDefault();
    const checks = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const count = checks.filter(c => c.checked).length;
    const next = ['Thống nhất bài toán, người phụ trách và chỉ số mục tiêu.','Bổ sung dữ liệu có mã thiết bị, dấu thời gian và ngữ cảnh.','Kiểm tra chất lượng và chuẩn bị tập kiểm thử độc lập.','Xác định người xác nhận kết quả và quy trình phản hồi.','Thống nhất nghiệm thu, giám sát và phương án quay lui.'];
    const result = document.querySelector('#ai-readiness-result');
    result.replaceChildren();
    const heading = document.createElement('h3');
    heading.textContent = `${count}/5 điều kiện — ${count===5?'Có cơ sở để thiết kế pilot':count<3?'Ưu tiên chuẩn bị nền tảng':'Hoàn thiện điều kiện trước pilot'}`;
    const note = document.createElement('p');
    note.textContent = count === 5 ? 'Chọn phạm vi nhỏ, thống nhất đường cơ sở và kiểm chứng bằng dữ liệu độc lập. Kết quả tự rà soát không bảo đảm hiệu quả của dự án.' : 'Các bước nên thực hiện tiếp theo:';
    result.append(heading,note);
    if (count < 5) {const list=document.createElement('ul');checks.forEach((c,i)=>{if(!c.checked){const item=document.createElement('li');item.textContent=next[i];list.append(item)}});result.append(list)}
    result.hidden = false;
  });
  const results = document.querySelector('#search-results');
  if (results) {
    const query = new URLSearchParams(location.search).get('q') || '';
    document.querySelector('#query').value = query;
    const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
    const words = normalize(query).trim().split(/\s+/).filter(Boolean);
    const items = (window.HQ_SEARCH_INDEX || []).filter(item => words.every(word => normalize(item.title+' '+item.description).includes(word)));
    document.querySelector('#search-status').textContent = items.length ? `${items.length} nội dung${query ? ' cho “'+query+'”' : ' hiện có'}.` : 'Không tìm thấy nội dung phù hợp. Thử từ khóa ngắn hơn, ví dụ: AI, bảo trì, RAG.';
    items.forEach(item => {
      const article=document.createElement('article');article.className='card';
      const heading=document.createElement('h2');heading.style.fontSize='1.25rem';
      const link=document.createElement('a');link.href=item.file;link.textContent=item.title;heading.append(link);
      const desc=document.createElement('p');desc.textContent=item.description;article.append(heading,desc);results.append(article);
    });
  }
})();
