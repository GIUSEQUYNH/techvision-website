(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu(focus = false) {
    nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Mở menu');
    if (focus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open',open); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');
  });
  nav.addEventListener('click',e=>{if(e.target.closest('a')) closeMenu()});
  document.addEventListener('click',e=>{if(!e.target.closest('.header')) closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')) closeMenu(true)});
  matchMedia('(min-width:901px)').addEventListener('change',()=>closeMenu());
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
    let count=0;
    document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});
    document.querySelector('#filter-status').textContent=`Hiển thị ${count} chuyên đề.`;
  }));
  const useCases={
    maintenance:{label:'PREDICTIVE MAINTENANCE',title:'Phát hiện suy giảm trước khi thành sự cố.',intro:'Phân tích tín hiệu thiết bị theo tải và chế độ vận hành để ưu tiên kiểm tra. Cảnh báo phải gắn với một hành động bảo trì cụ thể.',data:'Rung, nhiệt độ, dòng điện, chế độ tải và nhật ký bảo trì.',metric:'Tỷ lệ phát hiện, cảnh báo sai theo ngày và thời gian cảnh báo trước.',note:'Không đủ lịch sử hư hỏng? Bắt đầu từ theo dõi tình trạng và phát hiện bất thường; chưa cam kết dự báo tuổi thọ còn lại.',file:'bao-tri-du-doan.html'},
    vision:{label:'COMPUTER VISION',title:'Kiểm tra chất lượng ngay trên dây chuyền.',intro:'Phát hiện khuyết tật từ hình ảnh, với điều kiện thu ảnh được kiểm soát và cơ chế chuyển trường hợp không chắc chắn cho người kiểm tra.',data:'Ảnh qua nhiều ca, lô sản phẩm, loại lỗi và cấu hình ánh sáng.',metric:'Tỷ lệ lọt lỗi, loại nhầm và độ trễ từ kích chụp đến hành động.',note:'Kết quả trên dữ liệu mẫu chưa đại diện cho dây chuyền. Kiểm định lại khi đổi vật liệu, mã hàng, camera hoặc ánh sáng.',file:'thi-giac-may.html'},
    rag:{label:'INDUSTRIAL RAG',title:'Biến tài liệu kỹ thuật thành tri thức tra cứu.',intro:'Tìm hướng dẫn, mã lỗi và thông tin thiết bị từ tài liệu có kiểm soát. Câu trả lời cần có nguồn và đúng phiên bản đang sử dụng.',data:'Manual, SOP, hướng dẫn bảo trì; metadata thiết bị, phiên bản và quyền truy cập.',metric:'Đúng nguồn, đúng ngữ cảnh, tuân thủ phân quyền và từ chối khi thiếu căn cứ.',note:'Trợ lý hỗ trợ tra cứu; không tự thay đổi tham số máy. Quyết định vận hành vẫn theo quy trình được phê duyệt.',file:'rag-cong-nghiep.html'}
  };
  const tabs=[...document.querySelectorAll('[data-use]')], panel=document.querySelector('#use-panel');
  function selectUse(button){
    tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===button));t.tabIndex=t===button?0:-1});
    const item=useCases[button.dataset.use];panel.setAttribute('aria-labelledby',button.id);
    panel.innerHTML=`<div class="use-panel-head">${item.label}</div><h3>${item.title}</h3><p>${item.intro}</p><div class="use-facts"><div><b>DỮ LIỆU CẦN CÓ</b><p>${item.data}</p></div><div><b>ĐO LƯỜNG THÀNH CÔNG</b><p>${item.metric}</p></div></div><p class="use-note">${item.note}</p><a class="light-link" href="${item.file}">Đọc phân tích kỹ thuật ↗</a>`;
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>selectUse(t));
    t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();selectUse(tabs[next])}});
  });
  if(tabs.length)selectUse(tabs[0]);
  const form=document.querySelector('#readiness-form');
  if(form)form.addEventListener('submit',e=>{
    e.preventDefault();const checks=[...form.querySelectorAll('input')],count=checks.filter(c=>c.checked).length;
    const missing=['Thống nhất bài toán, đường cơ sở và chỉ số giá trị.','Lập danh mục dữ liệu, mã thiết bị và dấu thời gian.','Kiểm tra chất lượng dữ liệu, độ bao phủ và rò rỉ giữa các tập.','Chỉ định người xác nhận kết quả và quy trình phản hồi.','Đặt tiêu chí nghiệm thu, giám sát và quay lui.'].filter((_,i)=>!checks[i].checked);
    const result=document.querySelector('#assessment-result');
    const title=count<3?'Ưu tiên xây dựng nền tảng':count<5?'Hoàn thiện điều kiện trước pilot':'Có cơ sở để thiết kế pilot';
    result.innerHTML=`<h3>${count}/5 điều kiện · ${title}</h3><p>${count===5?'Bước tiếp theo: chọn phạm vi nhỏ, thiết lập đường cơ sở và kiểm chứng trên dữ liệu độc lập. Kết quả tự đánh giá không bảo đảm tính khả thi hoặc hiệu quả dự án.':'Nên ưu tiên các việc còn thiếu trước khi lựa chọn hoặc mở rộng mô hình:'}</p>${missing.length?'<ul>'+missing.map(s=>`<li>${s}</li>`).join('')+'</ul>':''}`;
    result.hidden=false;
  });
})();
