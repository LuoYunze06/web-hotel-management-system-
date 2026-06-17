document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', () => {
    const name = document.getElementById('cusName').value;
    const phone = document.getElementById('cusPhone').value;
    const tableNo = document.getElementById('tableNo').value;
    const time = document.getElementById('bookTime').value;
    if (!name || !phone || !time) { alert('Please complete the form.'); return; }
    alert('Booking successful.');
  });
});
