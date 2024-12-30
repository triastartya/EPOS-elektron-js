const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loginPageMenu: () => ipcRenderer.send('login-page-menu'),
    loginPagePos: () => ipcRenderer.send('login-page-pos'),
    appQuit: () => ipcRenderer.send('app-quit'),
    linkSetting:()=>ipcRenderer.send('link-setting'),
    linkLogin:()=>ipcRenderer.send('link-login'),
    linkRefund:()=>ipcRenderer.send('link-refund'),
    linkTutupkasir:()=>ipcRenderer.send('link-tutupkasir'),
    linkPos:()=>ipcRenderer.send('link-pos'),
    devTools:() =>  ipcRenderer.send('dev-tools'),
    //=========
    cekOnline:() => ipcRenderer.invoke('cek-online'),
    getListKasir:()=> ipcRenderer.invoke('get_list_kasir'),
    getKasir: () => ipcRenderer.invoke('get-kasir'),
    login:(param) => ipcRenderer.invoke('login',param),
    getPrinter: (param) =>ipcRenderer.invoke('get-printer',param),
    updateKasir: (param) =>ipcRenderer.invoke('update-kasir',param),
    updateData: () => ipcRenderer.invoke('update-data'),
    getDataBarang: (param) => ipcRenderer.invoke('get-data-barang',param),
    tesPrint: (param) =>ipcRenderer.invoke('tesprint',param),
    getBarangById: (param) => ipcRenderer.invoke('get-barang-by-id',param),
    getBarangByBarcode: (param) => ipcRenderer.invoke('get-barang-by-barcode',param),
    getBarangByKode: (param) => ipcRenderer.invoke('get-barang-by-kode',param),

    //=========== kasir
    getDataMember: (param)=> ipcRenderer.invoke('get-data-member',param),
    pengawasKasir: (param)=> ipcRenderer.invoke('pengawas-kasir',param),
    insertTmp: (param) => ipcRenderer.invoke('insert-tmp',param),
    editTmp: (param) => ipcRenderer.invoke('edit-tmp',param),
    deleteTmp: (param) => ipcRenderer.invoke('delete-tmp',param),
    deleteAllTmp: (param) => ipcRenderer.invoke('delete-all-tmp',param),
    allTmp: () => ipcRenderer.invoke('get-tmp'),
    insertHold:(param) => ipcRenderer.invoke('insert-hold',param),
    allHold: () => ipcRenderer.invoke('get-hold'),
    deleteHold: (param) => ipcRenderer.invoke('delete-hold',param),
    getMaster: () => ipcRenderer.invoke('get-master'),
    getNomor: () => ipcRenderer.invoke('nomor'),
    simpanTransaksi: (param) => ipcRenderer.invoke('simpan-transaksi',param),
    printUlang: () => ipcRenderer.invoke('print-ulang'),
    printUlangParam: (param) => ipcRenderer.invoke('print-ulang-param',param),
    kirimTransaksiServer: () => ipcRenderer.invoke('kirim-transaksi-server'),
    //tutup kasir
    kasirBelumTutupKasir: () => ipcRenderer.invoke('kasir-belum-tutup-kasir'),
    getModalKasir: () => ipcRenderer.invoke('get-modal-kasir'),
    getPaymentMethod: () => ipcRenderer.invoke('get-payment-method'),
    simpanTutupKasir:(param) =>ipcRenderer.invoke('simpan_tutup_kasir',param),
    // refund
    getPenjualanDetail: (param) => ipcRenderer.invoke('get_penjualan_detail',param),
    simpanRefund:(param) => ipcRenderer.invoke('simpan_refund',param),
    getRefundDetail: (param) => ipcRenderer.invoke('get_refund_detail',param),

    getPlatform: (param) => ipcRenderer.invoke('get-platform',param),
    // history
    history:(param) => ipcRenderer.invoke('history',param),
    updateTransaksi:(param) => ipcRenderer.invoke('update-transaksi',param),
    // update barang
    notifBarang:(param) => ipcRenderer.invoke('notif-barang',param),
    prosesUpdateBarang: (param) => ipcRenderer.invoke('proses-update-barang',param),
    // promo 
    promo:() => ipcRenderer.invoke('promo'),
    promoDiskonBarang:(param) => ipcRenderer.invoke('promo-diskon-barang',param),
    promoHadiahBarang:(param) => ipcRenderer.invoke('promo-hadiah-barang',param),
    getTransaksi:() => ipcRenderer.invoke('get-transaksi'),
    getTransaksiLokal:() => ipcRenderer.invoke('get-transksi-lokal'),
    kirimUlangTransaksi:(param) => ipcRenderer.invoke('kirim-ulang-transaksi',param),
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded');
});