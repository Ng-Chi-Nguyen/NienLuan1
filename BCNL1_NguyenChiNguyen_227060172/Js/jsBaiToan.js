class DoVat {
   // Khi một đối tượng mới được tạo, hàm constructor sẽ được gọi tự động
   constructor(giaTri, trongLuong, chiSo) {
      // this: từ khóa này tham chiếu đến đối tượng hiện tại (đối tượng mà đang được tạo ra từ lớp)
      // Gán giá trị cho thuộc tính GiaTri của đối tượng từ tham số giaTri mà hàm constructor nhận được
      this.GiaTri = giaTri;
      this.TrongLuong = trongLuong;
      this.ChiSo = chiSo;
      this.SoLuong = 0;
   }
}

let Arr = [];
let soMonDo = 0; // Lưu số lượng món đồ
let trongLuongBalo = 0; // Theo dõi tổng trọng lượng hiện có trong ba lô
let giaTriLonNhat = []; // Lưu giá trị lớn nhất
const lanChon = Array(trongLuongBalo + 1).fill(-1);

const baloFormInputs = document.querySelectorAll('#baloForm input');
// Lặp qua từng phần tử trong NodeList
baloFormInputs.forEach(input => {
   input.addEventListener('input', function () {
      // Kiểm tra xem trường nhập liệu có giá trị hay không
      if (this.value) {
         this.style.borderColor = 'blue';
      } else {
         this.style.borderColor = ''; // Reset viền nếu không có dữ liệu
      }
   });
});
function TimGiaTriLonNhat(event) {
   event.preventDefault();
   TimGiaTriLonNhat_QuyHoachDong(event);
   TimGiaTriLonNhat_ThamAn(event);
}
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
function kiemTraHopLe(value, errorMessage) {
   const error = document.getElementById('error');
   if (isNaN(value) || value <= 0) {
      error.innerHTML = errorMessage;
      error.style.display = 'block';

      setTimeout(() => {
         error.style.display = 'none';
      }, 3000);
      return true;
   }
   return false; // Nếu hợp lệ, trả về false
}

function kiemTraSoThapPhan(value, errorMessage) {
   const error = document.getElementById('error');
   const regex = /^\d*\.\d+$/; // Biểu thức chính quy để kiểm tra số thập phân

   if (regex.test(value)) {
      error.innerHTML = errorMessage;
      error.style.display = 'block';

      setTimeout(() => {
         error.style.display = 'none';
      }, 3000);
      return true;
   }

   return false; // Nếu không phải số thập phân, trả về false
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
   if (kiemTraHopLe(soMonDo, "Số lượng đồ vật phải là số lớn hơn 0") ||
      kiemTraHopLe(trongLuongBalo, "Trọng lượng balo phải là số lớn hơn 0")) {
      return;
   }
   if (kiemTraSoThapPhan(soMonDo, "Số lượng đồ vật không được là số thập phân") ||
      kiemTraSoThapPhan(trongLuongBalo, "Trọng lượng balo không được là số thập phân")) {
      return;
   }
   // Tạo nội dung để hiển thị
   const ketQua_SS1 = `
         <div class="content_SS1">
            <p class="Weight">Trọng lượng Balo <span class="co-red">${trongLuongBalo}</span> kg</p>
            <img class="loadGame" id="loadGame" src="./Img/iconChoiLaiGame.png">
         </div>
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
               <p class="title_add">Đồ vật ${i + 1}: </p>
               <input type="number" placeholder="TL" class="trongLuong no-arrow" required  tabindex="4">
               <input type="number" placeholder="GT" class="giaTri no-arrow" required  tabindex="4">
           </div>
       `;
   }

   const tatCaONhapGT_TL = oNhapGT_TL.querySelectorAll('.Box input');
   tatCaONhapGT_TL.forEach(input => {
      input.addEventListener('input', function () {
         // Kiểm tra nếu giá trị là số âm hoặc số thập phân
         if (this.value <= 0 || /^[0-9]*[.][0-9]+$/.test(this.value)) {
            this.style.borderColor = 'red'; // Đổi viền thành màu đỏ nếu có lỗi
            this.setCustomValidity("Giá trị không được là số âm hoặc số thập phân");
         } else {
            this.style.borderColor = 'blue'; // Reset viền nếu giá trị hợp lệ
            this.setCustomValidity(""); // Reset thông báo lỗi
         }
      });
   });

}

function TimGiaTriLonNhat_QuyHoachDong(event) {
   event.preventDefault();
   const BPA = document.getElementById('dis_none');
   BPA.style.display = "block";
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
   document.querySelector('.Weight').classList.add('hide-before');

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
   hangTieuDe.innerHTML = '<td><img class="Dola" src="./Img/Dola.png"></td><td><i class="fa-sharp fa-solid fa-scale-unbalanced"></i></td><td><i class="fa-sharp fa-solid fa-sack-dollar"></i></td><td class="ij-cell"></td>';

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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
   let GioiHan = 0;
   while (trongLuongConLai > 0 && lanChon[trongLuongConLai] !== -1 && GioiHan < 1000) {
      console.log(trongLuongConLai)
      const i = lanChon[trongLuongConLai];
      if (i >= 0 && i < Arr.length) {
         soLanChon[i]++;
         trongLuongConLai -= Arr[i].TrongLuong;
      }
      GioiHan++;
   }
   // if (GioiHan >= 2) {
   //    console.log("Vòng lặp bị giới hạn để tránh vô hạn.");
   // }

   return soLanChon; // Trả về mảng số lần chọn từng món
}




function hienThiKetQua(giaTriLonNhat, lanChon, trongLuongBalo, Arr) {
   const boxKetQua = document.getElementById('AnKQ');
   boxKetQua.style.display = "block";
   const KetQua = document.getElementById('result_QuyHoachDong');
   const tongGiaTri = giaTriLonNhat[trongLuongBalo];
   let tongTrongLuong = 0;
   let tongDonGia = 0;
   KetQua.style.display = 'block';
   const soLanChon = timMonDoDuocChon(trongLuongBalo, giaTriLonNhat, lanChon, Arr);

   if (soLanChon.every(count => count === 0)) {
      KetQua.innerHTML += `<p class="co-red ma-left">Không có đồ vật nào được chọn, tất cả đều vượt quá <br> trọng lượng tối đa của balo</p>`;
      document.getElementById('dapan').style.display = "none";
      const QHD = document.getElementById("result_QuyHoachDong");
      QHD.style.marginLeft = "35px";
      QHD.style.border = "none";
      return;
   }

   // Tính toán tổng trọng lượng và đơn giá trước khi hiển thị
   for (let i = 0; i < soLanChon.length; i++) {
      if (soLanChon[i] > 0) {
         const doVat = Arr[i];
         tongTrongLuong += soLanChon[i] * doVat.TrongLuong;
         tongDonGia += (doVat.GiaTri / doVat.TrongLuong) * soLanChon[i];
      }
   }

   const trongLuongConLai = trongLuongBalo - tongTrongLuong;

   KetQua.innerHTML = `
      <div class="row_KqGTLN noWrap">
         <div class="kq_GTLN">Giá trị lớn nhất:</div><p class="kq_GTLN_kq"> ${tongGiaTri !== undefined ? tongGiaTri : 0}</p>
      </div>
      <div class="row_KqGTLN">
         <div class="kq_GTLN noWrap">Trọng lượng còn lại:</div> <p class="kq_GTLN_kq">${trongLuongConLai} kg</p>
      </div>
      <div class="row_KqGTLN">
         <div class="kq_GTLN noWrap">Tổng đơn giá:</div> <p class="kq_GTLN_kq">${tongDonGia.toFixed(2)}$</p>
      </div>
      <div class="kq_GTLN text_center">Đồ vật đã chọn</div>
   `;

   // Hiển thị thông tin các đồ vật được chọn
   for (let i = 0; i < soLanChon.length; i++) {
      if (soLanChon[i] > 0) {
         const doVat = Arr[i];
         KetQua.innerHTML += `<p class="CacDoVatDcChon kq_GTLN_kq">Đồ vật ${doVat.ChiSo + 1} chọn ${soLanChon[i]} lần <br></p>`;
      }
   }
}

function TimGiaTriLonNhat_ThamAn(event) {
   event.preventDefault();
   const trongLuongBalo = parseInt(document.getElementById('trongLuongBalo').value); // Lấy giá trị balo từ form

   const trongLuongs = Array.from(document.getElementsByClassName('trongLuong')).map(input => parseInt(input.value));
   const giaTris = Array.from(document.getElementsByClassName('giaTri')).map(input => parseInt(input.value));
   const soMonDo = giaTris.length;
   const Arr = [];

   for (let i = 0; i < soMonDo; i++) {
      Arr.push(new DoVat(giaTris[i], trongLuongs[i], i));
   }
   Arr.sort((a, b) => b.GiaTri - a.GiaTri);
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   let tongGiaTri = 0;
   let tongTrongLuong = 0;
   let lanChon = new Array(soMonDo).fill(0); // Khởi tạo mảng lanChon với 0 cho từng đồ vật
   for (let i = 0; i < Arr.length; i++) {
      // console.log(i)
      while (tongTrongLuong + Arr[i].TrongLuong <= trongLuongBalo) {
         tongGiaTri += Arr[i].GiaTri;
         tongTrongLuong += Arr[i].TrongLuong;
         Arr[i].SoLuong++; // Tăng số lượng cho món đồ đang được chọn
         lanChon[Arr[i].ChiSo]++; // Tăng số lần chọn cho đồ vật tương ứng
      }
   }
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   TaoBang_ThamAn(Arr, lanChon);
   HienThiKetQua_ThamAn(tongGiaTri, Arr, lanChon);
}
function TaoBang_ThamAn(Arr, lanChon) {
   // Đặt giá trị mặc định cho trongLuongBalo nếu chưa truyền vào (ở đây là 100)
   const trongLuongBalo = document.getElementById('trongLuongBalo').value;

   document.getElementById('nhapGT_TL').style.display = 'none';
   const tieuDeTA = document.querySelectorAll(".title_TA_ThamAn");
   tieuDeTA.forEach(element => {
      element.innerHTML = "<p>BẢNG THAM AN</p>";
      element.classList.add("bold")
   });

   const tieuDeBang = document.getElementById('tableHead_ThamAn');
   const noiDungBang = document.getElementById('tableBody_ThamAn');

   // Xóa tiêu đề và các hàng dữ liệu cũ
   tieuDeBang.innerHTML = '';
   noiDungBang.innerHTML = '';

   // Tạo hàng tiêu đề
   const hangTieuDe = document.createElement('tr');
   hangTieuDe.innerHTML = '<td class="Bg_Nau">Đồ vật</td><td><i class="fa-sharp fa-solid fa-sack-dollar"></td><td><i class="fa-sharp fa-solid fa-scale-unbalanced"></i></td><td><img class="Dola" src="./Img/Dola.png"></td><td class="Bg_Nau">Chọn</td>';
   tieuDeBang.appendChild(hangTieuDe);

   // Tạo nội dung bảng dựa trên mảng Arr
   Arr.forEach(doVat => {
      const donGia = (doVat.GiaTri / doVat.TrongLuong).toFixed(2); // Tính đơn giá trực tiếp
      const hangDuLieu = document.createElement('tr');
      const rowClass = lanChon[doVat.ChiSo] > 0 ? 'co-red' : '';
      hangDuLieu.innerHTML = `<td>${doVat.ChiSo + 1}</td><td>${doVat.GiaTri}</td><td>${doVat.TrongLuong}</td><td>${donGia}</td><td class="${rowClass}">${lanChon[doVat.ChiSo]}</td>`;
      noiDungBang.appendChild(hangDuLieu);
   });
}
function HienThiKetQua_ThamAn(tongGiaTri, Arr, lanChon) {
   const boxKetQua = document.getElementById('AnKQ');
   boxKetQua.style.display = "block";
   const trongLuongBalo = document.getElementById('trongLuongBalo').value;

   // Tính tổng đơn giá và lọc ra các đồ vật được chọn
   const tongDonGia = Arr.reduce((sum, doVat) => sum + ((doVat.GiaTri / doVat.TrongLuong) * lanChon[doVat.ChiSo]), 0);
   const doVatDuocChon = Arr.filter(doVat => lanChon[doVat.ChiSo] > 0);
   console.log(doVatDuocChon);

   // Hiển thị kết quả tổng hợp
   const KetQua = document.getElementById('result_ThamAn');
   if (doVatDuocChon.length === 0) {
      KetQua.innerHTML = ``;
      return;
   }
   // Tính tổng trọng lượng của các đồ vật được chọn
   const trongLuongDaDung = doVatDuocChon.reduce((sum, doVat) => sum + (doVat.TrongLuong * lanChon[doVat.ChiSo]), 0);
   const trongLuongConLai = trongLuongBalo - trongLuongDaDung;

   KetQua.style.display = 'block';
   KetQua.innerHTML = `
      <p class="kq_GTLN_kq_ThamAn width">${tongGiaTri}</p>
      <p class="kq_GTLN_kq_ThamAn width">${trongLuongConLai} kg</p>
      <p class="kq_GTLN_kq_ThamAn width mg_bottom">${tongDonGia.toFixed(2)}$</p>
      ${doVatDuocChon.map(doVat => `<p class="CacDoVatDcChon mg_top kq_GTLN_kq_ThamAn">Đồ vật ${doVat.ChiSo + 1} chọn ${lanChon[doVat.ChiSo]} lần</p>`).join('')}
   `;
}
