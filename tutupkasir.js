window.api.loginPagePos();
Array.prototype.sum = function(prop) {
    return this.reduce((acc, obj) => acc + (obj[prop] || 0), 0);
};

app.controller("myCtrl", function($scope,$http,API) {
    $scope.quit = async function(){
        await window.api.appQuit();
    }

    $scope.pos = async function(){
        await window.api.linkPos();
    }

    $scope.dev = async function(){
        await window.api.devTools();
    }
    $scope.input_tutup_kasir = null;
    $scope.payment_method = null;
    $scope.total_modal = 0;
    $scope.detail = [];
    $scope.sisa_saldo = 0;
    $scope.keterangan = '';
    $scope.penerimaan = 0;
    $scope.setor_bank = 0;
    $scope.transaksi_server = [];
    $scope.transaksi_lokal = [];
    $scope.hilang = [];
    var table
    table   =  $('#listdatatable').DataTable({
        "ordering"        : false,
        "bFilter"         : false,
        "bPaginate"       : false,
        "bInfo"           : false,
        columns: [
            { title:"tanggal",    "data": "tanggal_modal_kasir","className": "text-left"},
            { title:"waktu entry","data": "created_at"},
            { title:"Modal",      "data": "modal_kasir",render: $.fn.dataTable.render.number( '.', ',', 0, '' )},
        ]
    });

    $scope.platform = '';

    angular.element(window).ready( async ()=>{
        $scope.platform = await window.api.getPlatform('ok');
        console.log($scope.platform);
        
        Swal.fire({title: 'Loading..',onOpen: () => {
            Swal.showLoading()
        }});
        $scope.input_tutup_kasir = await window.api.getModalKasir();
        console.log('input_tutup_kasir => ',$scope.input_tutup_kasir);
        if(!$scope.input_tutup_kasir.success){
            Swal.fire({type: 'error',title: 'Gagal get data user belum tutup kasir',text: $scope.input_tutup_kasir.message})
        }
        table.clear().draw();
        table.rows.add($scope.input_tutup_kasir.data.modal_kasir).draw();
        var hitung_total = $.map($scope.input_tutup_kasir.data.modal_kasir, function(item) {
            return {
                modal_kasir: parseFloat(item.modal_kasir) // Convert modal_kasir to float
            };
        });
        $scope.total_modal = hitung_total.sum('modal_kasir');
        $scope.payment_method = await window.api.getPaymentMethod();
        $.each($scope.payment_method, function(index, item) {
            item.nominal = 0;
        });
        console.log($scope.payment_method);
        Swal.close();
        //====== tarik transaksi dari server
        response = await window.api.getTransaksi();
        console.log('transaksi_server => ',response);
        if(!response.success){
            Swal.fire({type: 'error',title: 'Gagal get data transaksi server',text: response.message})
        }else{
            $scope.transaksi_server = response.data
        }
        //====== tarik transaksi dari lokal kasir
        response_lokal = await window.api.getTransaksiLokal();
        console.log('transaksi_lokal => ',response_lokal);
        if(!response_lokal.success){
            Swal.fire({type: 'error',title: 'Gagal get data transaksi server',text: response_lokal.message})
        }else{
            $scope.transaksi_lokal = response_lokal.data
        }
        //=============
        //======== compare data 
        // Membandingkan faktur
        $scope.hilang = $scope.transaksi_lokal.filter(item => 
            !$scope.transaksi_server.some(data => data.no_faktur === item.FakturPenjualan)
        );
        console.log('hilang',$scope.hilang);
        $scope.$apply();
    });

    $scope.nextfocus_right = function(id){
        id = id+2
        $('#id_'+id).focus();
    }

    $scope.changependapatan = function(){
        $scope.penerimaan = $scope.payment_method.sum("nominal")
        $scope.sisa_saldo =  $scope.penerimaan + $scope.total_modal + $scope.setor_bank
    }
    
    $scope.simpan = function(){
        Swal.fire({
            title: "Apakah Anda Yakin Dengan Data Yang Di input?",
            showCancelButton: true,
            confirmButtonText: "Simpan Tutup Kasir",
        }).then(async(result) => {
            if (result.value) {
                data = {
                    "id_user_kasir":$scope.input_tutup_kasir.data.login.id_user,
                    "tanggal_tutup_kasir":"",
                    "modal_kasir":$scope.total_modal,
                    "pengeluaran":0,
                    "penerimaan":$scope.penerimaan,
                    "sisa_saldo":$scope.sisa_saldo,
                    "keterangan":$scope.keterangan,
                    "setor_bank":$scope.setor_bank,
                    "detail": $scope.payment_method
                }
                console.log(data);
                response = await window.api.simpanTutupKasir(data);
                console.log('response',response);
                if(response.success){
                    Swal.fire('Berhasil Input Tutup Kasir!','','success').then(function(){
                        location.reload();
                    });
                }else{
                    Swal.fire({type: 'error',title: '',text: response.message,})
                }
            }
        });
    }

    $scope.kirim_ulang = async function(x){
        //console.log(x)
        Swal.fire({title: 'Loading..',onOpen: () => {
            Swal.showLoading()
        }});
        res_kirim_ulang = await window.api.kirimUlangTransaksi(x.FakturPenjualan)
        console.log('response',res_kirim_ulang);
        if(response.success){
            data = await window.api.kirimTransaksiServer();
            location.reload();
        }else{
            Swal.fire({type: 'error',title: '',text: response.message,})
        }
    }
})