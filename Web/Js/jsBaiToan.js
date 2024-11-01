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
}
function nhapMonDo() {
   const soMonDo = document.getElementById('soMonDo').value;
   const trongLuongBalo = document.getElementById('trongLuongBalo').value;
   console.log(soMonDo)
   console.log(trongLuongBalo)
   // Kiểm tra xem có nhập cả hai trường không

   if (kiemTraRong(soMonDo, "Bạn chưa nhập số lượng đồ vật") ||
      kiemTraRong(trongLuongBalo, "Bạn chưa nhập trọng lượng balo")) {
      return;
   }

   // Tạo nội dung để hiển thị
   const ketQua_SS1 = `
         <p class="content_SS1">
            Balo có ${soMonDo} món đồ và trọng lượng tối đa là ${trongLuongBalo} kg
            <img class="loadGame" id="loadGame" src="./Img/iconChoiLaiGame.png">
         </p>
   `;

   document.getElementById('NoiDung_baloForm').innerHTML = ketQua_SS1;
   document.getElementById('baloForm').style.display = 'none';

   const nutChoiLai = document.getElementById('loadGame');
   nutChoiLai.addEventListener('click', resetGame);

   // Hiện phần nhập trọng lượng và giá trị
   document.getElementById('nhapGT_TL').style.display = 'block';
   const oNhapGT_TL = document.getElementById('itemInputs');
   oNhapGT_TL.innerHTML = '';

   for (let i = 0; i < soMonDo; i++) {
      oNhapGT_TL.innerHTML += `
           <div class="Box">
               <p>Đồ vật ${i + 1}: </p>
               <input type="number" placeholder="TL" class="trongLuong no-arrow" required  tabindex="4">
               <input type="number" placeholder="GT" class="giaTri no-arrow" required  tabindex="4">
           </div>
       `;
   }
   const tatCaONhapGT_TL = oNhapGT_TL.querySelectorAll('#nhapGT_TL .Box input');
   tatCaONhapGT_TL.forEach(input => {
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
   const tieuDePA = document.querySelectorAll(".title_PA");
   tieuDePA.forEach(element => {
      element.innerHTML = "<p>BẢNG PHƯƠNG ÁN</p>"; // Cập nhật nội dung cho từng phần tử
   });
   const tieuDeBang = document.getElementById('tableHead');
   const noiDungBang = document.getElementById('tableBody');

   // Xóa tiêu đề và các hàng dữ liệu cũ
   tieuDeBang.innerHTML = '';
   noiDungBang.innerHTML = '';

   // Tạo hàng tiêu đề
   const hangTieuDe = document.createElement('tr');
   hangTieuDe.innerHTML = '<td>$</td><td>W</td><td>V</td><td class="ij-cell"></td>';

   // Thêm các tiêu đề cột từ 0 đến trongLuongBalo
   for (let j = 0; j <= trongLuongBalo; j++) {
      // Tạo một ô tiêu đề mới với thẻ <td> cho mỗi giá trị trọng lượng
      const oTieuDe = document.createElement('td');
      // Thiết lập nội dung của ô là giá trị của j
      oTieuDe.textContent = j;
      oTieuDe.classList.add('Bg_Nau');
      // Thêm ô tiêu đề mới vào hàng tiêu đề (hangTieuDe).
      hangTieuDe.appendChild(oTieuDe);
   }
   tieuDeBang.appendChild(hangTieuDe); // Đặt hàng tiêu đề vào phần <thead>

   // Mảng lưu giá trị lớn nhất cho từng cột
   const giaTriMax = Array(trongLuongBalo + 1).fill(0);

   // Hàm phụ trợ để hiển thị bảng tại mỗi bước
   function hienThiHang(taiTrongLuongBalo, monDo) {
      // Tạo một phần tử <tr> mới, tương ứng với một hàng trong bảng.
      const hang = document.createElement('tr');

      // Kiểm tra trước khi hiển thị giá trị của món đồ
      if (monDo === 0) { // chưa có món đồ nào
         hang.innerHTML = `<td></td><td></td><td></td><td class="Bg_Nau">0</td>`;
      } else if (monDo - 1 < Arr.length && monDo - 1 >= 0) { // Kiểm tra chỉ số hợp lệ
         hang.innerHTML = `
            <td>${(Arr[monDo - 1].GiaTri / Arr[monDo - 1].TrongLuong).toFixed(2)}</td>
            <td>${Arr[monDo - 1].TrongLuong}</td>
            <td>${Arr[monDo - 1].GiaTri}</td>
            <td class="Bg_Nau">${monDo}</td>
         `;
      } else {
         console.error("Món đồ không tồn tại tại chỉ số: " + (monDo - 1));
         hang.innerHTML = `<td></td><td></td><td>${monDo}</td>`; // Hiển thị chỉ số mà không có giá trị
      }

      // Tạo một mảng lưu các ô cho từng giá trị
      const o = [];
      // Vòng lặp này lặp qua từng giá trị trong mảng taiTrongLuongBalo.
      for (let j = 0; j < taiTrongLuongBalo.length; j++) { // Cập nhật số ô cần hiển thị
         const oMoi = document.createElement('td'); // Tạo một ô mới cho mỗi giá trị
         oMoi.textContent = taiTrongLuongBalo[j]; // Gán giá trị tương ứng từ mảng taiTrongLuongBalo cho ô.
         // console.log(oMoi);
         hang.appendChild(oMoi); // Thêm ô vào hàng
         o.push(oMoi); // Lưu các ô vào mảng
      }

      // Tô màu cho ô có giá trị lớn nhất trong mỗi cột

      //Vòng lặp này sẽ lặp qua tất cả các ô (oMoi) trong hàng vừa tạo.
      for (let j = 0; j < o.length; j++) {
         // Lưu giá trị hiện tại của cột j vào biến giaTriHienTai 
         const giaTriHienTai = taiTrongLuongBalo[j];

         // Lấy tất cả các giá trị trong cột hiện tại để tìm giá trị lớn nhất ------------------------------------

         // .map(oMoi  => parseInt(oMoi .textContent || 0)): Chuyển đổi danh sách các ô thành mảng chứa các giá trị số nguyên, sử dụng parseInt để đảm bảo rằng nếu ô trống, nó sẽ trở thành 0.
         const giaTriCot = Array.from(noiDungBang.querySelectorAll(`tr td:nth-child(${j + 5})`)).map(oMoi => parseInt(oMoi.textContent || 0));

         // Lấy giá trị lớn nhất trong cột
         const giaTriMaxTrongCot = Math.max(...giaTriCot);

         // Kiểm tra nếu giá trị hiện tại lớn hơn giá trị lớn nhất trong cột
         if (giaTriHienTai > giaTriMaxTrongCot) {
            // Reset màu cho tất cả các ô trong cột
            const oCot = Array.from(noiDungBang.querySelectorAll(`tr td:nth-child(${j + 5})`)); // Lấy tất cả các ô trong cột tương ứng.
            oCot.forEach(oMoi => {
               oMoi.style.color = ''; // Đặt lại màu mặc định
               oMoi.style.fontWeight = 'normal'; // Đặt lại chữ bình thường
            });

            // Tô màu ô hiện tại
            o[j].style.color = 'red'; // Đổi màu ô có giá trị lớn nhất thành đỏ
            o[j].style.fontWeight = 'bold'; // Đậm chữ
         }
      }

      noiDungBang.appendChild(hang);
   }

   // Hàng đầu tiên cho trạng thái khi chưa có đồ vật nào
   hienThiHang(giaTriLonNhat.slice(), 0); // Sử dụng slice để không thay đổi mảng gốc

   // Tính giá trị lớn nhất thuật toán để giải bài toán ba lô-----------------------------------------------------
   // console.log(Arr); // Kiểm tra xem Arr có chứa đồ vật không
   // console.log('Độ dài của Arr:', Arr.length); // Kiểm tra chiều dài của mảng
   for (let i = 0; i < Arr.length; i++) { // Lặp qua từng đồ vật
      // console.log(`Kiểm tra món đồ ${i + 1}: Trọng lượng ${Arr[i].TrongLuong}, Giá trị ${Arr[i].GiaTri}`);
      for (let j = 0; j <= trongLuongBalo; j++) {
         if (Arr[i].TrongLuong <= j) {
            if (giaTriLonNhat[j] < giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri) {
               giaTriLonNhat[j] = giaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri;
               lanChon[j] = i; // Cập nhật chỉ số món đồ được chọn cho trọng lượng j
               // console.log(`Cập nhật lanChon[${j}] thành ${i + 1}`);
            }
         }
      }
      hienThiHang(giaTriLonNhat.slice(), i + 1); // Hiển thị giá trị sau khi xử lý từng đồ vật i
   }
   // console.log("Mảng lanChon cuối cùng:", lanChon);

   document.getElementById('table_PA').style.display = 'block'; // Hiển thị bảng
}

function timMonDoDuocChon(trongLuongBalo, giaTriLonNhat, lanChon, Arr) {
   let soLanChon = Array(Arr.length).fill(0); // Khởi tạo mảng lưu số lần chọn từng món
   let trongLuongConLai = trongLuongBalo;
   console.log(trongLuongBalo)
   console.log(lanChon)
   // Kiểm tra mảng Arr và lanChon
   if (Arr.length === 0) {
      console.error("Mảng Arr không hợp lệ hoặc rỗng");
      return soLanChon; // Trả về mảng rỗng
   }
   if (lanChon.length < trongLuongBalo) {
      console.error("lanChon không hợp lệ");
      return soLanChon; // Trả về mảng rỗng
   }

   // Tìm ngược từ trọng lượng tối đa đến khi không thể chọn thêm món nào
   while (trongLuongConLai > 0 && lanChon[trongLuongConLai] !== -1) {
      const i = lanChon[trongLuongConLai]; // Món đồ đã chọn ở trọng lượng hiện tại
      // Kiểm tra xem chỉ số i có hợp lệ không
      if (i >= 0 && i < Arr.length) {
         // console.log(i);
         soLanChon[i]++;
         trongLuongConLai -= Arr[i].TrongLuong; // Giảm trọng lượng còn lại
      }
   }

   // Hiển thị kết quả các món đồ được chọn
   // console.log("Các món đồ đã chọn:");
   // soLanChon.forEach((lanChon, i) => {
   //    if (lanChon > 0) {
   //       console.log(`Món đồ ${Arr[i].ChiSo + 1}: chọn ${lanChon} lần`);
   //    }
   // });
   // console.log(soLanChon);
   return soLanChon; // Trả về mảng số lần chọn từng món
}


function hienThiKetQua(giaTriLonNhat, lanChon, trongLuongBalo, Arr) {
   const KetQua = document.getElementById('result');
   const tongGiaTri = giaTriLonNhat[trongLuongBalo];
   let tongTrongLuong = 0;
   let tongDonGia = 0;
   KetQua.style.display = 'block';
   const soLanChon = timMonDoDuocChon(trongLuongBalo, giaTriLonNhat, lanChon, Arr); // Sử dụng kết quả trả về
   // console.log(soLanChon)
   if (soLanChon.every(count => count === 0)) {
      // console.log("Không có đồ vật nào được chọn");
      KetQua.innerHTML += `<p class="co-red">Không có đồ vật nào được chọn, tất cả đều vượt quá trọng lượng tối đa của balo</p>`;
      return; // Kết thúc hàm
   }
   KetQua.innerHTML = `<strong>Giá trị lớn nhất của balo là:</strong> ${tongGiaTri !== undefined ? tongGiaTri : 0}<br>`;

   KetQua.innerHTML += `<strong>Các món đồ đã chọn:</strong><br>`;

   // Tính toán số lần chọn cho từng món đồ
   for (let i = 0; i < soLanChon.length; i++) {
      if (soLanChon[i] > 0) {
         const doVat = Arr[i];
         KetQua.innerHTML += `Món đồ ${doVat.ChiSo + 1} chọn ${soLanChon[i]} lần<br>`;
         tongTrongLuong += soLanChon[i] * doVat.TrongLuong;
         tongDonGia += (doVat.GiaTri / doVat.TrongLuong) * soLanChon[i];
      }
   }

   const trongLuongConLai = trongLuongBalo - tongTrongLuong;
   KetQua.innerHTML += `<strong>Trọng lượng còn lại của balo là:</strong> ${trongLuongConLai}<br>`;
   KetQua.innerHTML += `<strong>Tổng đơn giá của các món đồ đã chọn là:</strong> ${tongDonGia.toFixed(2)}$<br>`;
}