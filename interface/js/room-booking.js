const roomPrices = {
    single: { name: 'Single Room', price: 299 },
    double: { name: 'Double Room', price: 499 },
    family: { name: 'Family Room', price: 799 },
    suite: { name: 'Deluxe Suite', price: 1299 }
};

let selRoomType = 'single';

document.addEventListener('DOMContentLoaded', function() {
    chkLogin();
});

function chkLogin() {
    const isLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    if (isLoggedIn) {
        document.getElementById('bookingContent').style.display = 'block';
        initForm();
    } else {
        document.getElementById('loginModal').classList.add('show');
    }
}

function goLogin() {
    window.location.href = 'guest-login.html';
}

function goBack() {
    window.location.href = 'before.html';
}

function initForm() {
    const form = document.getElementById('bookingForm');
    const modal = document.getElementById('successModal');
    const roomCards = document.querySelectorAll('.room-card');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkInInput.value = today;
    checkOutInput.min = today;
    checkOutInput.value = getTom();
    
    roomCards.forEach(card => {
        card.addEventListener('click', function() {
            roomCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selRoomType = this.dataset.type;
            document.getElementById('roomType').value = roomPrices[selRoomType].name;
            updPrice();
        });
    });
    
    checkInInput.addEventListener('change', function() {
        const checkInDate = new Date(this.value);
        const checkOutDate = new Date(checkOutInput.value);
        if (checkOutDate <= checkInDate) {
            checkOutInput.value = getTom(checkInDate);
        }
        checkOutInput.min = this.value;
        updPrice();
    });
    
    checkOutInput.addEventListener('change', updPrice);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const bookingData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            adults: formData.get('adults'),
            children: formData.get('children'),
            idCard: formData.get('idCard'),
            roomType: selRoomType,
            roomTypeName: roomPrices[selRoomType].name,
            remark: formData.get('remark'),
            totalPrice: calcTotal(),
            bookingTime: new Date().toISOString()
        };
        
        const bookings = JSON.parse(localStorage.getItem('roomBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('roomBookings', JSON.stringify(bookings));
        
        form.reset();
        modal.classList.add('show');
    });
}

function getTom(date = new Date()) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function calcDays() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
}

function calcTotal() {
    const days = calcDays();
    const price = roomPrices[selRoomType].price;
    return days * price;
}

function updPrice() {
    const days = calcDays();
    const price = roomPrices[selRoomType].price;
    const total = calcTotal();
    
    document.getElementById('basePrice').textContent = `¥${price}/night`;
    document.getElementById('stayDays').textContent = `${days} ${days === 1 ? 'night' : 'nights'}`;
    document.getElementById('totalPrice').textContent = `¥${total}`;
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    window.location.href = 'before.html';
}

function chkLog(e) {
    const isLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    if (!isLoggedIn) {
        e.preventDefault();
        document.getElementById('loginModal').classList.add('show');
        return false;
    }
    return true;
}
