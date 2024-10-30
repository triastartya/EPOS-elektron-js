window.api.loginPagePos();
Array.prototype.sum = function(prop) {
    return this.reduce((acc, obj) => acc + (obj[prop] || 0), 0);
};

app.controller("myCtrl", function($scope,$http,API) {
    $scope.showtabel = true;
    $scope.platform = '';
    angular.element(window).ready( async ()=>{
        $scope.platform = await window.api.getPlatform('ok');
        $scope.tanggal = '';
        $scope.status = '';
        console.log($scope.platform);
        $( ".datepicker" ).datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
        }).datepicker('setDate', new Date());
        $scope.$apply();
    })

    $scope.cari = async function(){
        Swal.fire({title: 'Loading..',onOpen: () => {
            Swal.showLoading()
        }});
        response = await window.api.history({
            'tanggal'   :$scope.tanggal,
            'status'    :$scope.status
        });
        console.log(response);
        if(response.success){
            table.clear().draw();
            table.rows.add(response.data).draw( );
            Swal.close();
        }else{
            Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
        }
    }
    var action =  "<a style='text-align:center' class='btn btn-primary btn-sm' href='javascript:void(0)' title='Detail' id='Detail' >lihat</a>";
    table   =  $('#listdatatable').DataTable({
        // "ordering"        : false,
        // "bFilter"         : false,
        // "bPaginate"       : false,
        // "bInfo"           : false,
        columns: [
            { title:"",                   'defaultContent': action, "width":"30px"},
            { title:"id",    "data": "id"},
            { title:"Waktu","data": "waktu"},
            { title:"Faktur Penjualan","data": "FakturPenjualan"},
            { title:"item",      "data": "JumlahItem",render: $.fn.dataTable.render.number( '.', ',', 0, '' )},
            { title:"TotalTransaksi2",      "data": "TotalTransaksi2",render: $.fn.dataTable.render.number( '.', ',', 0, '' )},
            { title:"TotalBayar",      "data": "TotalBayar",render: $.fn.dataTable.render.number( '.', ',', 0, '' )},
            { title:"Kembali",      "data": "Kembali",render: $.fn.dataTable.render.number( '.', ',', 0, '' )},
            { title:"kirim",      "data": "kirim"},
            { title:"kirim_code",      "data": "kirim_code"},
            { title:"kirim_response",      "data": "kirim_response"},
        ]
    });

    $('#listdatatable tbody').on('click', '#Detail', function () {
        var tr = $(this).closest('tr');
        var x = table.row(tr).data();
        $scope.detail(x);
    });
    $scope.isi = '';
    $scope.detail = function(data){
        data.TransPenjualanDet = (typeof data.TransPenjualanDet=='string')?JSON.parse(data.TransPenjualanDet):data.TransPenjualanDet;
        data.TransPenjualanDetPayment = (typeof data.TransPenjualanDetPayment=='string')? JSON.parse(data.TransPenjualanDetPayment):data.TransPenjualanDetPayment;
        $scope.isi = JSON.stringify(data, null, 4);
        $scope.showtabel = false
        $scope.$apply();
    }
    $scope.back = function(){
        $scope.showtabel = true
    }
    $scope.simpan = async function(){
        Swal.fire({title: 'Loading..',onOpen: () => {
            Swal.showLoading()
        }});
        request = JSON.parse($scope.isi);
        response = await window.api.updateTransaksi(request);
        console.log(response);
        if(response.success){
            Swal.fire('Data Transaksi Berhasil Di Update!','','success').then(function(){
                $scope.cari()
            })
        }else{
            Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
        }
    }
})