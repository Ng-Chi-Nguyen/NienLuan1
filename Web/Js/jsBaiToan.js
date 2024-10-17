// Cấu trúc DoVat tương đương với struct trong C++
class DoVat {
   constructor(giaTri, trongLuong, chiSo) {
      this.GiaTri = giaTri;
      this.TrongLuong = trongLuong;
      this.ChiSo = chiSo;
   }
}

// Mảng lưu trữ các đối tượng DoVat
let Arr = []; // Tương tự mảng DoVat[] trong C++
let soMonDo = 0; // Số món đồ (giống int SoMonDo)
let trongLuongBalo = 0; // Trọng lượng balo tối đa (giống int TrongLuongBalo)
let giaTriLonNhat = []; // Mảng giá trị lớn nhất có thể đạt được (giống int GiaTriLonNhat[])
let lanChon = []; // Mảng lưu chỉ số món đồ được chọn (giống int LanChon[])

function nhapMonDo() {
   const soMonDo = document.getElementById('soMonDo').value;
   // Hiện phần nhập trọng lượng và giá trị
   document.getElementById('nhapGT_TL').style.display = 'block';
   const itemInputs = document.getElementById('itemInputs');
   itemInputs.innerHTML = '';

   for (let i = 0; i < soMonDo; i++) {
      itemInputs.innerHTML += `
           <div>
               <input type="number" placeholder="Trọng lượng món đồ ${i + 1}" class="trongLuong" required>
               <input type="number" placeholder="Giá trị món đồ ${i + 1}" class="giaTri" required>
           </div>
       `;
   }
}

function tinhToan(event) {
   event.preventDefault(); // Ngăn form gửi dữ liệu
   const trongLuongBalo = parseInt(document.getElementById('trongLuongBalo').value); // Lấy giá trị balo từ form
   if (isNaN(trongLuongBalo)) {
      alert("Vui lòng nhập trọng lượng balo hợp lệ.");
      return;
   }

   const trongLuongs = Array.from(document.getElementsByClassName('trongLuong')).map(input => parseInt(input.value));
   const giaTris = Array.from(document.getElementsByClassName('giaTri')).map(input => parseInt(input.value));

   // Kiểm tra nếu bất kỳ input nào không phải số
   if (trongLuongs.includes(NaN) || giaTris.includes(NaN)) {
      alert("Vui lòng nhập đầy đủ và hợp lệ các trọng lượng và giá trị của món đồ.");
      return;
   }

   const soMonDo = giaTris.length;
   const giaTriLonNhat = Array(trongLuongBalo + 1).fill(0);
   const lanChon = Array(trongLuongBalo + 1).fill(-1); // Lưu chỉ số món đồ đã chọn
   const soLanChon = Array(soMonDo).fill(0);

   // Tính toán đơn giá và lưu vào mảng Arr
   const Arr = [];
   for (let i = 0; i < soMonDo; i++) {
      const donGia = giaTris[i] / trongLuongs[i];
      Arr.push(new DoVat(giaTris[i], trongLuongs[i], i)); // Tạo đối tượng DoVat
   }

   // Kiểm tra mảng Arr
   if (Arr.length === 0) {
      alert("Không có món đồ nào được nhập.");
      return;
   }

   // Hiển thị thông tin vào bảng
   const tableBody = document.getElementById('tableBody');
   tableBody.innerHTML = ''; // Xóa nội dung cũ
   Arr.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
           <td>Món đồ ${item.ChiSo + 1}</td>
           <td>${item.TrongLuong}</td>
           <td>${item.GiaTri}</td>
           <td>${(item.GiaTri / item.TrongLuong).toFixed(2)}</td>
       `;
      tableBody.appendChild(row);
   });

   // Hiển thị bảng
   document.getElementById('table_sort').style.display = 'block';

   // Tính giá trị lớn nhất
   for (let j = 0; j <= trongLuongBalo; j++) {
      for (let i = 0; i < Arr.length; i++) { // Sửa chỉ số vòng lặp
         if (Arr[i].TrongLuong <= j) {
            if (giaTriLonNhat[j] < giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri) {
               giaTriLonNhat[j] = giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri;
               lanChon[j] = i;
            }
         }
      }
   }

   // Truy vết món đồ đã chọn
   let trongLuongConLai = trongLuongBalo;
   while (trongLuongConLai > 0 && lanChon[trongLuongConLai] !== -1) {
      const i = lanChon[trongLuongConLai];
      soLanChon[i]++;
      trongLuongConLai -= Arr[i].TrongLuong;
   }

   // Truyền Arr vào hàm hienThiKetQua
   hienThiKetQua(giaTriLonNhat, soLanChon, trongLuongBalo, Arr);
}

function hienThiKetQua(giaTriLonNhat, soLanChon, trongLuongBalo, Arr) {
   const resultDiv = document.getElementById('result');
   resultDiv.style.display = 'block';
   const tongGiaTri = giaTriLonNhat[trongLuongBalo];
   let tongDonGia = 0;
   let tongTrongLuong = 0;
   resultDiv.innerHTML = `<strong>Giá trị lớn nhất của balo là:</strong> ${tongGiaTri}<br>`;
   resultDiv.innerHTML += `<strong>Các món đồ đã chọn:</strong><br>`;
   for (let i = 0; i < soLanChon.length; i++) {
      if (soLanChon[i] > 0) {
         resultDiv.innerHTML += `Món đồ ${Arr[i].ChiSo + 1} chọn ${soLanChon[i]} lần<br>`;
         tongTrongLuong += soLanChon[i] * Arr[i].TrongLuong;
         tongDonGia += (Arr[i].GiaTri / Arr[i].TrongLuong) * soLanChon[i];
      }
   }
   resultDiv.innerHTML += `<strong>Trọng lượng còn lại của balo là:</strong> ${trongLuongBalo - tongTrongLuong}<br>`;
   resultDiv.innerHTML += `<strong>Tổng đơn giá của các món đồ đã chọn là:</strong> ${tongDonGia.toFixed(2)}$<br>`;
}
