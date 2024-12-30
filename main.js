const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const Database = require('better-sqlite3');
const path = require('path');
const axios = require('axios');
const getmac = require('getmac').default;
const os = require('os');
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

let mainWindow;


const db = new Database('epos.db');
db.prepare(`
  DROP TABLE IF EXISTS promo_diskon;
`).run();
db.prepare(`
  DROP TABLE IF EXISTS promo_hadiah;
`).run();
db.prepare(`
  DROP TABLE IF EXISTS promo_bonus;
`).run();
//===== promo diskon ===
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_diskon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promo_diskon INTEGER,
    is_nominal INTEGER,
    kode_promo_diskon TEXT,
    nama_promo_diskon TEXT,
    minimal_qty TEXT,
    diskon TEXT,
    kuota INTEGER,
    tanggal_mulai TEXT,
    tanggal_berakhi TEXT,
    gambar TEXT NULL,
    is_active INTEGER,
    is_tampil_pos INTEGER
  );
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_diskon_barang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promo_diskon INTEGER,
    id_barang INTEGER
  );
`).run();
//===== promo hadian ====
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_hadiah (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promo_hadiah INTEGER,
    kode_promo_hadiah TEXT,
    nama_promo_hadiah TEXT,
    nilai_promo_hadiah TEXT,
    is_kelipatan INTEGER,
    keterangan TEXT,
    jumlah INTEGER,
    hadiah TEXT,
    tanggal_mulai TEXT,
    tanggal_berakhir TEXT,
    gambar TEXT NULL,
    is_active INTEGER,
    is_tampil_pos INTEGER
  );
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_hadiah_barang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promo_hadiah INTEGER,
    id_barang INTEGER
  );
`).run();
//==== promo bonus ====
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_bonus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promo_bonus INTEGER,
    kode_promo_bonus TEXT,
    nama_promo_bonus TEXT,
    is_kelipatan INTEGER,
    keterangan TEXT,
    tanggal_mulai TEXT,
    tanggal_berakhir TEXT,
    gambar TEXT,
    is_active INTEGER,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TEXT,
    updated_at TEXT,
    id_barang INTEGER,
    kuota INTEGER,
    is_tampil_pos INTEGER
  )
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS promo_bonus_barang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_promo_bonus INTEGER,
    id_barang INTEGER
  );
`).run();


//===== create table version
db.prepare(
  `CREATE TABLE IF NOT EXISTS version (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version INTEGER
  )`
).run();
//===== create table kasir
db.prepare(
  `CREATE TABLE IF NOT EXISTS kasir (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    active INTEGER,
    kode TEXT,
    id_kasir INTEGER,
    printer TEXT,
    notif_barang INTEGER,
    ip_server TEXT,
    tanggal TEXT,
    last_no_transaksi INTEGER
  )`
).run();
//===== create table user
db.prepare(
  `CREATE TABLE IF NOT EXISTS kasir (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    email TEXT,
    nama TEXT,
    password TEXT,
    lokasi TEXT
  )`
).run();
//===== create table login
db.prepare(
  `CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    email TEXT,
    nama TEXT,
    password TEXT,
    token TEXT
  )`
).run();
//===== info toko
db.prepare(
  `CREATE TABLE IF NOT EXISTS toko (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_lokasi INTEGER,
    kode_lokasi TEXT,
    nama_lokasi TEXT,
    alamat TEXT,
    telepon TEXT,
    npwp TEXT,
    server TEXT
  )`
).run();
//===== create table barang
db.prepare(
  `CREATE TABLE IF NOT EXISTS barang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idBarang INTEGER,
    kodeBarang TEXT,
    barcode TEXT,
    namaBarang TEXT,
    kodeSatuanKecil TEXT,
    hargaJual INTEGER,
    jumlahGrosir1 INTEGER,
    hargaGrosir1 INTEGER,
    jumlahGrosir2 INTEGER,
    hargaGrosir2 INTEGER,
    diskon INTEGER,
    diskonSyaratMinBelanja INTEGER,
    setPromoHadiahID INTEGER,
    minimalNominal INTEGER,
    isBerlakuKelipatan INTEGER,
    jumlahHadiah INTEGER,
    hadiah TEXT,
    qtyOnHand INTEGER
  )`
).run();
//==== minimal
db.prepare(`
  CREATE TABLE IF NOT EXISTS minimal (
    minimalGesekID INTEGER,
    jenisKartu TEXT,
    salesPaymentMethodID INTEGER,
    minimalGesek INTEGER
  )
`).run();
//==== create table edc
db.prepare(`
  CREATE TABLE IF NOT EXISTS edc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idEdc INTEGER,
    kodeEdc TEXT,
    namaEdc TEXT,
    keterangan TEXT
  )
`).run();
//==== create table bank
db.prepare(`
  CREATE TABLE IF NOT EXISTS bank (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idBank INTEGER,
    keterangan TEXT,
    kodeBank TEXT,
    namaBank TEXT,
    biaya TEXT,
    debit INTEGER,
    kredit INTEGER
  )
`).run();
//==== create table customer
db.prepare(`
  CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idCustomer INTEGER,
    kodeCustomer TEXT,
    namaCustomer TEXT,
    alamatCustomer TEXT,
    kota TEXT,
    kecamatan TEXT,
    kelurahan TEXT,
    pekerjaan TEXT,
    no_handphone TEXT,
    email TEXT,
    jenis_identitas TEXT,
    nomor_identitas TEXT,
    kelipatanDapatPoint INTEGER,
    jumlahPoint INTEGER,
    tipeCustomer TEXT
  )
`).run();
//==== create username
db.prepare(`
  CREATE TABLE IF NOT EXISTS username (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    nama TEXT,
    email TEXT,
    password_kasir TEXT,
    id_group INTEGER,
    id_level INTEGER,
    lokasi TEXT
  )
`).run();
//==== tmp
db.prepare(`
  CREATE TABLE IF NOT EXISTS tmp (
    id INTEGER,
    kode TEXT,
    name TEXT,
    harga INTEGER,
    diskon_awal INTEGER,
    d1 INTEGER,
    diskon INTEGER,
    d2 INTEGER,
    satuan TEXT,
    qty INTEGER,
    old_qty INTEGER,
    total INTEGER,
    hargaJual INTEGER,
    jumlahGrosir1 INTEGER,
    jumlahGrosir2 INTEGER,
    hargaGrosir1 INTEGER,
    hargaGrosir2 INTEGER,
    setPromoHadiahID INTEGER,
    minimalNominal INTEGER,
    isBerlakuKelipatan INTEGER,
    jumlahHadiah INTEGER,
    hadiah TEXT,
    diskonSyaratMinBelanja INTEGER,
    isDiskonNominal INTEGER
  )
  `).run();
//==== header hold
db.prepare(`
  CREATE TABLE IF NOT EXISTS hold (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer INTEGER,
    diskon TEXT,
    kirim INTEGER,
    FakturPenjualan TEXT,
    qty INTEGER,
    jumlah INTEGER,
    total INTEGER
  )
`).run();
//==== detail hold
db.prepare(`
  CREATE TABLE IF NOT EXISTS hold_detail (
    id_hold INTEGER, 
    id INTEGER,
    kode TEXT,
    name TEXT,
    harga INTEGER,
    diskon_awal INTEGER,
    d1 INTEGER,
    diskon INTEGER,
    d2 INTEGER,
    satuan TEXT,
    qty INTEGER,
    old_qty INTEGER,
    total INTEGER,
    hargaJual INTEGER,
    jumlahGrosir1 INTEGER,
    jumlahGrosir2 INTEGER,
    hargaGrosir1 INTEGER,
    hargaGrosir2 INTEGER,
    setPromoHadiahID INTEGER,
    minimalNominal INTEGER,
    isBerlakuKelipatan INTEGER,
    jumlahHadiah INTEGER,
    hadiah TEXT,
    diskonSyaratMinBelanja INTEGER,
    isDiskonNominal INTEGER
  )
`).run();
//==== transaksi
db.prepare(`
  CREATE TABLE IF NOT EXISTS transaksi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    FakturPenjualan TEXT,
    RefFaktur TEXT,
    JumlahItem INTEGER,
    TotalDiskonDalam INTEGER,
    TotalTransaksi INTEGER,
    DiskonLuarNilai INTEGER,
    DiskonLuarPersen INTEGER,
    OngkosKirim INTEGER,
    Pembulatan INTEGER,
    TotalTransaksi2 INTEGER,
    TotalBayar INTEGER,
    Kembali INTEGER,
    BiayaBank INTEGER,
    IsUsingVoucher TEXT,
    UserEntry INTEGER,
    IdPosKasir INTEGER,
    TransPenjualanDet TEXT,
    TransPenjualanDetPayment TEXT,
    promoHadiah TEXT,
    waktu TEXT,
    kirim TEXT DEFAULT 0,
    kirim_code INTEGER,
    kirim_response TEXT,
    IdCustomer INTEGER,
    id_penjualan INTEGER
  )
`).run();
//==== create table payment method
db.prepare(`
  CREATE TABLE IF NOT EXISTS payment_method (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_payment_method INTEGER,
    nama_payment_method TEXT,
    keterangan TEXT
  )
`).run();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Make sure this is set to true
    },
    webSecurity: false,
  });
  mainWindow.loadURL('file://' + __dirname + '/login.html');
  // mainWindow.loadURL('file://' + __dirname + '/history.html');
  // mainWindow.loadURL('file://' + __dirname + '/refund.html');
  // mainWindow.loadURL('file://' + __dirname + '/nota_refund.html?id=9');
  
  // mainWindow.loadURL('file://' + __dirname + '/index.html');
  // mainWindow.loadURL('file://' + __dirname + '/nota.html?id=172&print=0');
  // mainWindow.loadURL('file://' + __dirname + '/tutupkasir.html');
  // mainWindow.webContents.openDevTools();
}

const date_now = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() dimulai dari 0
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}`;
}

const tanggal_now = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() dimulai dari 0
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const waktu_now = () => {
  let date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const prefix = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() dimulai dari 0
  return `${year}${month}`;
}

const mappingPayment = (paymnet) =>{
  let id_payment_method = 0 ;
  if(paymnet.SalesPaymentMethodID==6){
    id_payment_method = 5
  }
  if(paymnet.SalesPaymentMethodID==1){
    id_payment_method = 1
  }
  if(paymnet.SalesPaymentMethodID==4){
    id_payment_method = 3
  }
  if(paymnet.SalesPaymentMethodID==5){
    id_payment_method = 4
  }
  if(paymnet.SalesPaymentMethodID==3){
    id_payment_method = 6
  }
  if(paymnet.SalesPaymentMethodID==0){
    id_payment_method = 7
  }
  if(paymnet.SalesPaymentMethodID==2){
    id_payment_method = 8
  }
  return id_payment_method;
}

const mappingToSend = (param)=>{
  let tanggal = param.waktu.split(' ')[0];
  let data_detail = [];
  let details = JSON.parse(param.TransPenjualanDet);
  for(const detail of details){
    data_detail.push({
      urut        :detail.NoUrut,
      id_barang   :detail.IdBarang,
      qty_jual    :detail.QtyJual,
      kode_satuan :detail.KodeSatuan,
      harga_jual  :detail.HargaJual,
      diskon1     :(detail.Diskon1)?detail.Diskon1:0,
      diskon2     :(detail.Diskon2)?detail.Diskon2:0,
      sub_total   :detail.SubTotal,
      display_diskon1 :(detail.DisplayDiskon1)?detail.DisplayDiskon1:0,
      display_diskon2 :(detail.DisplayDiskon2)?detail.DisplayDiskon2:0,
      diskon_promo    :null
    });
  }

  let paymnets = JSON.parse(param.TransPenjualanDetPayment);
  let data_payment = [];
  for(const payment of paymnets){
    data_payment.push({
      urut            :payment.NoUrut,
      jenis_pembayar  :payment.jenisPembayaran,
      jumlah_bayar    :payment.JumlahBayar,
      keterangan      :payment.Keterangan,
      id_voucher      :payment.IdVoucher,
      id_payment_method:mappingPayment(payment),
      id_bank         :payment.IdBank,
      id_edc          :payment.IdEdc,
      trace_number    :payment.TraceNumber,
      jenis_kartu     :payment.JenisKartu,
      card_holder     :payment.CardHolder,
      tanggal_jatuh_tempo_piutang:payment.TglJatuhTempoOther,
      keterangan_piutang :payment.KeteranganOther
    });
  }
  let data = {
    id_user_kasir     :param.UserEntry,
    no_faktur         :param.FakturPenjualan,
    tanggal_penjualan :tanggal,
    id_member         :param.IdCustomer,
    total_diskon_dalam:param.TotalDiskonDalam,
    total_transaksi   :param.TotalTransaksi,
    diskon_luar_persen:param.DiskonLuarPersen,
    diskon_luar_nominal:param.DiskonLuarNilai,
    ongkos_kirim      :param.OngkosKirim,
    pembulatan        :param.Pembulatan,
    total_transaksi2  :param.TotalTransaksi2,
    total_bayar       :param.TotalBayar,
    kembali           :param.Kembali,
    biaya_bank        :param.BiayaBank,
    is_using_voucher  :(param.IsUsingVoucher)?param.IsUsingVoucher:false,
    id_pos_kasir      :param.IdPosKasir,
    id_tutup_kasir    :null,
    created_by        :param.UserEntry,
    updated_by        :param.UserEntry,
    bonus_item        :[],
    hadiah            :[],
    detail : data_detail,
    payment : data_payment
  };
  return data;
}

// Menu 
const createMenuLogin = () => {
  const MenuLogin = [
    {
      label: 'File',
      submenu: [
        { label: 'Login', click: () => { mainWindow.loadURL('file://' + __dirname + '/login.html'); } },
        { label: 'Setting Kasir', click: () => { mainWindow.loadURL('file://' + __dirname + '/setting.html'); } },
        { type: 'separator' },  // Optional separator for better UX
        {
          label: 'Exit',
          click: () => { app.quit(); }  // Exits the app
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Back',
          click: () => {
            if (mainWindow.webContents.canGoBack()) { // Check if there is a page to go back to
              mainWindow.webContents.goBack(); // Go back to the previous page
            }
          }
        },
        {
          label: 'Forward',
          click: () => {
            if (mainWindow.webContents.canGoForward()) { // Check if there is a page to go forward to
              mainWindow.webContents.goForward(); // Go forward to the next page
            }
          }
        },
        { type: 'separator' }, // Optional separator
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R', // Shortcut for reload
          click: () => {
            mainWindow.webContents.reload(); // Reload the current page
          }
        },
        {
          label: 'Reload (Force)',
          accelerator: 'CmdOrCtrl+Shift+R', // Shortcut for force reload
          click: () => {
            mainWindow.webContents.reloadIgnoringCache(); // Force reload the page, ignoring cache
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus', // Shortcut for zoom in
          click: () => {
            zoomLevel += 1; // Increase zoom level
            mainWindow.webContents.setZoomLevel(zoomLevel); // Set new zoom level
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-', // Shortcut for zoom out
          click: () => {
            zoomLevel -= 1; // Decrease zoom level
            mainWindow.webContents.setZoomLevel(zoomLevel); // Set new zoom level
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0', // Shortcut for resetting zoom
          click: () => {
            zoomLevel = 0; // Reset zoom level
            mainWindow.webContents.setZoomLevel(zoomLevel); // Reset to default zoom
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I', // Shortcut to toggle DevTools
          click: () => {
            mainWindow.webContents.toggleDevTools(); // Toggle Developer Tools
          }
        }
      ]
    },
  ];
  const menu = Menu.buildFromTemplate(MenuLogin);
  Menu.setApplicationMenu(menu);
}

const createMenuPOS = () => {
  const MenuLogin = [
    {
      label: 'File',
      submenu: [
        { label: 'Penjualan EPOS', click: () => { mainWindow.loadURL('file://' + __dirname + '/index.html'); } },
        { label: 'History Penjualan', click: () => { mainWindow.loadURL('file://' + __dirname + '/history.html'); } },
        { label: 'Refund', click: () => { mainWindow.loadURL('file://' + __dirname + '/refund.html'); } },
        { label: 'Tutup Kasir', click: () => { mainWindow.loadURL('file://' + __dirname + '/tutupkasir.html'); } },
        { label: 'Logout', click: () => { mainWindow.loadURL('file://' + __dirname + '/login.html'); } },
        { type: 'separator' },  // Optional separator for better UX
        {
          label: 'Exit',
          click: () => { app.quit(); }  // Exits the app
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Back',
          click: () => {
            if (mainWindow.webContents.canGoBack()) { // Check if there is a page to go back to
              mainWindow.webContents.goBack(); // Go back to the previous page
            }
          }
        },
        {
          label: 'Forward',
          click: () => {
            if (mainWindow.webContents.canGoForward()) { // Check if there is a page to go forward to
              mainWindow.webContents.goForward(); // Go forward to the next page
            }
          }
        },
        { type: 'separator' }, // Optional separator
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R', // Shortcut for reload
          click: () => {
            mainWindow.webContents.reload(); // Reload the current page
          }
        },
        {
          label: 'Reload (Force)',
          accelerator: 'CmdOrCtrl+Shift+R', // Shortcut for force reload
          click: () => {
            mainWindow.webContents.reloadIgnoringCache(); // Force reload the page, ignoring cache
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus', // Shortcut for zoom in
          click: () => {
            zoomLevel += 1; // Increase zoom level
            mainWindow.webContents.setZoomLevel(zoomLevel); // Set new zoom level
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-', // Shortcut for zoom out
          click: () => {
            zoomLevel -= 1; // Decrease zoom level
            mainWindow.webContents.setZoomLevel(zoomLevel); // Set new zoom level
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0', // Shortcut for resetting zoom
          click: () => {
            zoomLevel = 0; // Reset zoom level
            mainWindow.webContents.setZoomLevel(zoomLevel); // Reset to default zoom
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I', // Shortcut to toggle DevTools
          click: () => {
            mainWindow.webContents.toggleDevTools(); // Toggle Developer Tools
          }
        }
      ]
    },
  ];
  const menu = Menu.buildFromTemplate(MenuLogin);
  Menu.setApplicationMenu(menu);
}

// When Electron has finished initializing, create the window.
app.whenReady().then(() => {
  createWindow();

  //=== setting kasir
  ipcMain.handle('get-kasir', async (event, param) => {
    try {
      kasir = db.prepare(`select * from kasir`);
      const data = kasir.all();
      if (data.length == 0) {
        return { success: false, message: 'kasir belum di setting' };
      } else {
        return { success: true, message: 'ok', data: data[0] };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error };
    }
  });

  ipcMain.handle('update-kasir', async (event, param) => {
    try {
      console.log('payload', param);
      const get_kasir = db.prepare(`SELECT * FROM kasir`);
      const kasir = get_kasir.all();
      if (kasir.length == 0) {
        data = db.prepare(`INSERT INTO kasir (id_kasir,printer,ip_server) VALUES (?,?,?)`);
        data.run(param.id_kasir, param.printer, param.ip_server);
      } else {
        data = db.prepare(`UPDATE kasir SET id_kasir=?,printer=?,ip_server=?`);
        data.run(param.id_kasir, param.printer, param.ip_server);
      }
      return { success: true, message: 'ok' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error };
    }
  });

  //==== Login 
  ipcMain.handle('cek-online', async () => {
    try {
      kasir = db.prepare(`select * from kasir`);
      const data = kasir.all();
      if (data.length == 0) {
        return { success: false, message: 'kasir belum di setting' };
      }
      const health = await axios.get(data[0].ip_server + '/api/health');
      return { success: true, message: 'ok' };
    } catch (error) {
      // console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('get_list_kasir', async () => {
    try {
      kasir = db.prepare(`select * from kasir`);
      const data = kasir.all();
      if (data.length == 0) {
        return { success: false, message: 'kasir belum di setting' };
      }
      const response = await axios.get(data[0].ip_server + '/api/list/kasir');
      console.log(response);
      const insert = db.prepare(`
        INSERT INTO username (id_user,nama,email,password_kasir,id_group,id_level,lokasi)
        VALUES 
        (?,?,?,?,?,?,?)
      `);
      const insertMany = db.transaction((usernames) => {
        db.exec(`DELETE FROM username`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='username'`);
        for (const user of usernames) {
          insert.run(user.id_user, user.nama, user.email, user.password_kasir, user.id_group, user.id_level, JSON.stringify(user.lokasi));
        }
      });
      insertMany(response.data.data);
      return { success: true, message: 'ok' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('login', async (event, param) => {
    try {
      kasir = db.prepare(`select * from username where email=? and password_kasir=?`);
      const data = kasir.all(param.username, param.password);
      if (data.length == 0) {
        return { success: false, message: 'email dan password tidak di temukan' }
      }
      db.exec(`DELETE FROM login`);
      db.exec(`DELETE FROM sqlite_sequence WHERE name='login'`);
      db.exec(`DELETE FROM toko`);
      db.exec(`DELETE FROM sqlite_sequence WHERE name='toko'`);
      const insert = db.prepare(`INSERT INTO login(id_user,email,nama,password) VALUES (?,?,?,?)`);
      insert.run(data[0].id_user, data[0].email, data[0].nama, data[0].password_kasir);
      const toko = db.prepare(`
        INSERT INTO toko (id_lokasi,kode_lokasi,nama_lokasi,alamat,telepon,npwp,server) VALUES 
        (?,?,?,?,?,?,?)`);
      let lokasi = JSON.parse(data[0].lokasi);
      console.log('lokasi', lokasi);
      toko.run(lokasi.id_lokasi, lokasi.kode_lokasi, lokasi.nama_lokasi, lokasi.alamat, lokasi.telepon, lokasi.npwp, lokasi.server);
      return { success: true, message: 'ok' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('update-data', async () => {
    try {
      const kasir = db.prepare(`SELECT * FROM kasir`).all();
      if (kasir.length == 0) {
        return { success: false, message: 'kasir belum di setting' };
      }
      const login = await axios.post(kasir[0].ip_server + '/api/login', {
        'email': 'admin@gmail.com',
        'password': '123'
      });
      const barang = await axios.get(kasir[0].ip_server + '/api/getbarangpos', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const edc = await axios.get(kasir[0].ip_server + '/api/edc', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const bank = await axios.get(kasir[0].ip_server + '/api/bank', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const minimal = await axios.get(kasir[0].ip_server + '/api/penjualan/minimal', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const customer = await axios.get(kasir[0].ip_server + '/api/member', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const payment_method = await axios.get(kasir[0].ip_server + '/api/paymentMethod', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const version_barang = await axios.get(kasir[0].ip_server + '/api/version_barang', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });

      const promo_diskon = await axios.get(kasir[0].ip_server + '/api/pos_promo_diskon', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const promo_hadiah = await axios.get(kasir[0].ip_server + '/api/pos_promo_hadiah', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const promo_bonus = await axios.get(kasir[0].ip_server + '/api/pos_promo_bonus', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      const insertMany = db.transaction((barang, edc, bank, minimal, customer, payment_method,version_barang,promo_diskon,promo_hadiah,promo_bonus) => {
        db.exec(`DELETE FROM barang`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='barang'`);
        db.exec(`DELETE FROM bank`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='bank'`);
        db.exec(`DELETE FROM edc`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='edc'`);
        db.exec(`DELETE FROM minimal`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='minimal'`);
        db.exec(`DELETE FROM customer`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='customer'`);
        db.exec(`DELETE FROM payment_method`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='payment_method'`);
        db.exec(`DELETE FROM version`);
        db.exec(`DELETE FROM promo_diskon`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='promo_diskon'`);
        db.exec(`DELETE FROM promo_diskon_barang`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='promo_diskon_barang'`);
        db.exec(`DELETE FROM promo_hadiah`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='promo_hadiah'`);
        db.exec(`DELETE FROM promo_hadiah_barang`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='promo_hadiah_barang'`);
        db.exec(`DELETE FROM promo_bonus`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='promo_bonus'`);
        db.exec(`DELETE FROM promo_bonus_barang`);
        db.exec(`DELETE FROM sqlite_sequence WHERE name='promo_bonus_barang'`);

        const in_barang = db.prepare(`INSERT INTO barang 
        (
        idBarang,kodeBarang,barcode,namaBarang,kodeSatuanKecil,hargaJual,
        jumlahGrosir1,hargaGrosir1,jumlahGrosir2,hargaGrosir2,
        diskon,diskonSyaratMinBelanja,setPromoHadiahID,minimalNominal,isBerlakuKelipatan,jumlahHadiah,
        hadiah,qtyOnHand)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
        const in_bank = db.prepare(`INSERT INTO bank (idBank,keterangan,kodeBank,namaBank,biaya,debit,kredit) VALUES (?,?,?,?,?,?,?)`);
        const in_edc = db.prepare(`INSERT INTO edc (idEdc,kodeEdc,namaEdc,keterangan) VALUES (?,?,?,?)`);
        const in_minimal = db.prepare(`INSERT INTO minimal (minimalGesekID,jenisKartu,salesPaymentMethodID,minimalGesek) VALUES (?,?,?,?)`);
        const in_customer = db.prepare(`
          INSERT INTO customer (idCustomer,kodeCustomer,namaCustomer,alamatCustomer,kota,kecamatan,kelurahan,pekerjaan,
          no_handphone,email,jenis_identitas,nomor_identitas,kelipatanDapatPoint,jumlahPoint,tipeCustomer) VALUES 
          (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `);
        const in_payment_method = db.prepare(`INSERT INTO payment_method (id_payment_method,nama_payment_method,keterangan) VALUES (?,?,?)`);
        const in_version = db.prepare(`INSERT INTO version (version) VALUES (?)`);
        const in_promo_diskon = db.prepare(`INSERT INTO promo_diskon(id_promo_diskon,is_nominal,kode_promo_diskon,nama_promo_diskon,minimal_qty,diskon,kuota,gambar,is_tampil_pos)VALUES (?,?,?,?,?,?,?,?,?)`);
        const in_promo_diskon_barang = db.prepare(`INSERT INTO promo_diskon_barang (id_promo_diskon,id_barang) VALUES (?,?)`);
        const in_promo_hadiah = db.prepare(`INSERT INTO promo_hadiah (id_promo_hadiah,kode_promo_hadiah,nama_promo_hadiah,nilai_promo_hadiah,is_kelipatan,keterangan,jumlah,hadiah,gambar,is_tampil_pos) VALUES (?,?,?,?,?,?,?,?,?,?)`);
        const in_promo_hadiah_barang = db.prepare(`INSERT INTO promo_hadiah_barang (id_promo_hadiah,id_barang) VALUES (?,?)`);
        const in_promo_bonus = db.prepare(`INSERT INTO promo_bonus (id_promo_bonus,kode_promo_bonus,nama_promo_bonus,is_kelipatan,keterangan,gambar,is_tampil_pos) VALUES (?,?,?,?,?,?,?)`);
        const in_promo_bonus_barang = db.prepare(`INSERT INTO promo_bonus_barang (id_promo_bonus,id_barang) VALUES (?,?)`);

        for (const user of barang) {
          in_barang.run(
            user.id_barang, user.kode_barang, user.barcode, user.nama_barang, user.kode_satuan,
            parseInt(user.harga_jual), parseInt(user.qty_grosir1), parseInt(user.harga_grosir1), parseInt(user.qty_grosir2), parseInt(user.harga_grosir2),
            0, 0, 0, 0, (user.is_kelipatan_hadiah) ? 1 : 0, 0, '-', 100
          );
        }
        for (const r_edc of edc) {
          in_edc.run(r_edc.id_edc, r_edc.kode_edc, r_edc.nama_edc, r_edc.keterangan);
        }
        for (const r_bank of bank) {
          in_bank.run(r_bank.id_bank, r_bank.nama_bank, r_bank.kode_bank, r_bank.nama_bank, r_bank.biaya, 0, 0);
        }
        for (const r_minimal of minimal) {
          in_minimal.run(r_minimal.minimalGesekID, r_minimal.jenisKartu, r_minimal.salesPaymentMethodID, r_minimal.minimalGesek);
        }
        for (const cust of customer) {
          in_customer.run(cust.id_member, cust.kode_member, cust.nama_member, cust.alamat, cust.kota, cust.kecamatan, cust.kelurahan,
            cust.pekerjaan, cust.no_handphone, cust.email, cust.jenis_identitas, cust.nomor_identitas, 0, cust.jumlah_poin, 'Standard'
          )
        }
        for (const pay of payment_method){
          in_payment_method.run(pay.id_payment_method,pay.nama_payment_method,pay.keterangan);
        }
        in_version.run(version_barang.version);
        console.log(promo_diskon);
        for (const diskon of promo_diskon){
          in_promo_diskon.run(diskon.id_promo_diskon,(diskon.is_nominal) ? 1 : 0,diskon.kode_promo_diskon,diskon.nama_promo_diskon,diskon.minimal_qty,diskon.diskon,diskon.kuota,diskon.gambar,(diskon.is_tampil_pos) ? 1 : 0);
          for (const diskon_barang of diskon.barang){
            in_promo_diskon_barang.run(diskon.id_promo_diskon,diskon_barang.id_barang);
          }
        }
        for (const hadiah of promo_hadiah){
          in_promo_hadiah.run(hadiah.id_promo_hadiah,hadiah.kode_promo_hadiah,hadiah.nama_promo_hadiah,hadiah.nilai_promo_hadiah,(hadiah.is_kelipatan) ? 1 : 0,hadiah.keterangan,hadiah.jumlah,hadiah.hadiah,hadiah.gambar,(hadiah.is_tampil_pos) ? 1 : 0);
          for (const hadiah_barang of hadiah.barang){
            in_promo_hadiah_barang.run(hadiah.id_promo_hadiah,hadiah_barang.id_barang);
          }
        }
        for (const bonus of promo_bonus){
          in_promo_bonus.run(bonus.id_promo_bonus,bonus.kode_promo_bonus,bonus.nama_promo_bonus,(bonus.is_kelipatan) ? 1 : 0,bonus.keterangan,bonus.gambar,(bonus.is_tampil_pos) ? 1 : 0);
          for (const bonus_barang of bonus.barang){
            in_promo_bonus_barang.run(bonus.id_promo_bonus,bonus_barang.id_barang);
          }
        }
      });

      insertMany(
        barang.data.data,
        edc.data.data.data,
        bank.data.data.data,
        minimal.data.data,
        customer.data.data.data,
        payment_method.data.data.data,
        version_barang.data.data,
        promo_diskon.data.data,
        promo_hadiah.data.data,
        promo_bonus.data.data,
      );
      return { success: true, message: 'reload data successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error };
    }
  });

  ipcMain.handle('notif-barang', async () => {
    const kasir = db.prepare(`SELECT * FROM kasir`).all();
    if (kasir.length == 0) {
      return { success: false, message: 'kasir belum di setting' };
    }
    version_kasir =  db.prepare(`SELECT * FROM version`).get();
    const response = await axios.get(kasir[0].ip_server + '/api/version_barang', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    version_server = response.data.data
    if(version_kasir.version !=version_server.version){
      return true;
    }else{
      return false;
    }
  });

  ipcMain.handle('proses-update-barang', async () => {
    const kasir = db.prepare(`SELECT * FROM kasir`).all();
    const login = await axios.post(kasir[0].ip_server + '/api/login', {
      'email': 'admin@gmail.com',
      'password': '123'
    });
    if (kasir.length == 0) {
      return { success: false, message: 'kasir belum di setting' };
    }
    const version_barang = await axios.get(kasir[0].ip_server + '/api/version_barang', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const barang = await axios.get(kasir[0].ip_server + '/api/getbarangpos', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${login.data.data.token}`
      }
    });
    const insertMany = db.transaction((barang, version_barang)=>{
      db.exec(`DELETE FROM barang`);
      db.exec(`DELETE FROM sqlite_sequence WHERE name='barang'`);
      db.exec(`DELETE FROM version`);
      const in_barang = db.prepare(`INSERT INTO barang 
        (
        idBarang,kodeBarang,barcode,namaBarang,kodeSatuanKecil,hargaJual,
        jumlahGrosir1,hargaGrosir1,jumlahGrosir2,hargaGrosir2,
        diskon,diskonSyaratMinBelanja,setPromoHadiahID,minimalNominal,isBerlakuKelipatan,jumlahHadiah,
        hadiah,qtyOnHand)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
      const in_version = db.prepare(`INSERT INTO version (version) VALUES (?)`);
      for (const user of barang) {
        in_barang.run(
          user.id_barang, user.kode_barang, user.barcode, user.nama_barang, user.kode_satuan,
          parseInt(user.harga_jual), parseInt(user.qty_grosir1), parseInt(user.harga_grosir1), parseInt(user.qty_grosir2), parseInt(user.harga_grosir2),
          0, 0, 0, 0, (user.is_kelipatan_hadiah) ? 1 : 0, 0, '-', 100
        );
      }
      in_version.run(version_barang.version);
    })

    insertMany(
      barang.data.data,
      version_barang.data.data
    );
    return { success: true, message: 'update barang successful' };
  });

  ipcMain.handle('get-barang-by-id', async (event, param) => {
    barang = db.prepare(`select * from barang where idBarang =${param.id_barang}`);
    const data = barang.all()
    return data;
  });

  ipcMain.handle('get-barang-by-barcode', async (event, param) => {
    try {
      barang = db.prepare(`select b.*,pd.minimal_qty,pd.diskon as diskonPromo,pd.is_nominal as isDiskonNominal from barang b 
                          left join promo_diskon_barang pdb on b.idBarang=pdb.id_barang 
                          left join promo_diskon pd on pdb.id_promo_diskon=pd.id_promo_diskon 
                          where TRIM(barcode)=TRIM('${param}')`);

      const data = barang.get();
      console.log(data)
      return { success: true, data: data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error };
    }
  })

  ipcMain.handle('get-barang-by-kode', async (event, param) => {
    try {
      console.log('by kode param',param);
      barang = db.prepare(`select b.*,pd.minimal_qty,pd.diskon as diskonPromo,pd.is_nominal as isDiskonNominal from barang b 
                          left join promo_diskon_barang pdb on b.idBarang=pdb.id_barang 
                          left join promo_diskon pd on pdb.id_promo_diskon=pd.id_promo_diskon 
                          where kodeBarang ='${param.id}'`);
      const data = barang.get();
      console.log(data)
      return { success: true, data: data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error };
    }
  })

  ipcMain.handle('get-platform', async (event,param) =>{
    const platform = os.platform();
    return platform;
  });

  ipcMain.handle('get-printer', async (event, param) => {
    const platform = os.platform();
    console.log(platform);
    if (platform == 'win32') {
      printers = await mainWindow.webContents.getPrintersAsync();
      return printers;
    } else{
      printers = await mainWindow.webContents.getPrinters();
      return printers;
    }
  })

  ipcMain.handle('tesprint', async (event, param) => {

    const platform = os.platform();
    if (platform == 'win32') {
      const printers = await mainWindow.webContents.getPrintersAsync();
    } else {
      const printers = await mainWindow.webContents.getPrinters();
    }
    kasir = db.prepare(`SELECT * FROM kasir`).all();
    if (kasir.length == 0) {
      return { success: false, message: 'kasir belum di setting' };
    }

    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,  // Printer type: 'star' or 'epson'
      interface: 'usb://EPSON/TM-U220',
      characterSet: CharacterSet.SIMPLE,
      removeSpecialCharacters: false,
    });

    let isConnected = await printer.isPrinterConnected();
    console.log('status printer',isConnected);

    mainWindow.webContents.print({
      silent: true,
      deviceName: kasir[0].printer,
      copies: 1,
      marginsType: 0
    }, (success, error) => {
      if (success) {
        console.log('oke');
        printer.openCashDrawer();
        return { success: true, message: 'ok' }
      } else {
        console.log(error.message);
        return { success: false, message: error.message }
      }
    })
  });

  //============= KASIR
  ipcMain.handle('get-data-barang', async (event, param) => {
    // barang = db.prepare(`select * from barang where ${param.key} LIKE ? ORDER BY namaBarang DESC LIMIT 300`);
    barang = db.prepare(`select b.*,pd.minimal_qty,pd.diskon as diskonPromo,pd.is_nominal as isDiskonNominal from barang b 
                          left join promo_diskon_barang pdb on b.idBarang=pdb.id_barang 
                          left join promo_diskon pd on pdb.id_promo_diskon=pd.id_promo_diskon
                          where ${param.key} LIKE ? ORDER BY b.namaBarang DESC LIMIT 300`)
    const data = barang.all(`%${param.cari}%`)
    return data;
  })

  ipcMain.handle('get-data-member', async (event, param) => {
    console.log(param);
    member = db.prepare(`select * from customer where ${param.key} LIKE ? ORDER BY namaCustomer DESC LIMIT 300`);
    const data = member.all(`%${param.cari}%`)
    return data;
  })

  ipcMain.handle('pengawas-kasir', async (event, param) => {
    try {
      console.log(param);
      member = db.prepare(`select * from username where email=? and password=? and id_group=2`);
      const data = member.all(param.username, param.password);
      if (data.length == 0) {
        return { succsess: true, message: 'username dan password salah' };
      }
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: true, message: error.message };
    }

  })

  ipcMain.handle('insert-tmp', async (event, param) => {
    try {
      console.log(param);
      tmp = db.prepare(`
      INSERT INTO tmp (id,kode,name,harga,diskon_awal,d1,diskon,d2,satuan,qty,old_qty,total,hargaJual,jumlahGrosir1,jumlahGrosir2,hargaGrosir1,hargaGrosir2,setPromoHadiahID,minimalNominal,isBerlakuKelipatan,jumlahHadiah,hadiah,diskonSyaratMinBelanja,isDiskonNominal)
      VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
      `);
      const data = tmp.run(param.id, param.kode, param.name, param.harga, param.diskon_awal, param.d1, param.diskon, param.d2, param.satuan, param.qty, param.old_qty, param.total, param.hargaJual, param.jumlahGrosir1, param.jumlahGrosir2, param.hargaGrosir1, param.hargaGrosir2, param.setPromoHadiahID, param.minimalNominal, param.isBerlakuKelipatan, param.jumlahHadiah, param.hadiah, param.diskonSyaratMinBelanja, param.isDiskonNominal);
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  })

  ipcMain.handle('edit-tmp', (event, param) => {
    try {
      console.log(param);
      tmp = db.prepare(`
      UPDATE tmp SET kode=?,name=?,harga=?,diskon_awal=?,d1=?,diskon=?,d2=?,satuan=?,qty=?,old_qty=?,total=?,hargaJual=?,
      jumlahGrosir1=?,jumlahGrosir2=?,hargaGrosir1=?,hargaGrosir2=?,setPromoHadiahID=?,minimalNominal=?,isBerlakuKelipatan=?,
      jumlahHadiah=?,hadiah=?,diskonSyaratMinBelanja=?,isDiskonNominal=?
      WHERE id=?
      `);
      const data = tmp.run(param.kode, param.name, param.harga, param.diskon_awal, param.d1, param.diskon, param.d2, param.satuan, param.qty, param.old_qty, param.total, param.hargaJual, param.jumlahGrosir1, param.jumlahGrosir2, param.hargaGrosir1, param.hargaGrosir2, param.setPromoHadiahID, param.minimalNominal, param.isBerlakuKelipatan, param.jumlahHadiah, param.hadiah, param.diskonSyaratMinBelanja, param.isDiskonNominal, param.id);
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  });

  ipcMain.handle('delete-tmp', (event, param) => {
    try {
      console.log(param);
      tmp = db.prepare(`
        DELETE FROM tmp WHERE id=?
      `);
      const data = tmp.run(param.id);
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  });

  ipcMain.handle('delete-all-tmp', (event, param) => {
    try {
      db.exec(`DELETE FROM tmp`);
      db.exec(`DELETE FROM sqlite_sequence WHERE name='tmp'`);
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  });

  ipcMain.handle('get-tmp', (event, param) => {
    try {
      console.log(param);
      tmp = db.prepare(`SELECT * FROM tmp`);
      const data = tmp.all();
      return { succsess: true, data: data, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  })

  //= HOLD =
  ipcMain.handle('insert-hold', (event, param) => {
    try {
      console.log(param);
      hold = db.prepare(`
        INSERT INTO hold (customer,diskon,kirim,FakturPenjualan,qty,jumlah,total)
        VALUES
        (?,?,?,?,?,?,?);
      `);
      hold_detail = db.prepare(`
        INSERT INTO hold_detail (id_hold,id,kode,name,harga,diskon_awal,d1,diskon,d2,satuan,qty,old_qty,total,hargaJual,jumlahGrosir1,jumlahGrosir2,hargaGrosir1,hargaGrosir2,setPromoHadiahID,minimalNominal,isBerlakuKelipatan,jumlahHadiah,hadiah,diskonSyaratMinBelanja,isDiskonNominal)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
      `);
      let customer = JSON.stringify(param.customer);
      const transaction = db.transaction((param) => {
        const info_hold = hold.run(customer, param.diskon, param.kirim, '-', param.qty, param.JumlahItem, param.TotalTransaksi2);
        console.log('info_hold', info_hold);
        let id = info_hold.lastInsertRowid;
        for (const detail of param.detail) {
          hold_detail.run(id, detail.id, detail.kode, detail.name, detail.harga,
            detail.diskon_awal, detail.d1, detail.diskon, detail.d2, detail.satuan, detail.qty,
            detail.old_qty, detail.total, detail.hargaJual, detail.jumlahGrosir1, detail.jumlahGrosir2,
            detail.hargaGrosir1, detail.hargaGrosir2, detail.setPromoHadiahID, detail.minimalNominal,
            detail.isBerlakuKelipatan, detail.jumlahHadiah, detail.hadiah, detail.diskonSyaratMinBelanja,
            detail.isDiskonNominal);
        }
      });
      transaction(param);
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  })

  ipcMain.handle('get-hold', () => {
    try {
      hold = db.prepare(`
        SELECT * FROM hold 
      `);
      let data_hold = hold.all();
      for (const [i, row] of data_hold.entries()) {
        hold_detail = db.prepare(`
          SELECT * FROM hold_detail WHERE id_hold=?
        `);
        let data_hold_detail = hold_detail.all(row.id);
        data_hold[i].detail = data_hold_detail;
        data_hold[i].customer = JSON.parse(row.customer);
      }
      console.log(data_hold);
      return { succsess: true, data: data_hold, message: 'ok' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  })

  ipcMain.handle('delete-hold', (event, param) => {
    try {
      console.log(param);
      del_hold = db.prepare(`
        DELETE FROM hold WHERE id=?
      `);
      del_hold.run(param.id);
      del_hold_detail = db.prepare(`
        DELETE FROM hold_detail WHERE id_hold=?
      `);
      del_hold_detail.run(param.id);
      return { succsess: true, message: 'oke' };
    } catch (error) {
      return { succsess: false, message: error.message };
    }
  })

  //=== payment
  ipcMain.handle('get-master', async () => {
    const kasir = db.prepare(`select * from login`).get();
    const edc = db.prepare(`select * from edc`).all();
    const bank = db.prepare(`select * from bank`).all();
    const minimal = db.prepare(`select * from minimal`).all();
    return { edc: edc, bank: bank, minimal: minimal,kasir:kasir };
  })


  ipcMain.handle('nomor',async()=>{
    try {
        login = db.prepare(`SELECT * FROM login`).get();
        if(!login){
          return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
        }
        kasir = db.prepare(`SELECT * FROM kasir`).all();
        if (kasir.length==0) {
          return { success: false, message: 'kasir belum di setting' };
        }
        toko = db.prepare(`SELECT * FROM toko`).all();
        let tanggal = date_now();
        let counter = 1;
        if(kasir[0].tanggal){ //tanggal tidak null
          if (tanggal == kasir[0].tanggal) { //beda tanggal
            if(kasir[0].last_no_transaksi){
              counter = kasir[0].last_no_transaksi + 1;
            }else{
              counter = 1;
            }
          }
        }else{
          counter = 1;
        }
        let c = counter.toString().padStart(5, '0');
        let depan = prefix();
        let noFakturPenjualan = `${toko[0].kode_lokasi}.${kasir[0].id_kasir}.EPOS.${depan}${c}`;
        return {success:true,data:noFakturPenjualan}      
    } catch (error) {
        return {success:false,message:error.message}
    }
  })

  ipcMain.handle('simpan-transaksi', async (event, param) => {
    try {
      console.log(param);
      const transaction = db.transaction((param) => {
        login = db.prepare(`SELECT * FROM login`).get();
        if(!login){
          return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
        }
        kasir = db.prepare(`SELECT * FROM kasir`).all();
        if (kasir.length==0) {
          return { success: false, message: 'kasir belum di setting' };
        }
        toko = db.prepare(`SELECT * FROM toko`).all();
        let tanggal = date_now();
        let counter = 1;
        if(kasir[0].tanggal){ //tanggal tidak null
          if (tanggal == kasir[0].tanggal) { //beda tanggal
            if(kasir[0].last_no_transaksi){
              counter = kasir[0].last_no_transaksi + 1;
            }else{
              counter = 1;
            }
          }
        }else{
          counter = 1;
        }
        let c = counter.toString().padStart(5, '0');
        let depan = prefix();
        let noFakturPenjualan = `${toko[0].kode_lokasi}.${kasir[0].id_kasir}.EPOS.${depan}${c}`;
        transaksi = db.prepare(`
          INSERT INTO transaksi (FakturPenjualan,RefFaktur,JumlahItem,TotalDiskonDalam,TotalTransaksi,DiskonLuarNilai,DiskonLuarPersen,OngkosKirim,Pembulatan,TotalTransaksi2,TotalBayar,Kembali,BiayaBank,IsUsingVoucher,UserEntry,IdPosKasir,TransPenjualanDet,TransPenjualanDetPayment,promoHadiah,waktu,IdCustomer)
          VALUES
          (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          `);
        let waktu = waktu_now();
        const hasil = transaksi.run(noFakturPenjualan, param.RefFaktur, param.JumlahItem, param.TotalDiskonDalam, param.TotalTransaksi, param.DiskonLuarNilai, param.DiskonLuarPersen, param.OngkosKirim, param.Pembulatan, param.TotalTransaksi2, param.TotalBayar, param.Kembali, param.BiayaBank, param.IsUsingVoucher, login.id_user, kasir[0].id_kasir, JSON.stringify(param.TransPenjualanDet), JSON.stringify(param.TransPenjualanDetPayment), JSON.stringify(param.promoHadiah), waktu,param.IdCustomer);
        const update_last_no = db.prepare(`UPDATE kasir SET last_no_transaksi=?,tanggal=?`).run(counter, tanggal);
        console.log(hasil)
        return hasil.lastInsertRowid;
      });
      const id = transaction(param);
      // const trans = db.prepare(`SELECT * FROM transaksi where id=?`).run(id);
      // console.log('transaksi',trans);
      return { succsess: true, message: 'oke', data: id };
    } catch (error) {
      console.log('error log', error);
      return { succsess: false, message: error.message };
    }
  });

  ipcMain.handle('print-ulang', async () => {
    try {
      let data = db.prepare(`SELECT * FROM transaksi ORDER BY id DESC`).get();
      data.TransPenjualanDet = JSON.parse(data.TransPenjualanDet);
      data.TransPenjualanDetPayment = JSON.parse(data.TransPenjualanDetPayment);
      data.promoHadiah = JSON.parse(data.promoHadiah);
      let customer = db.prepare(`SELECT * FROM customer WHERE idCustomer = ${data.IdCustomer}`).get();
      let login = db.prepare(`SELECT * FROM login`).get();
      let toko = db.prepare(`SELECT * FROM toko`).get();
      let kasir = db.prepare(`SELECT * FROM kasir`).get();
      return {
        success: true, message: 'oke', data: {
          transaksi: data,
          login: login,
          toko: toko,
          kasir: kasir,
          customer: (customer)?customer:null
        }
      };
    } catch (error) {
      console.log('error log', error);
      return { succsess: false, message: error.message };
    }
  });

  ipcMain.handle('print-ulang-param', async (event, param) => {
    try {
      console.log('FakturPenjualan',param);
      let data = db.prepare(`SELECT * FROM transaksi WHERE FakturPenjualan=? ORDER BY id DESC`).get(param);
      console.log('Data print ulang',data);
      data.TransPenjualanDet = JSON.parse(data.TransPenjualanDet);
      data.TransPenjualanDetPayment = JSON.parse(data.TransPenjualanDetPayment);
      data.promoHadiah = JSON.parse(data.promoHadiah);
      let customer = db.prepare(`SELECT * FROM customer WHERE idCustomer = ${data.IdCustomer}`).get();
      let login = db.prepare(`SELECT * FROM username WHERE id_user=${data.UserEntry}`).get();
      let toko = db.prepare(`SELECT * FROM toko`).get();
      let kasir = db.prepare(`SELECT * FROM kasir`).get();
      return {
        success: true, message: 'oke', data: {
          transaksi: data,
          login: login,
          toko: toko,
          kasir: kasir,
          customer: (customer)?customer:null
        }
      };
    } catch (error) {
      console.log('error log', error);
      return { succsess: false, message: error.message };
    }
  });
  //======
  //====== insert penjualan POS
  ipcMain.handle('kirim-transaksi-server', async ()=>{
    try {
      let proses = [];
      const transaksi = db.prepare('SELECT * FROM transaksi where kirim=0 limit 0,1').all();
      // console.log(transaksi);
      if(transaksi.length==0){
        return {success:false,message:'kosong'}
      }
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'kesalahan login silahakan login ulang'};
      }
      for (const trans of transaksi) {
        const login = await axios.post(kasir.ip_server + '/api/login', {
          'email': 'admin@gmail.com',
          'password': '123'
        });
        let request = mappingToSend(trans);
        // console.log('request => ',request);
        kirim = await axios.post(kasir.ip_server + '/api/penjualan/insert',request, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${login.data.data.token}`
          }
        });
        if(kirim.data.success){
          update = db.prepare(`UPDATE transaksi set kirim=1,kirim_code='200',kirim_response='berhasil transfer',id_penjualan=${kirim.data.data} where id=?`).run(trans.id);
        }else{
          update = db.prepare(`UPDATE transaksi set kirim=1,kirim_code='500',kirim_response='${kirim.data.message}' where id=${trans.id} and kirim=0`).run();
        }
        // proses.push('response',kirim.data);
        // console.log('kirim => ',kirim);
      }
      return {success:true,message:'oke',data:proses}
    } catch (error) {
      console.log(error)
      return { succsess: false, message: error.message };
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });

  //====== tutupkasir
  ipcMain.handle('get-transaksi',async()=>{
    try {
      user = db.prepare(`SELECT * FROM login`).get();
      if(!user){
        return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
      }

      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'terjadi kesalahan, Belum Setting Kasir '};
      }
      
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': user.email,
        'password': user.password
      });
      
      transaksi = await axios.post(kasir.ip_server + `/api/kasir/get_transaksi`,{
        'id_kasir':kasir.id_kasir,
        'tanggal_penjualan':tanggal_now()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      console.log('response',transaksi);

      if(transaksi.data.success){
        return {success:true,message:'oke',data:transaksi.data.data}
      }else{
        return {success:false,message:transaksi.data.message}
      }
    } catch (error) {
        return {success:false,message:error.message}
    }
  })

  ipcMain.handle('get-transksi-lokal', async() => {
    try {
      history = db.prepare(`select * from transaksi where date(waktu) =?`);
      data = history.all(tanggal_now());
      return { success: true, data: data, message: 'oke' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('kirim-ulang-transaksi', (event, param) => {
    try {
      tmp = db.prepare(`update transaksi set kirim=0 where FakturPenjualan = ?`);
      const data = tmp.run(param);
      return { success: true, message: 'oke' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('kasir-belum-tutup-kasir',async()=>{
    try {
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'kesalahan login silahakan login ulang'};
      }
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': 'admin@gmail.com',
        'password': '123'
      });
      kirim = await axios.get(kasir.ip_server + '/api/kasir/kasir_belum_tutup_kasir', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      if(kirim.data.success){
        return {success:true,data:kirim.data.data,message:'oke'}
      }else{
        return {success:false,message:kirim.data.message}
      }
    } catch (error) {
        return {success:false,message:error.message}
    }
  })

  ipcMain.handle('get-modal-kasir',async()=>{
    try {
      toko = db.prepare(`SELECT * FROM toko`).get();
      if(!toko){
        return { success: false, message: 'informasi toko tidak tersedia' };
      }
      user = db.prepare(`SELECT * FROM login`).get();
      if(!user){
        return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
      }
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'terjadi kesalahan, Belum Setting Kasir '};
      }
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': 'admin@gmail.com',
        'password': '123'
      });
      kirim = await axios.get(kasir.ip_server + `/api/kasir/get_modal_kasir/${user.id_user}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      if(kirim.data.success){
        return {success:true,message:'oke',data:{
          modal_kasir : kirim.data.data,
          login : user,
          toko : toko
        }}
      }else{
        return {success:false,message:kirim.data.message}
      }
    } catch (error) {
        return {success:false,message:error.message}
    }
  })

  ipcMain.handle('get-payment-method',async()=>{
    try {
      return db.prepare('SELECT id_payment_method,nama_payment_method as payment_method FROM payment_method').all();
    } catch (error) {
      return {success:false,message:error.message}
    }
  })

  ipcMain.handle('simpan_tutup_kasir',async(event,param)=>{
    try {
      user = db.prepare(`SELECT * FROM login`).get();
      if(!user){
        return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
      }
      console.log('user',user.email,user.password);
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'terjadi kesalahan, Belum Setting Kasir '};
      }
      
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': user.email,
        'password': user.password
      });
      console.log('login',kirim);
      param.tanggal_tutup_kasir = tanggal_now();
      kirim = await axios.post(kasir.ip_server + `/api/kasir/tutup_kasir`,param, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      console.log('response',kirim);
      if(kirim.data.success){
        return {success:true,message:'oke'}
      }else{
        return {success:false,message:kirim.data.message}
      }
    } catch (error) {
      return {success:false,message:error.message}
    }
  })
  //===== refund 
  ipcMain.handle('get_penjualan_detail',async(event,param)=>{
    try {
      user = db.prepare(`SELECT * FROM login`).get();
      if(!user){
        return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
      }
      console.log('user',user.email,user.password);
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'terjadi kesalahan, Belum Setting Kasir '};
      }
      
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': user.email,
        'password': user.password
      });

      kirim = await axios.get(kasir.ip_server + `/api/penjualan/get_by_no_nota/${param}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      console.log('response',kirim);
      if(kirim.data.success){
        return {success:true,message:'oke',data:kirim.data.data}
      }else{
        return {success:false,message:kirim.data.message}
      }
    } catch (error) {
      return {success:false,message:error.message}
    }
  })

  ipcMain.handle('simpan_refund',async(event,param)=>{
    try {
      user = db.prepare(`SELECT * FROM login`).get();
      if(!user){
        return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
      }
      console.log('user',user.email,user.password);
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'terjadi kesalahan, Belum Setting Kasir '};
      }
      
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': user.email,
        'password': user.password
      });

      param.tanggal_refund = tanggal_now();
      param.id_user_kasir = user.id_user;
      console.log('payload',param);
      kirim = await axios.post(kasir.ip_server + `/api/refund/insert`,param, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      console.log('response',kirim);
      if(kirim.data.success){
        return {success:true,message:'oke',data:kirim.data.data}
      }else{
        return {success:false,message:kirim.data.message}
      }
    } catch (error) {
      return {success:false,message:error.message}
    }
  })

  ipcMain.handle('get_refund_detail',async(event,param)=>{
    try {
      user = db.prepare(`SELECT * FROM login`).get();
      if(!user){
        return { success: false, message: 'terjadi kesalahan saat login silahkan login ulang' };
      }
      console.log('user',user.email,user.password);
      const kasir = db.prepare(`SELECT * FROM kasir`).get();
      if(!kasir){
        return {success:false,message:'terjadi kesalahan, Belum Setting Kasir '};
      }
      
      const login = await axios.post(kasir.ip_server + '/api/login', {
        'email': user.email,
        'password': user.password
      });

      kirim = await axios.get(kasir.ip_server + `/api/refund/get_by_id/${param}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${login.data.data.token}`
        }
      });
      console.log('response',kirim);
      if(kirim.data.success){
        let login = db.prepare(`SELECT * FROM login`).get();
        let toko = db.prepare(`SELECT * FROM toko`).get();
        let kasir = db.prepare(`SELECT * FROM kasir`).get();
        return {success:true,message:'oke',data: {
          transaksi: kirim.data.data,
          login: login,
          toko: toko,
          kasir: kasir
        }}
      }else{
        return {success:false,message:kirim.data.message}
      }
    } catch (error) {
      return {success:false,message:error.message}
    }
  })

  //=== history
  ipcMain.handle('history', (event, param) => {
    try {
      console.log(param);
      let data = [];
      if(param.status==''){
        history = db.prepare(`select * from transaksi where date(waktu) =?`);
        data = history.all(param.tanggal);
      }else{
        history = db.prepare(`select * from transaksi where date(waktu) =? and kirim_code = ?`);
        data = history.all(param.tanggal,param.status);
      }
      return { success: true, data: data, message: 'oke' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('update-transaksi', (event, param) => {
    try {
      console.log(param);
      tmp = db.prepare(`
      update transaksi set TransPenjualanDet=? ,TransPenjualanDetPayment=?  where id = ?
      `);
      const data = tmp.run(JSON.stringify(param.TransPenjualanDet),JSON.stringify(param.TransPenjualanDetPayment),param.id);
      return { success: true, message: 'oke' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('promo', (event, param) => {
    try {
      let diskon = db.prepare(`SELECT * FROM promo_diskon`).all();
      let hadiah = db.prepare(`SELECT * FROM promo_hadiah`).all();
      let bonus = db.prepare(`SELECT * FROM promo_bonus`).all();
      return { success: true, message: 'oke',data:{
        diskon :diskon,
        hadiah :hadiah,
        bonus :bonus,
      } };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('promo-diskon-barang', (event, param) => {
    try {
      let diskon = db.prepare(`select pd.* from promo_diskon_barang pdb inner join promo_diskon pd on pdb.id_promo_diskon=pd.id_promo_diskon
      where id_barang = ${param} order by id_promo_diskon desc limit 1`).get();
      return { success: true, message: 'oke',data:diskon };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })
  
  ipcMain.handle('promo-hadiah-barang', (event, param) => {
    try {
      let diskon = db.prepare(`select pd.* from promo_hadiah_barang pdb inner join promo_hadiah pd on pdb.id_promo_hadiah=pd.id_promo_hadiah
      where pdb.id_barang = ${param} order by pd.id_promo_hadiah desc limit 1`).get();
      return { success: true, message: 'oke',data:diskon };
    } catch (error) {
      return { success: false, message: error.message };
    }
  })

})

ipcMain.on('login-page-menu', () => {
  createMenuLogin();
});

ipcMain.on('login-page-pos', () => {
  createMenuPOS();
});

ipcMain.on('app-quit', () => {
  app.quit();
});

ipcMain.on('dev-tools', () => {
  mainWindow.webContents.toggleDevTools();
});

ipcMain.on('link-setting', () => {
  mainWindow.loadURL('file://' + __dirname + '/setting.html');
});

ipcMain.on('link-login', () => {
  mainWindow.loadURL('file://' + __dirname + '/login.html');
});

ipcMain.on('link-refund', () => {
  mainWindow.loadURL('file://' + __dirname + '/refund.html');
});

ipcMain.on('link-tutupkasir', () => {
  mainWindow.loadURL('file://' + __dirname + '/tutupkasir.html');
});

ipcMain.on('link-pos', () => {
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});

// Quit the app when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});