class DoVat {
   // Khi một đối tượng mới được tạo, hàm constructor sẽ được gọi tự động
   constructor(giaTri, trongLuong, chiSo) {
      // this: từ khóa này tham chiếu đến đối tượng hiện tại (đối tượng mà đang được tạo ra từ lớp)
      // Gán giá trị cho t.tính GiaTri của đối tượng từ t.số giaTri mà hàm constructor nhận đc
      this.GiaTri = giaTri;
      this.TrongLuong = trongLuong;
      this.ChiSo = chiSo;
   }
}

let Arr = [];
let soMonDo = 0; // Lưu số lượng món đồ
let trongLuongBalo = 0; // Theo dõi tổng trọng lượng hiện có trong ba lô
let giaTriLonNhat = []; // Luu GTLN
const lanChon = Array(trongLuongBalo + 1).fill(-1);

const baloFormInputs = document.querySelectorAll('#baloForm input');
// Lặp qua từng phần tử trong NodeList
baloFormInputs.forEach(input => {
   input.addEventListener('input', function () {
      //  Kiểm tra xem trường nhập liệu có giá trị hay không
      if (this.value) {
         this.style.borderColor = 'blue';
      } else {
         this.style.borderColor = ''; // Reset viền nếu không có dữ liệu
      }
   });
});
// Hàm để đặt lại trò chơi
function resetGame(e) {
   e.preventDefault();
   location.reload(); // Tải lại trang
}
function kiemTraRong(value, errorMessage) {
   const error = document.getElementById('error');
   if (value === "") {
      error.innerHTML = errorMessage;
      error.style.display = 'block';

      setTimeout(() => {
         error.style.display = 'none';
      }, 3000);
      return true;
   }
   return false;
}
function nhapMonDo() {
   const soMonDo = document.getElementById('soMonDo').value;
   const trongLuongBalo = document.getElementById('trongLuongBalo').value;
   // console.log(soMonDo)
   // console.log(trongLuongBalo)
   // Kiểm tra xem có nhập cả hai trường không
   if (kiemTraRong(soMonDo, "Bạn chưa nhập số lượng đồ vật") ||
      kiemTraRong(trongLuongBalo, "Bạn chưa nhập trọng lượng balo")) {
      return;
   }
   // Tạo nội dung để hiển thị
   const ketQua = `
         <p class="content_SS1">
            Balo có ${soMonDo} món đồ và trọng lượng tối đa là ${trongLuongBalo} kg
            <img class="loadGame" id="loadGame" src="./Img/iconChoiLaiGame.png">
         </p>
   `;

   document.getElementById('NoiDung_baloForm').innerHTML = ketQua;
   document.getElementById('baloForm').style.display = 'none';

   const resetButton = document.getElementById('loadGame');
   resetButton.addEventListener('click', resetGame);

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
      // Tạo một ô tiêu đề mới với thẻ <td> cho mỗi giá trị trọng lượng
      const headerCell = document.createElement('td');
      // Thiết lập nội dung của ô là giá trị của j
      headerCell.textContent = j;
      headerCell.classList.add('Bg_Nau');
      // Thêm ô tiêu đề mới vào hàng tiêu đề (headerRow).
      headerRow.appendChild(headerCell);
   }
   tableHeader.appendChild(headerRow); // Đặt hàng tiêu đề vào phần <thead>

   // Mảng lưu giá trị lớn nhất cho từng cột
   const maxValues = Array(trongLuongBalo + 1).fill(0);

   // Hàm phụ trợ để hiển thị bảng tại mỗi bước
   function hienThiHang(taiTrongLuongBalo, monDo) {
      // Tạo một phần tử <tr> mới, tương ứng với một hàng trong bảng.
      const row = document.createElement('tr');

      // Kiểm tra trước khi hiển thị giá trị của món đồ
      if (monDo === 0) { // chưa có món đồ nào
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
      // Vòng lặp này lặp qua từng giá trị trong mảng taiTrongLuongBalo.
      for (let j = 0; j < taiTrongLuongBalo.length; j++) { // Cập nhật số ô cần hiển thị
         const cell = document.createElement('td'); // Tạo một ô mới cho mỗi giá trị
         cell.textContent = taiTrongLuongBalo[j]; // Gán giá trị tương ứng từ mảng taiTrongLuongBalo cho ô.
         row.appendChild(cell); // Thêm ô vào hàng
         cells.push(cell); // Lưu các ô vào mảng
      }

      // Tô màu cho ô có giá trị lớn nhất trong mỗi cột

      //Vòng lặp này sẽ lặp qua tất cả các ô (cell) trong hàng vừa tạo.
      for (let j = 0; j < cells.length; j++) {
         // Lưu giá trị hiện tại của cột j vào biến currentValue
         const currentValue = taiTrongLuongBalo[j];

         // Lấy tất cả các giá trị trong cột hiện tại để tìm giá trị lớn nhất ------------------------------------

         // .map(cell => parseInt(cell.textContent || 0)): Chuyển đổi danh sách các ô thành mảng chứa các giá trị số nguyên, sử dụng parseInt để đảm bảo rằng nếu ô trống, nó sẽ trở thành 0.
         const columnValues = Array.from(tableBody.querySelectorAll(`tr td:nth-child(${j + 5})`)).map(cell => parseInt(cell.textContent || 0));

         // Lấy giá trị lớn nhất trong cột
         const maxInColumn = Math.max(...columnValues);

         // Kiểm tra nếu giá trị hiện tại lớn hơn giá trị lớn nhất trong cột
         if (currentValue > maxInColumn) {
            // Reset màu cho tất cả các ô trong cột
            const columnCells = Array.from(tableBody.querySelectorAll(`tr td:nth-child(${j + 5})`)); // Lấy tất cả các ô trong cột tương ứng.
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

   // Tính giá trị lớn nhất thuật toán để giải bài toán ba lô-----------------------------------------------------
   console.log(Arr); // Kiểm tra xem Arr có chứa đồ vật không
   console.log('Độ dài của Arr:', Arr.length); // Kiểm tra chiều dài của mảng
   for (let i = 0; i < Arr.length; i++) { // Lặp qua từng đồ vật
      console.log(`Kiểm tra món đồ ${i + 1}: Trọng lượng ${Arr[i].TrongLuong}, Giá trị ${Arr[i].GiaTri}`);
      for (let j = 0; j <= trongLuongBalo; j++) {
         if (Arr[i].TrongLuong <= j) {
            if (giaTriLonNhat[j] < giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri) {
               giaTriLonNhat[j] = giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri;
               lanChon[j] = i; // Cập nhật chỉ số món đồ được chọn cho trọng lượng j
               console.log(`Cập nhật lanChon[${j}] thành ${i + 1}`);
            }
         }
      }
      hienThiHang(giaTriLonNhat.slice(), i + 1); // Hiển thị giá trị sau khi xử lý từng đồ vật i
   }
   console.log("Mảng lanChon cuối cùng:", lanChon);

   document.getElementById('table_PA').style.display = 'block'; // Hiển thị bảng
}

function timMonDoDuocChon(trongLuongBalo, giaTriLonNhat, lanChon, Arr) {
   let soLanChon = Array(Arr.length).fill(0); // Khởi tạo mảng lưu số lần chọn từng món
   let trongLuongConLai = trongLuongBalo;

   // Kiểm tra mảng Arr và lanChon
   if (!Array.isArray(Arr) || Arr.length === 0) {
      console.error("Mảng Arr không hợp lệ hoặc rỗng");
      return soLanChon; // Trả về mảng rỗng
   }
   if (!Array.isArray(lanChon) || lanChon.length < trongLuongBalo) {
      console.error("lanChon không hợp lệ");
      return soLanChon; // Trả về mảng rỗng
   }

   // Tìm ngược từ trọng lượng tối đa đến khi không thể chọn thêm món nào
   while (trongLuongConLai > 0 && lanChon[trongLuongConLai] !== -1) {
      const i = lanChon[trongLuongConLai]; // Món đồ đã chọn ở trọng lượng hiện tại

      // Kiểm tra xem chỉ số i có hợp lệ không
      if (i >= 0 && i < Arr.length) {
         soLanChon[i]++;
         trongLuongConLai -= Arr[i].TrongLuong; // Giảm trọng lượng còn lại
      } else {
         console.error(`Chỉ số món đồ không hợp lệ: ${i}`);
         break; // Dừng vòng lặp nếu chỉ số không hợp lệ
      }
   }

   // Hiển thị kết quả các món đồ được chọn
   console.log("Các món đồ đã chọn:");
   soLanChon.forEach((lanChon, i) => {
      if (lanChon > 0) {
         console.log(`Món đồ ${Arr[i].ChiSo + 1}: chọn ${lanChon} lần`);
      }
   });
   console.log(soLanChon);
   return soLanChon; // Trả về mảng số lần chọn từng món
}


function hienThiKetQua(giaTriLonNhat, lanChon, trongLuongBalo, Arr) {
   const resultDiv = document.getElementById('result');
   const tongGiaTri = giaTriLonNhat[trongLuongBalo];
   let tongTrongLuong = 0;
   let tongDonGia = 0;
   resultDiv.style.display = 'block';
   const soLanChon = timMonDoDuocChon(trongLuongBalo, giaTriLonNhat, lanChon, Arr); // Sử dụng kết quả trả về
   // console.log(soLanChon)
   if (soLanChon.every(count => count === 0)) {
      // console.log("Không có đồ vật nào được chọn");
      resultDiv.innerHTML += `<p class="co-red">Không có đồ vật nào được chọn, tất cả đều vượt quá trọng lượng tối đa của balo</p>`;
      return; // Kết thúc hàm
   }
   resultDiv.innerHTML = `<strong>Giá trị lớn nhất của balo là:</strong> ${tongGiaTri !== undefined ? tongGiaTri : 0}<br>`;

   resultDiv.innerHTML += `<strong>Các món đồ đã chọn:</strong><br>`;

   // Tính toán số lần chọn cho từng món đồ
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