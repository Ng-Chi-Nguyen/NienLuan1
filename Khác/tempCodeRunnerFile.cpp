#include <iostream>
#include <cstring>   // Cho memset
#include <algorithm> // Cho hàm max
using namespace std;

struct DoVat
{
   int GiaTri, TrongLuong;
};

void NhapDuLieu(DoVat Arr[], int &SoMonDo, int &TrongLuongBalo)
{
   cout << "Nhap so mon do: ";
   cin >> SoMonDo;
   cout << "Nhap trong luong toi da cua balo: ";
   cin >> TrongLuongBalo;
   cout << "Nhap lan luot trong luong - gia tri" << endl;
   for (int i = 0; i < SoMonDo; i++)
   {
      cout << "Mon do " << i + 1 << ": ";
      cin >> Arr[i].TrongLuong >> Arr[i].GiaTri;
   }
}

void TinhGiaTriLonNhat(DoVat Arr[], int SoMonDo, int TrongLuongBalo, int GiaTriLonNhat[], int LanChon[])
{
   for (int i = 0; i < SoMonDo; i++)
   {
      for (int j = Arr[i].TrongLuong; j <= TrongLuongBalo; j++)
      {
         if (GiaTriLonNhat[j] < GiaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri)
         {
            GiaTriLonNhat[j] = max(GiaTriLonNhat[j], GiaTriLonNhat[j - Arr[i].TrongLuong] + Arr[i].GiaTri);
            LanChon[j] = i;
         }
      }
   }
}

void TruyVetMonDo(DoVat Arr[], int SoMonDo, int TrongLuongBalo, int LanChon[], int SoLanChon[])
{
   int TrongLuongConLai = TrongLuongBalo;
   while (TrongLuongConLai > 0)
   {
      int i = LanChon[TrongLuongConLai];
      SoLanChon[i]++;
      TrongLuongConLai -= Arr[i].TrongLuong;
   }
}

void HienThiKetQua(DoVat Arr[], int SoMonDo, int TrongLuongBalo, int GiaTriLonNhat[], int SoLanChon[])
{
   int TongGiaTri = GiaTriLonNhat[TrongLuongBalo];
   int TongTrongLuong = 0;
   for (int i = 0; i < SoMonDo; i++)
   {
      TongTrongLuong += SoLanChon[i] * Arr[i].TrongLuong;
   }
   cout << "Gia tri lon nhat cua balo la: " << TongGiaTri << endl;
   cout << "Trong luong con lai cua balo la: " << TrongLuongBalo - TongTrongLuong << endl;
   cout << "Cac mon do da chon: " << endl;
   for (int i = 0; i < SoMonDo; i++)
   {
      if (SoLanChon[i] > 0)
      {
         cout << "Mon do " << i + 1 << " chon " << SoLanChon[i] << " lan" << endl;
      }
   }
}

int main()
{
   int SoMonDo, TrongLuongBalo;
   DoVat Arr[10000];
   NhapDuLieu(Arr, SoMonDo, TrongLuongBalo);
   int GiaTriLonNhat[TrongLuongBalo + 1];
   int LanChon[TrongLuongBalo + 1];
   int SoLanChon[SoMonDo];

   memset(GiaTriLonNhat, 0, sizeof(GiaTriLonNhat));
   memset(SoLanChon, 0, sizeof(SoLanChon));
   memset(LanChon, 0, sizeof(LanChon));

   TinhGiaTriLonNhat(Arr, SoMonDo, TrongLuongBalo, GiaTriLonNhat, LanChon);
   TruyVetMonDo(Arr, SoMonDo, TrongLuongBalo, LanChon, SoLanChon);

   HienThiKetQua(Arr, SoMonDo, TrongLuongBalo, GiaTriLonNhat, SoLanChon);

   return 0;
}
