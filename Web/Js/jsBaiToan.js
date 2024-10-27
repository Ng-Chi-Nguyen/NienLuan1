class DoVat {
   constructor(giaTri, trongLuong, chiSo) {
      this.GiaTri = giaTri;
      this.TrongLuong = trongLuong;
      this.ChiSo = chiSo;
   }
}

let Arr = [];
let soMonDo = 0;
let trongLuongBalo = 0;
let giaTriLonNhat = [];
let lanChon = [];

const baloFormInputs = document.querySelectorAll('#baloForm input');
baloFormInputs.forEach(input => {
   input.addEventListener('input', function () {
      if (this.value) {
         this.style.borderColor = 'blue'; // Đổi viền thành màu xanh nếu có dữ liệu
      } else {
         this.style.borderColor = ''; // Reset viền nếu không có dữ liệu
      }
   });
});

function nhapMonDo() {
   const soMonDo = document.getElementById('soMonDo').value;
   const trongLuongBalo = document.getElementById('trongLuongBalo').value;
   // Tạo nội dung để hiển thị
   const ketQua = `
      <p class="content_SS1">Balo có ${soMonDo} món đồ và trọng lượng tối đa là ${trongLuongBalo} kg</p>
   `;
   document.getElementById('NoiDung_baloForm').innerHTML = ketQua;
   document.getElementById('baloForm').style.display = 'none';

   // Hiện phần nhập trọng lượng và giá trị
   document.getElementById('nhapGT_TL').style.display = 'block';
   const itemInputs = document.getElementById('itemInputs');
   itemInputs.innerHTML = '';

   for (let i = 0; i < soMonDo; i++) {
      itemInputs.innerHTML += `
           <div class="Box">
               <p>Đồ vật ${i + 1}: </p>
               <input type="number" placeholder="TL" class="trongLuong no-arrow" required>
               <input type="number" placeholder="GT" class="giaTri no-arrow" required>
           </div>
       `;
   }

   const allInputs = itemInputs.querySelectorAll('#nhapGT_TL .Box input');
   allInputs.forEach(input => {
      input.addEventListener('input', function () {
         if (this.value) {
            this.style.borderColor = 'blue'; // Đổi viền thành màu xanh nếu có dữ liệu
         } else {
            this.style.borderColor = ''; // Reset viền nếu không có dữ liệu
         }
      });
   });
}

function TimGiariLonNhat(event) {
   event.preventDefault();
   const trongLuongBalo = parseInt(document.getElementById('trongLuongBalo').value); // Lấy giá trị balo từ form

   const trongLuongs = Array.from(document.getElementsByClassName('trongLuong')).map(input => parseInt(input.value));
   const giaTris = Array.from(document.getElementsByClassName('giaTri')).map(input => parseInt(input.value));

   const soMonDo = giaTris.length;
   const giaTriLonNhat = Array(trongLuongBalo + 1).fill(0);
   const Arr = [];

   for (let i = 0; i < soMonDo; i++) {
      Arr.push(new DoVat(giaTris[i], trongLuongs[i], i));
   }
   hienThiBangPhuongAn(giaTriLonNhat, trongLuongBalo, soMonDo, Arr);
   hienThiKetQua(giaTriLonNhat, lanChon, trongLuongBalo, Arr); // Hiện kết quả
}

function hienThiBangPhuongAn(giaTriLonNhat, trongLuongBalo, soMonDo, Arr) {
   document.getElementById('nhapGT_TL').style.display = 'none';
   const titlePA = document.querySelectorAll(".title_PA");
   titlePA.forEach(element => {
      element.innerHTML = "<p>BẢNG PHƯƠNG ÁN</p>"; // Cập nhật nội dung cho từng phần tử
   });
   const tableHeader = document.getElementById('tableHead');
   const tableBody = document.getElementById('tableBody');

   // Xóa tiêu đề và các hàng dữ liệu cũ
   tableHeader.innerHTML = '';
   tableBody.innerHTML = '';

   // Tạo hàng tiêu đề
   const headerRow = document.createElement('tr');
   headerRow.innerHTML = '<td>$</td><td>W</td><td>V</td><td class="ij-cell"></td>';

   // Thêm các tiêu đề cột từ 0 đến trongLuongBalo
   for (let j = 0; j <= trongLuongBalo; j++) {
      const headerCell = document.createElement('td');
      headerCell.textContent = j;
      headerCell.classList.add('Bg_Nau'); // Thêm lớp màu nâu cho ô tiêu đề
      headerRow.appendChild(headerCell);
   }
   tableHeader.appendChild(headerRow); // Đặt hàng tiêu đề vào phần <thead>

   // Mảng lưu giá trị lớn nhất cho từng cột
   const maxValues = Array(trongLuongBalo + 1).fill(0);

   // Hàm phụ trợ để hiển thị bảng tại mỗi bước
   function hienThiHang(taiTrongLuongBalo, monDo) {
      const row = document.createElement('tr');

      // Kiểm tra trước khi hiển thị giá trị của món đồ
      if (monDo === 0) {
         row.innerHTML = `<td></td><td></td><td></td><td class="Bg_Nau">0</td>`;
      } else if (monDo - 1 < Arr.length && monDo - 1 >= 0) { // Kiểm tra chỉ số hợp lệ
         row.innerHTML = `
            <td>${(Arr[monDo - 1].GiaTri / Arr[monDo - 1].TrongLuong).toFixed(2)}</td>
            <td>${Arr[monDo - 1].TrongLuong}</td>
            <td>${Arr[monDo - 1].GiaTri}</td>
            <td class="Bg_Nau">${monDo}</td>
         `;
      } else {
         console.error("Món đồ không tồn tại tại chỉ số: " + (monDo - 1));
         row.innerHTML = `<td></td><td></td><td>${monDo}</td>`; // Hiển thị chỉ số mà không có giá trị
      }

      // Tạo một mảng lưu các ô cho từng giá trị
      const cells = [];

      for (let j = 0; j < taiTrongLuongBalo.length; j++) { // Cập nhật số ô cần hiển thị
         const cell = document.createElement('td');
         cell.textContent = taiTrongLuongBalo[j];
         row.appendChild(cell);
         cells.push(cell); // Lưu các ô vào mảng
      }

      // Tô màu cho ô có giá trị lớn nhất trong mỗi cột
      for (let j = 0; j < cells.length; j++) {
         const currentValue = taiTrongLuongBalo[j];

         // Lấy tất cả các giá trị trong cột hiện tại để tìm giá trị lớn nhất
         const columnValues = Array.from(tableBody.querySelectorAll(`tr td:nth-child(${j + 5})`)).map(cell => parseInt(cell.textContent || 0));

         // Lấy giá trị lớn nhất trong cột
         const maxInColumn = Math.max(...columnValues);

         // Kiểm tra nếu giá trị hiện tại lớn hơn giá trị lớn nhất trong cột
         if (currentValue > maxInColumn) {
            // Reset màu cho tất cả các ô trong cột
            const columnCells = Array.from(tableBody.querySelectorAll(`tr td:nth-child(${j + 5})`)); // Cột tương ứng
            columnCells.forEach(cell => {
               cell.style.color = ''; // Đặt lại màu mặc định
               cell.style.fontWeight = 'normal'; // Đặt lại chữ bình thường
            });

            // Tô màu ô hiện tại
            cells[j].style.color = 'red'; // Đổi màu ô có giá trị lớn nhất thành đỏ
            cells[j].style.fontWeight = 'bold'; // Đậm chữ
         }
      }

      tableBody.appendChild(row);
   }

   // Hàng đầu tiên cho trạng thái khi chưa có đồ vật nào
   hienThiHang(giaTriLonNhat.slice(), 0); // Sử dụng slice để không thay đổi mảng gốc
   // Tính giá trị lớn nhất
   for (let i = 0; i < Arr.length; i++) { // Lặp qua từng đồ vật
      for (let j = 0; j <= trongLuongBalo; j++) {
         if (Arr[i].TrongLuong <= j) {
            if (giaTriLonNhat[j] < giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri) {
               giaTriLonNhat[j] = giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri;
               lanChon[j] = i;
            }
         }
      }
      hienThiHang(giaTriLonNhat.slice(), i + 1); // Hiển thị giá trị sau khi xử lý từng đồ vật
   }

   document.getElementById('table_PA').style.display = 'block'; // Hiển thị bảng
}

function tinhSoLanChon(trongLuongBalo, Arr) {
   let soLanChon = Array(Arr.length).fill(0); // Khởi tạo soLanChon
   let trongLuongConLai = trongLuongBalo;

   while (trongLuongConLai > 0 && lanChon[trongLuongConLai] !== -1) {
      const i = lanChon[trongLuongConLai];
      soLanChon[i]++;
      trongLuongConLai -= Arr[i].TrongLuong;
   }

   return soLanChon; // Trả về kết quả
}

function hienThiKetQua(giaTriLonNhat, lanChon, trongLuongBalo, Arr) {
   const resultDiv = document.getElementById('result');
   const tongGiaTri = giaTriLonNhat[trongLuongBalo];
   let tongTrongLuong = 0;
   let tongDonGia = 0;

   resultDiv.style.display = 'block';
   resultDiv.innerHTML = `<strong>Giá trị lớn nhất của balo là:</strong> ${tongGiaTri !== undefined ? tongGiaTri : 0}<br>`;
   resultDiv.innerHTML += `<strong>Các món đồ đã chọn:</strong><br>`;

   // Tính toán số lần chọn cho từng món đồ
   const soLanChon = tinhSoLanChon(trongLuongBalo, Arr); // Sử dụng kết quả trả về

   for (let i = 0; i < soLanChon.length; i++) {
      if (soLanChon[i] > 0) {
         const doVat = Arr[i];
         resultDiv.innerHTML += `Món đồ ${doVat.ChiSo + 1} chọn ${soLanChon[i]} lần<br>`;
         tongTrongLuong += soLanChon[i] * doVat.TrongLuong;
         tongDonGia += (doVat.GiaTri / doVat.TrongLuong) * soLanChon[i];
      }
   }

   const trongLuongConLai = trongLuongBalo - tongTrongLuong;
   resultDiv.innerHTML += `<strong>Trọng lượng còn lại của balo là:</strong> ${trongLuongConLai}<br>`;
   resultDiv.innerHTML += `<strong>Tổng đơn giá của các món đồ đã chọn là:</strong> ${tongDonGia.toFixed(2)}$<br>`;
}