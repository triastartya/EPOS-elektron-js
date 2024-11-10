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

    $scope.platform = '';
    angular.element(window).ready(async function () {
        $scope.platform = await window.api.getPlatform('ok');
        console.log($scope.platform);
        $scope.$apply();
        Swal.close();
    });
    
    $scope.penjualan = null;
    $scope.no_penjualan = '';
    $scope.keterangan = '';
    $scope.detail = [];
    $scope.get_penjualan_detail = async function(){
        Swal.fire({title: 'Loading..',onOpen: () => {Swal.showLoading()}})
        response =  await window.api.getPenjualanDetail($scope.no_penjualan);
        console.log('get penjualan',response);
        if(response.success){
            $scope.penjualan = response.data;
            Swal.close();
            $scope.$apply();
        }else{
            Swal.fire({icon: 'error',title: 'Opps....',text: response.message})
        }
    }
    $scope.tambah = function(item){
        console.log('item',item);
        console.log('detail',item);
        let cek =  $scope.detail.find(function(e){
            return  e.id_barang == item.id_barang
        })
        if(cek){
            Swal.fire({icon: 'error',title: 'Opps....',text: 'sudah ada di refund'})
        }else{
            item.qty_refund = item.qty_jual;
            $scope.detail.push(item);
        }
    }
    $scope.changeQty = function(item,idx){
        console.log('item =>',item);
        console.log('index =>',idx);
        if(parseFloat(item.qty_jual) < parseFloat(item.qty_refund)){
            $scope.detail[idx].qty_refund = item.qty_jual
            Swal.fire({icon: 'error',title: 'Opps....',text: 'tidak boleh lebih dari qty jual'})
        }
        $scope.detail[idx].sub_total = (parseFloat($scope.detail[idx].harga_jual) - parseFloat($scope.detail[idx].diskon1)) * item.qty_refund;
    }
    $scope.hapus = function(idx){
        $scope.detail.splice(idx,1);
    }
    $scope.refund = null;
    $scope.total_modal = 0;
    $scope.simpan_refund = async function(){
        $scope.total_modal = $scope.detail.sum('sub_total');
        let d = [];
        $scope.detail.forEach((item, index) => {
            d.push({
                urut : index+1,
                id_barang : item.id_barang,
                qty_jual : item.qty_refund,
                kode_satuan : item.kode_satuan,
                harga_jual : item.harga_jual,
                diskon1 : item.diskon1,
                diskon2 : item.diskon2,
                display_diskon1 : item.display_diskon1,
                display_diskon2 : item.display_diskon2,
                sub_total : item.sub_total,
            })
        });
        $scope.refund = {
            id_penjualan : $scope.penjualan.id_penjualan,
            keterangan : $scope.keterangan,
            total_refund : $scope.total_modal,
            detail : d
        }
        Swal.fire({title: 'Loading..',onOpen: () => {Swal.showLoading()}})
        console.log('payload',$scope.refund);
        response =  await window.api.simpanRefund($scope.refund);
        console.log('response',response);
        if(response.success){
            Swal.fire('Refund Berhasil Di buat!','','success').then(function() {
                window.location.href = `./nota_refund.html?id=${response.data.id_refund}`;
            });
        }else{
            Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
        }
    }
})