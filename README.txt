MAHAGUNA WEIGHBRIDGE REPORT
===========================

Paket ini adalah aplikasi web PWA yang dapat dipasang di Android dan bekerja offline setelah pertama kali dimuat.

FITUR
- Data bawaan: 930 transaksi dari Data_Updatemki.xlsx
- Pilih tanggal dan shift SIANG/MALAM/SEMUA
- Ubah cuaca, nama personel, checker, perusahaan, pembuat, pemeriksa, dan keterangan
- Total bruto, tara, netto dihitung otomatis per halaman
- 20 DT per halaman (dapat diubah)
- Simpan hasil laporan menjadi JPG
- Tampilan pratinjau sebelum menyimpan

CARA MEMASANG / MENGUJI
1. Ekstrak ZIP ini.
2. Upload seluruh isi folder Mahaguna_Weighbridge_Report ke repository GitHub.
3. Aktifkan GitHub Pages dari Settings > Pages > Deploy from branch > main > /(root).
4. Buka alamat Pages dari Chrome Android.
5. Pilih menu Chrome > Install app / Tambahkan ke layar utama.

CARA MEMBUAT APK ANDROID
1. Setelah website GitHub Pages aktif, buka https://www.pwabuilder.com/
2. Masukkan alamat website Pages.
3. Pilih Android / Package for stores.
4. Ikuti proses build dan unduh paket Android yang disediakan.

CATATAN PENTING
- File ini belum berupa APK final; perlu dipublikasikan ke hosting HTTPS lalu dibungkus dengan PWABuilder.
- Data bawaan tersedia offline setelah aplikasi pertama kali dibuka dan cache selesai dibuat.
- Import Excel tambahan menggunakan SheetJS dari CDN sehingga membutuhkan internet saat pertama kali mengimpor.
- Ekspor JPG menyimpan satu halaman per file.
- Kolom berat pada laporan menggunakan satuan KG.
