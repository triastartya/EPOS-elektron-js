window.api.loginPagePos();
var whichFocus=null;
var popup =false;
var getpay = false;
var modalready = true;
var statuspayment = false;

Array.prototype.sum = function(prop) {
    return this.reduce((acc, obj) => acc + (obj[prop] || 0), 0);
};

Array.prototype.forEachAsync = function (callback, end) {
    var self = this;

    function task(index) {
        var x = self[index];
        if (index >= self.length) {
            end()
        }
        else {
            callback(self[index], index, self, function () {
                task(index + 1);
            });
        }
    }

    task(0);
};

$( document ).ready(function() {
    $(".preloader").fadeOut();
    window.setInterval(function(){
        getpay = false
        // console.log(getpay)
    }, 500);

    // $(window).resize(function() {
	// 	$('.tinggi').height($(window).height() - 270);
	// });
	// $(window).trigger('resize');
    // $('.tinggi').height($(window).height() - 270);

    $('.sidebar-toggle').click()
    $( "#getproduct" ).focus()

    var isCtrlHold = false;
    var isShiftHold = false;


    $(document).keyup(function (e) {
        if (e.which == 17) //17 is the code of Ctrl button
            isCtrlHold = false;
        if (e.which == 16) //16 is the code of Shift button
            isShiftHold = false;
    });

    $(document).keydown(function (e) {
        if (e.which == 17)
            isCtrlHold = true;
        if (e.which == 16)
            isShiftHold = true;
        ShortcutManager(e);
    });

    function ShortcutManager(e){
        if (e.which == 112) {
          e.preventDefault();
          if(whichFocus == 'barang'){
            $( "#getproduct" ).focus();
          }
        }

        if(e.which == 121){
          e.preventDefault();
          if(popup==false){
            if(modalready){
                $('#btn_customer').click()
                popup = true;
                modalready=false;
            }
          }
        }


        if(e.which == 113){
          e.preventDefault();
          if(whichFocus == 'barang'){
            $('#listdetail tbody td').focus();
            $('#listdetail tbody td').click();
          }
        }

        if(e.which == 114){
            if(whichFocus == 'barang'){
                e.preventDefault();
                $('#btndel').click();
            }
        }

        if(e.which == 115){
            e.preventDefault();
            $('#holdoropen').click();
        }

        if(e.which == 116){
            e.preventDefault();
            $('#btnmethodcash').click();
        }

        if(e.which == 117){
            e.preventDefault();
            if(statuspayment){
                $('#btnmethodvoucher').click();
            }
        }

        if(e.which == 118){
            e.preventDefault();
            if(statuspayment){
                $('#btnmethoddebit').click();
            }
        }

        if(e.which == 119){
            e.preventDefault();
            if(statuspayment){
                $('#btnmethodcredit').click();
            }
        }

        if(e.which == 120){
            e.preventDefault();
            $('#btnmethodother').click();
          }

        if(e.which == 123){
            e.preventDefault();
            $('#btnbarcode').click();
        }

        if(e.which == 106){
            e.preventDefault();
            $('#btnqty').click();
        }

        if(e.which == 107 ){
            e.preventDefault();
            $('#btnpayment').click();
            //getpay = true;
            //console.log(getpay)
        }
        // else{
        //     if(e.which != 13){
        //         getpay = false;
        //     }
        // }

        // if(e.which == 13 && getpay == true ){
        //     e.preventDefault();
        //     $('#btnpayment').click();
        // }

        // if(e.which == 110){
        //     if(whichFocus == 'barang'){
        //         e.preventDefault();
        //         $('#btnqty').click();
        //         // $('#edit_qty').focus();
        //         // $('#edit_qty').select();
        //     }
        // }

        if(e.which == 111){
            if(whichFocus == 'barang'){
                e.preventDefault();
                $('#btnharga').click();
                // $('#edit_qty').focus();
                // $('#edit_qty').select();
            }
        }

        if(e.which == 27){
            e.preventDefault();
            Swal.close();
            $( "#focustable" ).click()
        }

        if( e.which === 80 && e.ctrlKey ){
            e.preventDefault();
            modalready = false;
            // $('#print_ulang').click();
            $('#printulang').modal('show');
        }

        if( e.which === 66 && e.ctrlKey ){
            e.preventDefault();
            modalready = false;
            $('#updatebarang').focus();
            $('#setupdatebarang').modal('show');
        }

    }
    elem = document.getElementsByTagName("HTML")[0];
    // openFullscreen(elem)
});

function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
}

function number_format(number, decimals, dec_point, thousands_sep) {
    
    var n = number, prec = decimals;

    var toFixedFix = function (n,prec) {
        var k = Math.pow(10,prec);
        return (Math.round(n*k)/k).toString();
    };

    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

    var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

    var abs = toFixedFix(Math.abs(n), prec);
    var _, i;

    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;

        _[0] = s.slice(0,i + (n < 0)) +
              _[0].slice(i).replace(/(\d{3})/g, sep+'$1');
        s = _.join(dec);
    } else {
        s = s.replace('.', dec);
    }

    var decPos = s.indexOf(dec);
    if (prec >= 1 && decPos !== -1 && (s.length-decPos-1) < prec) {
        s += new Array(prec-(s.length-decPos-1)).join(0)+'0';
    }
    else if (prec >= 1 && decPos === -1) {
        s += dec+new Array(prec).join(0)+'0';
    }
    return s;
}

function enter(ckey,_cid){
    if (ckey==13){
        document.getElementById(_cid).focus();
        document.getElementById(_cid).select();
    }
}

function getsubmitspvkasir(ckey,_cid){
    if (ckey==13){
        //console.log('tes123')
        $('.swal2-confirm').click();
    }
}

function diskon(hargaAwal,dc){
  var diskon;
  if(dc != 0){
    diskon = (parseInt(dc)/100) * parseInt(hargaAwal);
    hargaDiskon = diskon;
  }else{
    hargaDiskon = 0;
  }
  return hargaDiskon;
}

app.controller("myCtrl", function($scope,$http,API) {

    $scope.quit = async function(){
        await window.api.appQuit();
    }

    $scope.tutupkasir = async function(){
        await window.api.linkTutupkasir();
    }

    $scope.refund = async function(){
        await window.api.linkRefund();
    }

    $scope.dev = async function(){
        await window.api.devTools();
    }

    

    $scope.idhold =null;
    $scope.status = false;
    $scope.stsbarcode = true;
    $scope.stsqty = false;
    $scope.btnbayar = false;
    var ksts = true;

    $scope.displaybarang = '';
    $scope.displayqty = 0;

    $scope.nextfocus = function(id){
        $('#'+id).focus();
    }

    // $scope.send = function(){
    //     $http.get(API.base_url + '/api_data/proses/sendtransaksi').then(function(res){
    //         // console.log(res);
    //     });
    // }

    // $scope.getnotifbarang = function(){
    //     $http.get(API.base_url + '/api_data/offline/notifbarang').then(function(res){
    //         $scope.notifbarang = res.data.notifbarang;
    //     });
    // }

    // $scope.getnotifbarang();

    $scope.stsonline = 2

    $scope.ping = async function(){
        online = await window.api.cekOnline();
        console.log(online);
        if(online.success){
            $scope.stsonline = 1
        }else{
            $scope.stsonline = 0
        }
        $scope.$apply();
    }

    $scope.ping();

    window.setInterval(function(){
         $scope.ping();
        //  $scope.getnotifbarang();
    },10000);

    $scope.transfer = true;
    window.setInterval( async()=>{
        if($scope.transfer){
            $scope.transfer = false;
            let data = await window.api.kirimTransaksiServer();
            if(data.message!='kosong'){
                console.log('transfer ke server',data);
            }
            $scope.transfer = true;
        }
    },1000);

    $scope.form = `
    <div class="box-body" style="text-align: left">
      <div class="form-group">
        <label for="exampleInputEmail1" >Username</label>
        <input type="email" class="form-control" id="username1" placeholder="Username" onkeypress="javascript:enter(event.keyCode,'password1');" autocomplete="off">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="password1" placeholder="Password" onkeypress="javascript:getsubmitspvkasir(event.keyCode,'password1');" autocomplete = 'new-password' autocomplete="off">
      </div>
      <p style="color:red;" id="error"></p>
    </div>
    `;
    $scope.platform = '';
    angular.element(window).ready(async function () {
        $scope.platform = await window.api.getPlatform('ok');
        console.log($scope.platform);
        // $('.carousel').carousel()

        $(window).scannerDetection();
        $(window).bind('scannerDetectionComplete',function(e,data){
            if($scope.stsbarcode){
                $scope.getbarcode(data.string);
                $('#getproduct').val('');
                // $('#btn-getbarcode').click();
            }
            $('#getproduct').val('');
            // console.log('---- Detection');
        })
        .bind('scannerDetectionError',function(e,data){
            // console.log('detection error '+data.string);
        })
        .bind('scannerDetectionReceive',function(e,data){
            // console.log('Recieve');
            // console.log(data.evt.which);
            // console.log('---- Recieve');
            ksts = false
            if(data.evt.which == 13){
                window.setInterval(function(){
                    ksts = true
                }, 1000);
            }
        })

        $(window).resize(function() {
            $('div.dt-scroll-body').height( $(window).height() - 300 );
        });
        
        $(window).trigger('resize');
        $('div.dt-scroll-body').height( $(window).height() - 300 );

    });

    $("#setupdatebarang").on("shown.bs.modal", function () {
        $( "#updatebarang" ).focus()
    });

    $("#setupdatebarang").on("hidden.bs.modal", function () {
        modalready = true;
    });
    
    $scope.updatebarang = function(){
        Swal.fire({title: 'Tunggu Sedang Proses Update Barang..',allowOutsideClick: false,onOpen: () => {Swal.showLoading()}})
        $http.get(API.base_url + '/api_data/proses/updatebarang').then(function(res){
            $('#setupdatebarang').modal('hide')
            $scope.getnotifbarang();
            Swal.fire('Berhasil Update Barang!','','success')
        })
    }

    $scope.barcode = function(){
        if($scope.stsbarcode){
            $scope.stsbarcode = false;
        }else{
            $scope.stsbarcode = true;
        }
    }

    $scope.setstsqty = function(){
        if($scope.stsqty){
            $scope.stsqty = false;
        }else{
            $scope.stsqty = true;
        }
    }

    $( "#modal" ).click(function() {
        $scope.setmodal();
    });

    $("#modal_qty").on("hidden.bs.modal", function () {
        $( "#getproduct" ).focus()
    });

    $( "#modal_qty" ).on('shown.bs.modal', function(){
        $( "#new_qty" ).focus();
        $( "#new_qty" ).val(1);
        $( "#new_qty" ).select();
    })

    $( "#model_payment" ).on('shown.bs.modal', function(){
        $( "#cash" ).focus()
        statuspayment = true
    })

    $( "#model_payment" ).on('hidden.bs.modal', function(){
        $( "#focustable" ).click()
        modalready = true;
        statuspayment = false
    })


    $( "#listhold" ).on('shown.bs.modal', function(){
        $('#tablehold tbody tr td:first').click();
    })

    $( "#viewpay" ).on('shown.bs.modal', function(){
        $('#simpanpos').focus();
    })

    $( "#viewpay" ).on('hidden.bs.modal', function(){
        $('#submitsale').focus();
        modalready = true;
    })

    $( "#printulang" ).on('shown.bs.modal', function(){
        // setTimeout(function(){
            $('#nofakturprint').focus();
            $scope.nofakturprint = ''
        // }, 500);
    })

    $( "#printulang" ).on('hidden.bs.modal', function(){
            $('#nofakturprint').focus();
            modalready = true;
    })

    $( "#viewpay" ).on('hidden.bs.modal', function(){
        modalready = true;
    })


    $('#getproduct').keydown(function (e) {
        if (e.which == 112) {
            e.preventDefault();
            // console.log(whichFocus);
            switch(whichFocus) {
                case 'x':
                    break;
                case 'barang':
                    whichFocus=null;
                    $('#btnbarang').click();
                    modalready = false;
                    break;
            }
        }


        if(e.which == 13){
            if($('#getproduct').val() != ''){
                getbarang = $('#getproduct').val()
                $parm = {
                    id:getbarang.trim()
                };

                if(ksts){
                    // $http.post(API.base_url + '/api_data/offline/caribarcode',$parm).then(function(res){
                    $http.post(API.base_url + '/api_data/offline/carikode',$parm).then(function(res){
                        if(res.data.statusCode==200){
                            item =res.data.data
                            $scope.add_detail(item,1)
                            $('#getproduct').val('')
                        }
                    })
                }
            }
        }
    });

    $("#new_qty").on('keypress',function(e) {
        if(e.which == 13) {
            // $( "#getproduct" ).val('')
            // $('#modal_qty').modal('hide')
            // qty = $( "#new_qty" ).val()
            // total = ($scope.item.harga * qty)
            // $scope.add_detail($scope.item,qty)
        }
    });

    $("#new_kirim").on('keypress',function(e) {
        if(e.which == 13) {
            $scope.updatekirim()
            $scope.$apply()
        }
    });

    $("#new_diskon").on('keypress',function(e) {
        if(e.which == 13) {
            $scope.updatediskon()
            $scope.$apply()
        }
    });

   $scope.detail =[];
   $scope.detail_table = [];
   $scope.indexdetail = 0;
   $scope.item =[];
   $scope.jml = 0;
   $scope.tot = 0;
   $scope.kirim = 0;
   $scope.diskon = 0;
   $scope.subtotal = 0;
   $scope.grandtotal = 0;
   $scope.customer = null;
   $scope.tblindex = 0;

    $('#btn_customer').popUpCustomer({
        'title'   : 'Data Customer',
        // 'url'     : API.base_url + '/api_data/customer/LookupByParams',
        'url'     : API.base_url + '/api_data/offline/getcustomer',
        'data'    : {},
        callback  : function(res) {
            $scope.customer = res
            // console.log(res)
            $scope.namacustomer = $scope.customer.namaCustomer
            $scope.point = $scope.customer.jumlahPoint
            $scope.$apply()
        },
        tutup     : function(res){
            popup = false;
            modalready = true;
        }
    })

    $('#btnbarang').popUpGridBarang({
        'title'   : 'Data Barang POS',
        'data'    : {},
        callback  : function(res) {
            // console.log(res)
            $scope.add_detail(res,1)
            // console.log('lhaaa')
            $scope.$apply()
        },
        tutup     : function(res){
            $( "#getproduct" ).focus();
            modalready = true;
        }
    })

    // $scope.setpop = function(){
    //     console.log('tesss')
    //     $('#btnbarang').popUpGridBarang("options", "url", API.base_url + '/api_data/caridatabarangLoockUp');
    //     $('#btnbarang').popUpGridBarang("options", "data",{id:'1',tri:'qwerty'});
    // }

    //============================ Generade Data Table ==========================
        var tableDetail = $('#listdetail').DataTable({
            "scrollY"         : $(window).height() - 260,
            "scrollCollapse"  : true,
            "ordering"        : false,
            "bFilter"         : false,
            "bPaginate"       : false,
            "bInfo"           : false,
            select: {
                style: 'single'
            },
            keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ,46 ]
            },
            columns: [
                { title: "id","data": "id", "className": "text-right" ,visible:false},
                // { title: "No","data": "no" ,"width":"20px","className": "text-right"},
                {
                    title: "No",
                    "data": "No",
                    "width":"20px",
                    "className": "text-right",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { title: "Kode","data": "kode" },
                { title: "Nama Barang","data": "name" },
                { title: "Qty","data": "qty","className": "text-right font-weight-bold"},
                { title: "Satuan","data": "satuan"},
                { title: "Harga","data": "harga","className": "text-right", render: $.fn.dataTable.render.number( '.', ',', 0, '' ) },
                { title: "D","data": "d1", "className": "text-right" },
                { title: "D2","data": "d2", "className": "text-right" ,visible:false},
                { title: "diskon","data": "diskon", "className": "text-right" ,visible:false},
                { title: "Total","data": "total", "className": "text-right", render: $.fn.dataTable.render.number( '.', ',', 0, '' ) },
                // { title: "<i class='fa fa-trash'></i>","data": "del","width":"10px", "className": "text-center" },
            ]
        });
        // Handle event when cell gains focus
        $('#listdetail').on('key-focus.dt', function(e, datatable, cell){
            var data = tableDetail.row(cell.index().row).data();
            tableDetail.row(cell.index().row).select();
            $scope.indexdetail =cell.index().row;
            $scope.displaybarang = $scope.detail[$scope.indexdetail].name;
            if($scope.$$phase==null){
                $scope.$apply();
            }
            //
        });

        // Handle click on table cell
        $('#listdetail').on('click', 'tbody td', function(e){
            e.stopPropagation();

            if(tableDetail.rows().count()!=0){
                var rowIdx = tableDetail.cell(this).index().row;
                $scope.indexdetail = rowIdx;
                // Select row
                tableDetail.row(rowIdx).select();
            }

        });

        // Handle key event that hasn't been handled by KeyTable
        $('#listdetail').on('key.dt', function(e, datatable, key, cell, originalEvent){
            // If ENTER key is pressed
            if(key === 13){
                items = tableDetail.rows('.selected').data()[0];
            }
            if(key == 46){
                idx = tableDetail.rows( '.selected' ).indexes()[0];
                // console.log(idx)
                $scope.removedetail(idx);
            }
        });

        // $('#listdetail').on('dblclick', 'tbody td', function(e){
        //     items = tableDetail.rows('.selected').data()[0];
        // });

        //delete
        // $('#listdetail tbody').on('click', '#DeleteRowDet', function () {
        //   var tr = $(this).closest('tr');
        //   var cidx = tableDetail.row( tr ).index();
        //   $scope.removedetail(cidx);
        // });
    //========================= end table =============================
    $scope.datainsert = []

    $scope.reloadTable = function(sts=false,action=0){
        // console.log(action);
        tableDetail.clear();
        tableDetail.rows.add($scope.detail)
        tableDetail.draw();
        switch(action) {
            case 1:
                tableDetail.row($scope.indexdetail).select();
                tableDetail.cell($scope.indexdetail,":eq(4)").focus();
              break;
            case 2:
                $scope.focustable()
              break;
            default:
                $scope.focustable()
        }
        // console.log($scope.indexdetail)
    }

    $scope.focustable = function(){
        tableDetail.row($scope.detail.length-1).select();
        tableDetail.cell($scope.detail.length-1,":eq(4)").focus();
        var element = $('div.dt-scroll-body')
        var h = element.get(0).scrollHeight
        element.animate({scrollTop: h})
    }

//===========================================================================
    $scope.add_detail = function(item,qty){
        sts = true;
        idx = '';
        harga = item.hargaJual
    //================= hitung harga ===========
        if(parseInt(qty)>=parseInt(item.jumlahGrosir1) && parseInt(item.jumlahGrosir1) != 0){
            harga = item.hargaGrosir1
            if(parseInt(qty)>=parseInt(item.jumlahGrosir2 && parseInt(item.jumlahGrosir2) != 0)){
                harga = item.hargaGrosir2
            }
        }
        //================ cek disko diskonSyaratMinBelanja =====================
        syarat_diskon = (parseInt(qty) >= item.diskonSyaratMinBelanja)? item.diskon : 0 ;
        console.log('atas',syarat_diskon);
        //==========================================
        //hargadiskon = diskon(harga,syarat_diskon) ;
        hargadiskon =(item.isDiskonNominal)? syarat_diskon : diskon(harga,syarat_diskon);
        // hargadiskon2 = diskon(parseInt(item.harga)-hargadiskon,item.d2);
        hdiskon = hargadiskon //+ hargadiskon2;
        h = parseInt(harga)- hdiskon;
        total =  parseInt(qty) *  h ;

        angular.forEach($scope.detail, function(value, key){
            if(value.kode==item.kodeBarang){
                sts = false;
                qty = parseInt(qty)+value.qty;
                idx = key;
                $scope.indexdetail = key
                //================= hitung harga ===========
                // console.log(parseInt(qty))
                // console.log(parseInt(item.jumlahGrosir1))
                if(parseInt(qty) >= parseInt(item.jumlahGrosir1) && parseInt(item.jumlahGrosir1) != 0){
                    harga = item.hargaGrosir1
                    // console.log(parseInt(item.hargaJual))
                    if(parseInt(qty)>=parseInt(item.jumlahGrosir2) && parseInt(item.jumlahGrosir2) != 0){
                        harga = item.hargaGrosir2
                    }
                }
                //================ cek disko diskonSyaratMinBelanja =====================
                syarat_diskon = (parseInt(qty) >= item.diskonSyaratMinBelanja)? item.diskon : 0 ;
                console.log('bawah',syarat_diskon);
                //==========================================
                //hargadiskon = diskon(harga,syarat_diskon) ;
                hargadiskon =(item.isDiskonNominal)? syarat_diskon : diskon(harga,syarat_diskon);
                // hargadiskon2 = diskon(parseInt(item.hargaJual)-hargadiskon,item.d2);
                hdiskon = hargadiskon //+ hargadiskon2;
                h = parseInt(harga)- hdiskon;
                total =  parseInt(qty) *  h ;
            }
        });

        if(sts){
            newdata = {
                id              : item.idBarang,
                kode            : item.kodeBarang,
                name            : item.namaBarang,
                harga           : harga,
                diskon_awal     : item.diskon,
                d1              : syarat_diskon,
                diskon          : hdiskon,
                d2              : 0,
                satuan          : item.kodeSatuanKecil,
                qty             : parseInt(qty),
                old_qty         : qty,
                total           : total,
                hargaJual       : item.hargaJual,
                jumlahGrosir1   : item.jumlahGrosir1,
                jumlahGrosir2   : item.jumlahGrosir2,
                hargaGrosir1    : item.hargaGrosir1,
                hargaGrosir2    : item.hargaGrosir2,
                setPromoHadiahID    :item.setPromoHadiahID,
                // kodePromo        :item.Promo.kodePromo,
                // namaPromo        :item.Promo.namaPromo,
                minimalNominal      :item.minimalNominal,
                isBerlakuKelipatan  :item.isBerlakuKelipatan,
                jumlahHadiah        :item.jumlahHadiah,
                hadiah              :item.hadiah,
                diskonSyaratMinBelanja:item.diskonSyaratMinBelanja,
                isDiskonNominal : item.isDiskonNominal
                
            }
            $scope.datainsert = newdata;
            $scope.detail.push(newdata)
            $scope.inserttemp(newdata)
            action = 2;
        //==================
        }else{
            $.grep($scope.detail, function (e,index) {
                if (index == idx) {
                    e.qty	    = qty;
                    e.old_qty	= qty;
                    e.total	    = total;
                    e.harga	    = harga;
                }
            });
            action = 1;
            $scope.edittemp($scope.detail[idx]);
        }
        $scope.hitung(false,action)
        ksts=true
        $('#getproduct').val('')

        if($scope.stsqty){
            $scope.indexdetail = $scope.detail.length -1;
            $('#edit_qty').focus();
            $('#edit_qty').select();
            $scope.stsqty = false;
        }
    }

    $scope.updateqty = function(){
        idx = $scope.indexdetail;
        x = $scope.detail[idx];
        edit_qty = $('#edit_qty').val().replace(".", ".");
        qty = parseFloat(edit_qty);
        qty1 = parseFloat(x.qty)
        notisnan = true;
        if(Number.isNaN(qty)){
            notisnan = false;
            $('#edit_qty').val('');
        }else{
            $('#setqty').modal('hide');
        }


        split = $('#edit_qty').val().split(".");

        //console.log(qty)
        if(notisnan){
            if(split[0].length < 7){
                if(qty < qty1){
                    Swal.fire({
                        html: $scope.form,
                        confirmButtonText: 'Confirm',
                        showCancelButton: true,
                        preConfirm: async function() {
                            $data = {
                                        username: $('#username1').val(),
                                        password: $('#password1').val(),
                                    }
                            let response = await window.api.pengawasKasir($data);
                            if(response.succsess){
                                $scope.okeupdateqty(qty)
                                Swal.close()
                            }else{
                                $('#username1').select()
                                $('#error').html(response.message);
                                return false
                            }
                            return false
                        }
                    }).then((result)=>{
                        setTimeout(function(){
                            $('#getproduct').focus()
                        }, 500);
                    })
                    setTimeout(function(){
                        $('#username1').focus()
                    }, 500);

                }else{
                    $scope.okeupdateqty(qty)
                }
            }else{
                $('#setqty').modal('hide');
            }
        }
    }

    $scope.okeupdateqty = function(qty){
        idx = $scope.indexdetail;
        x = $scope.detail[idx];
        console.log(x);
        // if(qty >= parseInt(x.jumlahGrosir1) && parseInt(x.jumlahGrosir1) != 0){
        //     x.harga = x.hargaGrosir1
        //     if(qty>=parseInt(x.jumlahGrosir2) && parseInt(x.jumlahGrosir2) != 0){
        //         x.harga = x.hargaGrosir2
        //     }
        // }else{
        //     x.harga = x.hargaJual
        // }
        x.harga = x.hargaJual

        if(qty >= parseInt(x.jumlahGrosir1) && parseInt(x.jumlahGrosir1) != 0){
            x.harga = x.hargaGrosir1
            if(qty>=parseInt(x.jumlahGrosir2) && parseInt(x.jumlahGrosir2) != 0){
                x.harga = x.hargaGrosir2
            }
        }

        //================ cek disko diskonSyaratMinBelanja =====================
        syarat_diskon = ( qty >= x.diskonSyaratMinBelanja)? x.diskon_awal : 0 ;
        console.log('qty',qty);
        console.log('diskonSyaratMinBelanja',x.diskonSyaratMinBelanja);
        console.log('diskon_awal',x.diskon_awal);
        console.log('syarat_diskon',syarat_diskon);
        hargadiskon =(x.isDiskonNominal)? syarat_diskon : diskon(x.harga,syarat_diskon);
        console.log('isDiskonNominal',x.isDiskonNominal)
        hdiskon = hargadiskon
        h = parseInt(x.harga)- hdiskon;
        total =  qty *  h ;

        $.grep($scope.detail, function (e,index) {
            if (index == idx) {
                e.d1    = syarat_diskon
                e.diskon= hdiskon,
                e.qty	= qty;
                e.total	= total;
            }
        });

        $('#edit_qty').val(0);
        $('#getproduct').focus();
        $scope.edittemp($scope.detail[idx]);
        $scope.hitung(true,1);
    }

    $scope.updateharga = function(){
        idx = $scope.indexdetail;
        x = $scope.detail[idx];
        harga = parseInt($scope.edit_harga);
        harga1 = parseInt(x.hargaJual)
        // console.log(x)
        // console.log(harga)
        // console.log(harga1)
        $('#setharga').modal('hide');
        if(harga1==0){
            if(harga.toString().length < 6){
                if(harga < harga1){
                    Swal.fire({type: 'error',title: 'harga tidak boleh kurang dari harga jual',text: x.name+' @'+number_format(x.hargaJual,0,',','.'),}).then(function(){
                        $('#btnharga').click();
                    });
                }else{
                    $scope.okeupdateharga()
                }
            }else{
                $('#setharga').modal('hide');
            }
        }else{
            if(harga.toString().length <= harga1.toString().length+1){
                if(harga < harga1){
                    Swal.fire({type: 'error',title: 'harga tidak boleh kurang dari harga jual',text: x.name+' @'+number_format(x.hargaJual,0,',','.'),}).then(function(){
                        $('#btnharga').click();
                    });
                }else{
                    $scope.okeupdateharga()
                }
            }else{
                $('#setharga').modal('hide');
            }
        }
    }

    $scope.okeupdateharga = function(){
        idx = $scope.indexdetail
        x = $scope.detail[idx]
        x.harga = $scope.edit_harga
        qty = x.qty

        hargadiskon = diskon(x.harga,x.d1)

        hdiskon = hargadiskon
        h = parseInt(x.harga)- hdiskon
        total =  qty *  h

        $.grep($scope.detail, function (e,index) {
            if (index == idx) {
                e.harga	= $scope.edit_harga
                e.total	= total
            }
        });

        $('#edit_harga').val(0)
        $('#getproduct').focus()
        $scope.edittemp($scope.detail[idx])
        $scope.hitung(true,1)
    }

    $scope.dataPromo = [];
    $scope.getPromo = function(){
        var d = [];
        var itemsProcessed = 0;
        //console.log($scope.detail);
        $scope.detail.forEach(function(item, index, array, next){
            //mengkelompokan sku yg ada kode promo
            if(item.jumlahHadiah != 0){
                d.push({
                    id              :item.id,
                    kode            :item.kode,
                    name            :item.name,
                    harga           :item.harga,
                    qty             :item.qty,
                    total           :item.total,
                    idPromo         :item.setPromoHadiahID,
                    // kodePromo    :item.Promo.kodePromo,
                    // namaPromo    :item.Promo.namaPromo,
                    nilaiPembelian  :item.minimalNominal,
                    kelipatan       :item.isBerlakuKelipatan,
                    jumlahHadiah    :item.jumlahHadiah,
                    hadiah          :item.hadiah,
                })
            }
            itemsProcessed++;
            if(itemsProcessed === array.length) {
                $scope.generadeDataPromo(d);
            }
        });
    }

    $scope.generadeDataPromo = function(d){
        //console.log(d);
        var prosesPromo = [];
        //group by dan sum total dengan promo yang sama
        d.reduce(function(res, value) {
            if (!res[value.idPromo]) {
                res[value.idPromo] = { 
                    idPromo: value.idPromo,
                    // kodePromo: value.kodePromo,
                    // namaPromo: value.namaPromo,
                    kelipatan: value.kelipatan,
                    nilaiPembelian: value.nilaiPembelian,
                    total: 0 ,
                    jumlahHadiah: value.jumlahHadiah,
                    jml:1,
                    hadiah: value.hadiah
                };
                prosesPromo.push(res[value.idPromo])
            }
            res[value.idPromo].total += value.total;
            return res;
        }, {});
        // ubah Jumlah Hadiah jika berlaku kelipatan
        $.grep(prosesPromo, function (item,index) {
            if(item.kelipatan){ 
                item.jml	= Math.floor(item.total/item.nilaiPembelian) * item.jumlahHadiah;
            }
        });
        //console.log(prosesPromo);
        // nilai pembelian lebih dari total pembelian
        $scope.dataPromo = prosesPromo.filter(function (item) {
            return item.total >= item.nilaiPembelian
        });
        //console.log($scope.dataPromo);
    }
    
//=====================================================
    $scope.getbarcode = async function(id){
        $parm = {
            'id':id
        };
        let response = await window.api.getBarangByBarcode(id);
        console.log('barcode',response);
        if(response.success){
            item =response.data
            $scope.add_detail(item,1)
        }else{
            Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
        }
        // $http.post(API.base_url + '/api_data/offline/caribarcode',$parm).then(function(res){
        //     if(res.data.statusCode==200){
        //         item =res.data.data
        //         $scope.add_detail(item,1)
        //     }else{
        //         Swal.fire({type: 'error',title: 'Data Barang Tidak Di Temukan',text: res.data.message,})
        //     }
        //  });

        // setTimeout(function(){
        //     $scope.reloadTable()
        // }, 300);
        ksts=true
    }

    $scope.deldetail =function(idx){
        $scope.detail.splice(idx,1);
        $scope.hitung()
   }

   $scope.tbldraw = function(){
    tableDetail
    .order( [[ 1, 'asc' ]] )
    .draw( 'page' );
   }

   $scope.qty_change = function(x,idx){
    // console.log(x)
    if(parseInt(x.qty)==0){
      $.grep($scope.detail, function (e,index) {
        if (index == idx) {
          e.qty	= 1;
        }
      });
      x.qty=1;
    }

    total = parseInt(x.qty)*parseInt(x.harga);
    $.grep($scope.detail, function (e,index) {
      if (index == idx) {
        e.total	= total;
      }
    });

    $scope.edittemp($scope.detail[idx]);
    $scope.hitung()
   }

   $scope.cek = function(x,idx){
    // console.log(x)
    if(parseInt(x.qty) < parseInt(x.old_qty)){
    //   alert('tidak boleh');
      Swal.fire({type: 'warning',title: 'tidak boleh'})
      total = parseInt(x.old_qty)*parseInt(x.harga);
      $.grep($scope.detail, function (e,index) {
        if (index == idx) {
          e.qty	= x.old_qty;
          e.total = total;
        }
      });
      $scope.edittemp($scope.detail[idx]);
      $scope.hitung();
    }
    $('#getproduct').focus();
   }

   $scope.setdiskon = function(){
    Swal.fire({
        html: $scope.form,
        confirmButtonText: 'Confirm',
        showCancelButton: true,
        preConfirm: async function() {
            $data = {
                        username: $('#username1').val(),
                        password: $('#password1').val(),
                    }
                let response = await window.api.pengawasKasir($data);
                if(response.succsess){
                    Swal.close()
                    $('#new_diskon').val($scope.diskon);
                    $('#setdiskon').modal('show');
                }else{
                    $('#username1').select()
                    $('#error').html(response.message);
                    return false
                }
            return false
        }
    }).then((result)=>{
        setTimeout(function(){
            $('#getproduct').focus()
        }, 500);
    })
    setTimeout(function(){
        $('#username1').focus()
    }, 500);

   }

   $( "#setdiskon" ).on('shown.bs.modal', function(){
    $('#new_diskon').focus();
    $('#new_diskon').select();
    setTimeout(function(){
        $( "#new_diskon" ).select()
    }, 100);
   })

   $scope.updatediskon = function(){
        $scope.diskon = $scope.new_diskon,//$('#new_diskon').val();
        $('#setdiskon').modal('hide');
        $scope.hitung()
        $('#getproduct').focus();
   }

   $scope.setkirim = function(){
    $('#new_kirim').val($scope.kirim);
    $('#setkirim').modal('show');
   }

   $( "#setkirim" ).on('shown.bs.modal', function(){
    $('#new_kirim').focus();
    $('#new_kirim').select();
  })

   $scope.updatekirim = function(){
    $scope.kirim = $scope.new_kirim;//$('#new_kirim').val();
    $('#setkirim').modal('hide');
    $scope.hitung()
    $('#getproduct').focus();
   }

  $scope.editqty = function(){
    if($scope.detail.length != 0){
      x = $scope.detail[$scope.indexdetail].qty;
      x = x.toString()
      z = x.replace('.',',')
      $('#edit_qty').val(z);
      $scope.edit_qty = z;

      if(modalready){
        modalready = false;
        $('#setqty').modal('show');
      }

    }
  }

  $("#setqty").on("shown.bs.modal", function () {
    $( "#edit_qty" ).focus()
  });

  $("#setqty").on("hidden.bs.modal", function () {
    modalready = true;
  });

  $scope.editharga = function(){
    if($scope.detail.length != 0){
        x = $scope.detail[$scope.indexdetail].harga;
        $('#edit_harga').val(x);
        $scope.edit_harga = x;

        if(modalready){
            modalready = false;
            $('#setharga').modal('show');
        }

        setTimeout(function(){
            $( "#edit_harga" ).select()
        }, 100);

      }
  }

  $("#setharga").on("shown.bs.modal", function () {
    $( "#edit_harga" ).focus()
  });

  $("#setharga").on("hidden.bs.modal", function () {
    modalready = true;
  });

  $scope.hitung = function(sts=false,action=0){
   $scope.jml = $scope.detail.length;
   $scope.tot = 0;
   $scope.subtotal = 0;
    for(var i = 0; i < $scope.detail.length; i++){
        $scope.subtotal += parseInt($scope.detail[i].total);
        $scope.tot  += parseInt($scope.detail[i].qty);
    }
   $scope.grandtotal = parseInt($scope.subtotal)+parseInt($scope.kirim)-parseInt($scope.diskon);
    //  setTimeout(function(){ $scope.getSelectedRow(); }, 1000);
   $scope.reloadTable(sts,action);
   $scope.dataPromo = [];
   $scope.getPromo();
  }

  $scope.sodel = function(){
    $scope.removedetail($scope.indexdetail);
  }

  $scope.removedetail= function(idx){
    if(modalready){
        Swal.fire({
            html: $scope.form,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            preConfirm: async function() {
                $data = {
                            username: $('#username1').val(),
                            password: $('#password1').val(),
                        }
                    let response = await window.api.pengawasKasir($data);
                    if(response.succsess){
                        $scope.removetemp($scope.detail[idx])
                        $scope.detail.splice(idx,1);
                        $scope.hitung();
                        Swal.close();
                    }else{
                        $('#username1').select()
                        $('#error').html(response.message);
                        return false
                    }
                return false
            }
        }).then((result)=>{
            setTimeout(function(){
                $('#getproduct').focus()
            }, 500);
        })
        setTimeout(function(){
            $('#username1').focus()
        }, 500);
    }

  }

  $scope.setmodal = function(){
    Swal.fire({
        html: $scope.form,
        confirmButtonText: 'Confirm Batal',
        showCancelButton: true,
        preConfirm: async function() {
            $data = {
                        username: $('#username1').val(),
                        password: $('#password1').val(),
                    }
            let response = await window.api.pengawasKasir($data);
            if(response.succsess){
                $scope.kosongsemua();
                Swal.close();
            }else{
                $('#username1').select()
                $('#error').html(response.message);
                return false
            }
            return false
        }
    }).then((result)=>{
        setTimeout(function(){
            $('#getproduct').focus()
        }, 500);
    })

    setTimeout(function(){
        $('#username1').focus()
    }, 500);

  }

//////////////============================ Tambah Customer ================///////////////
    //$http.get(API.base_url + '/api_data/tipecustomer/get').then(function(res){
    // $http.get(API.base_url + '/api_data/offline/gettipe').then(function(res){
    //     $scope.tipe = res.data.data;
    // });

    // $http.get(API.base_url + '/api_data/offline/getwilayah').then(function(res){
    //     $( '#btn_wilayah' ).popUpGrid({
    //         title     : 'Data Wilayah',
    //         fidArray  : [{ data: 'idWilayah',title: 'ID' },
    //                     { data: 'provinsi',title: 'Provinsi' },
    //                     { data: 'kota', title: 'Kota' }],
    //         row       : res.data.data,
    //         callback  : function(res){
    //                         $scope.idWilayah    = res.idWilayah;
    //                         $scope.kota         = res.kota;
    //                         $scope.provinsi     = res.provinsi;
    //                         $scope.$apply();
    //                     }
    //     });
    // });

    $scope.addcustomer = function(){
        $scope.idCustomer           = '';
        $scope.namaCustomer         = '';
        $scope.idTipeCustomer       = '';
        $scope.alamatCustomer       = '';
        $scope.idWilayah            = '';
        $scope.kota                 = '';
        $scope.provinsi             = '';
        $scope.email                = '';
        $scope.tglLahir             = '';
        $scope.jenisKelamin         = '';
        $scope.pekerjaan            = '';
        $scope.telpGSM              = '';
        $scope.telpWA               = '';
        $scope.telpRumah            = '';
        $scope.jenisIdentitas       = '';
        $scope.noIdentitas          = '';
        $scope.tglExpIdentitas      = '';
        $scope.keterangan           = '';
        $scope.akunFB               = '';
        $scope.akunIG               = '';
        $scope.limitCredit                  = '';
        $scope.bankRekeningCustomer         = '';
        $scope.namaPemilikRekeningCustomer  = '';
        $scope.nomorRekeningCustomer        = '';
        $('#tambahcustomer').modal('show');
    }

    // $scope.validator_formAdd = $("#forminputcustomer").validate({
    //     rules: {
    //         namaCustomer: {
    //             required: !0,
    //         },
    //         idTipeCustomer: {
    //             required: !0,
    //         },
    //         alamatCustomer: {
    //             required: !0,
    //         },
    //         idWilayah: {
    //             required: !0,
    //         },
    //     },
    //     invalidHandler: function(e, r){

    //     },
    //     submitHandler: function(e){

    //         // if($scope.update){
    //         //     vurl = "{{ url('api_data/customer/update') }}";
    //         // }else{
    //          //   vurl = "{{ url('api_data/customer/post') }}";
    //         // }

    //         vurl = API.base_url + '/api_data/customer/post';

    //         $.ajax({
    //             headers: {
    //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //                 },
    //             url : vurl,
    //             type: "POST",
    //             data:$("#forminputcustomer").serialize(),
    //             dataType: "JSON",
    //             success: function(data)
    //             {
    //                 if(data.statusCode=='200'){
    //                     Swal.fire('Data Customer Berhasil Di Simpan!','','success')
    //                     $('#tambahcustomer').modal('hide');
    //                 }else{
    //                     Swal.fire({type: 'error',title: 'Oops...',text: data.message,})
    //                 }
    //             },
    //             error: function (jqXHR, textStatus, errorThrown)
    //             {
    //                 Swal.fire({type: 'error',title: 'Oops...',text: 'Something went wrong!',})
    //             },
    //             beforeSend: function(){
    //                 Swal.fire({title: 'Loading..',
    //                     onOpen: () => {
    //                         Swal.showLoading()
    //                     }
    //                 })
    //             }
    //         });
    //         return false;
    //     }
    // });

//////////////============================ Payment =================== ////////////////

    $scope.getmaster = async function(){
        let response = await window.api.getMaster();
        console.log('master',response);
        $scope.bank=response.bank;
        $scope.edc=response.edc;
        $scope.minimal=response.minimal;
    }
    $scope.getmaster();
    
    // $http.get(API.base_url + '/api_data/SetupBank').then(function(res){
    
    // $http.get(API.base_url + '/api_data/offline/getbank').then(function(res){
    //     $scope.bank = res.data.data
    // });

    // //$http.get(API.base_url + '/api_data/SetupEdc').then(function(res){
    // $http.get(API.base_url + '/api_data/offline/getedc').then(function(res){
    //     $scope.edc = res.data.data
    // });
    // $scope.minimal = []
    // $http.get(API.base_url + '/api_data/offline/getminimal').then(function(res){
    //     $scope.minimal = res.data.data
    //     //console.log($scope.minimal)
    // });

  $scope.payment = [];
//==================================
  $scope.persenbiayabank = 0;
  $scope.biayaBank = 0;
  $scope.totalTransaksi = 0;
  $scope.jumlahBayar = 0;
  $scope.kurangBayar = 0;
//==================================

  $scope.setpayment = function(){
        if($scope.grandtotal !=0){
            $scope.persenbiayabank = 0;
            $scope.biayaBank = 0;
            $scope.payment = [];
            $scope.hitungpayment();
            $scope.setcash();
            if(modalready){
                modalready = false;
                $('#model_payment').modal('show');
            }
        }
  }

  $scope.changemethod = function(sts){
    $scope.stsmethod = sts;
    setTimeout(function(){ $('#kodevoucher').focus(); }, 200);
  }

  //======================== QRIS ======================//
  $scope.koreksiqr = 0;
  $scope.belum_lunasqr = 0;
  $scope.qr = 0;
  $scope.kembalianqr = 0;

  $scope.setqr = function(){
      $scope.stsmethod = 7;
      $scope.qr = 0;
      $scope.Keteranganqr = '';
      $scope.qrproses();
      setTimeout(function(){ $('#Keteranganqr').focus(); }, 200);
  }

  $scope.qrproses = function(){
      $scope.kembalianqr = $scope.qr - $scope.kurangBayar + $scope.koreksiqr;
      $scope.belum_lunasqr = $scope.kurangBayar + $scope.koreksiqr;
  }

  $scope.qroke = function(){
    if($scope.qr <= $scope.kurangBayar){
        if($scope.qr > 0){
            if($scope.kembalian < 0 ){
                $scope.payment.push({
                    jenisPembayaran:'qris' ,
                    JumlahBayar: $scope.qr,
                    Keterangan: $scope.Keteranganqr,
                    IdVoucher:'',
                    SalesPaymentMethodID:6,
                    SalesPaymentMethodDetailID:12,
                    IdBank:'',
                    IdEdc:'',
                    TraceNumber:'',
                    JenisKartu:'',
                    CardHolder:'',
                    NomorKartu:'',
                    TglJatuhTempoOther:'',
                    KeteranganOther:'',
                })
                $scope.cash = 0;
                $scope.hitungpayment()
                $scope.qrproses()
            }else{
                // alert('cek kembali pembayaran')
                Swal.fire({type: 'warning',title: 'cek kembali pembayaran'});
                $scope.bayar();
            }
        }
    }else{
        Swal.fire({type: 'warning',title: 'Tidak boleh melebihi kurang Bayar'})
        // alert('Tidak boleh melebihi kurang Bayar')
    }
  }

//======================== CASH ======================//
    $scope.koreksi1 = 0;
    $scope.belum_lunas1 = 0;
    $scope.cash = 0;
    $scope.kembalian1 = 0;

    $scope.setcash = function(){
        $scope.stsmethod = 1;
        $scope.cash = 0;
        $scope.cashproses();
        setTimeout(function(){ $('#cash').focus(); }, 200);
    }

    $scope.cashproses = function(){
        $scope.kembalian1 = $scope.cash - $scope.kurangBayar + $scope.koreksi1;
        $scope.belum_lunas1 = $scope.kurangBayar + $scope.koreksi1;
    }

    $scope.cashoke = function(){
        if($scope.cash > 0){
            if($scope.kembalian < 0 ){
                $scope.payment.push({
                    jenisPembayaran:'cash' ,
                    JumlahBayar: $scope.cash,
                    Keterangan: '',
                    IdVoucher:'',
                    SalesPaymentMethodID:1,
                    SalesPaymentMethodDetailID:1,
                    IdBank:'',
                    IdEdc:'',
                    TraceNumber:'',
                    JenisKartu:'',
                    CardHolder:'',
                    NomorKartu:'',
                    TglJatuhTempoOther:'',
                    KeteranganOther:'',
                })
                $scope.cash = 0;
                $scope.hitungpayment()
                $scope.cashproses()
            }else{
                // alert('cek kembali pembayaran')
                Swal.fire({type: 'warning',title: 'cek kembali pembayaran'})
                $scope.bayar();
            }
        }
        // else{
        //     if($scope.kembalian < 0 ){
        //         $scope.payment.push({
        //             jenisPembayaran:'cash' ,
        //             JumlahBayar: $scope.grandtotal,
        //             Keterangan: '',
        //             IdVoucher:'',
        //             SalesPaymentMethodID:1,
        //             SalesPaymentMethodDetailID:1,
        //             IdBank:'',
        //             IdEdc:'',
        //             TraceNumber:'',
        //             JenisKartu:'',
        //             CardHolder:'',
        //             NomorKartu:'',
        //             TglJatuhTempoOther:'',
        //             KeteranganOther:'',
        //         })
        //         $scope.cash = 0;
        //         $scope.hitungpayment()
        //         $scope.cashproses()
        //     }
        // }
    }
//=========================== Debit Card ====================
    $scope.kosongkan2 = function(){
        $scope.belumLunas2 = 0;
        $scope.jumlahBayar2 = 0;
        $scope.kodeBank2 ='';
        $scope.namaBank2 = '';
        $scope.EDC2 = '';
        $scope.tracenumber2 = '';
        $scope.namaEDC2='';
        $scope.debitId='';
    }

    $scope.setdebet = function(){
        if($scope.grandtotal < $scope.minimal[0].minimalGesek){
            // alert('minimal gesek kartu debit '+number_format($scope.minimal[0].minimalGesek,0,',','.'));
            Swal.fire({type: 'minimal gesek kartu debit '+number_format($scope.minimal[0].minimalGesek,0,',','.')})
        }else{
            $scope.stsmethod = 2;
            $scope.kosongkan2();
            $scope.belumLunas2 = $scope.kurangBayar
            $scope.jumlahBayar2 = $scope.kurangBayar
            setTimeout(function(){ $('#jumlahBayar2').focus();$("#jumlahBayar2").select(); }, 200);
        }
    }

    $scope.getbankdebit = function(){
        angular.forEach($scope.bank, function(value, key){
            if(value.kodeBank==$scope.kodeBank2){
                $scope.namaBank2=value.namaBank
                $scope.debitId=value.debit
                $('#EDC2').focus();
            }
        })

    }

    $scope.getedcdebit = function(){
        angular.forEach($scope.edc, function(value, key){
            if(value.kodeEdc==$scope.EDC2){
                $scope.namaEDC2=value.namaEdc
                $('#tracenumber2').focus();
            }
        })

    }

    $scope.debitproses = function(){
        if($scope.namaBank2 != ''){
            if($scope.jumlahBayar2 > 0){
                if($scope.kembalian < 0 ){
                    $scope.payment.push({
                        jenisPembayaran             :'debit card '+$scope.namaBank2 ,
                        JumlahBayar                 : $scope.jumlahBayar2,
                        Keterangan                  : $scope.namaBank2+' '+$scope.tracenumber2,
                        IdVoucher                   :'',
                        SalesPaymentMethodID        :4,
                        SalesPaymentMethodDetailID  :$scope.debitId,
                        IdBank                      :$scope.kodeBank2,
                        IdEdc                       :$scope.EDC2,
                        TraceNumber                 :$scope.tracenumber2,
                        JenisKartu                  :'',
                        CardHolder                  :'',
                        NomorKartu                  :'',
                        TglJatuhTempoOther          :'',
                        KeteranganOther             :'',
                    })
                    $scope.hitungpayment()
                    $scope.setdebet()
                }else{
                    Swal.fire({type: 'warning',title: 'cek kembali pembayaran'})
                    // alert('cek kembali pembayaran')
                    $scope.bayar();
                }
            }
        }else{
            Swal.fire({type: 'warning',title: 'belum pillih bank'})
            // alert('belum pilih bank')
        }

    }

//=========================== Kredit ========================
    $scope.kosongkan3 = function(){
        $scope.belumLunas3 = 0;
        $scope.jumlahBayar3 = 0;
        $scope.kodeBank3 ='';
        $scope.namaBank3 = '';
        $scope.EDC3 = '';
        $scope.jenisKartu3 = '';
        $scope.cardHolder3 = '';
        $scope.nomorKartu3 = '';
        $scope.tracenumber3 = '';
        $scope.namaEDC3='';
        $scope.kreditId='';
    }

    $scope.setkredit = function(){
        if($scope.grandtotal < $scope.minimal[1].minimalGesek){
            // alert('minimal gesek kartu kredit '+number_format($scope.minimal[1].minimalGesek,0,',','.'));
            Swal.fire({type: 'warning',title: 'minimal gesek kartu kredit '+number_format($scope.minimal[1].minimalGesek,0,',','.')})
        }else{
            $scope.stsmethod = 3
            $scope.kosongkan3();
            $scope.belumLunas3 = $scope.kurangBayar
            $scope.jumlahBayar3 = $scope.kurangBayar
            setTimeout(function(){ $('#jumlahBayar3').focus();$("#jumlahBayar3").select(); }, 200);
        }
    }

    $scope.getbankkredit = function(){
        angular.forEach($scope.bank, function(value, key){
            if(value.kodeBank==$scope.kodeBank3){
                $scope.namaBank3        = value.namaBank
                $scope.kreditId         = value.kredit
                $scope.persenbiayabank  = value.biaya
                $scope.hitungpayment();
                $scope.belumLunas3 = $scope.kurangBayar
                $scope.jumlahBayar3 = $scope.kurangBayar
                $('#EDC3').focus();
            }
        })
    }

    $scope.getedckredit = function(){
        angular.forEach($scope.edc, function(value, key){
            if(value.kodeEdc==$scope.EDC3){
                $scope.namaEDC3=value.namaEdc
                $('#jenisKartu3').focus();
            }
        })
    }

    $scope.kreditproses = function(){
     if($scope.namaBank3 != ''){
        if($scope.jumlahBayar3 > 0){
            if($scope.kembalian < 0 ){
                $scope.payment.push({
                    jenisPembayaran             : 'kredit card '+$scope.namaBank3,
                    JumlahBayar                 : $scope.jumlahBayar3,
                    Keterangan                  : $scope.namaBank3+' '+$scope.tracenumber3,
                    IdVoucher                   : '',
                    SalesPaymentMethodID        : 5,
                    SalesPaymentMethodDetailID  : $scope.kreditId,
                    IdBank                      : $scope.kodeBank3,
                    IdEdc                       : $scope.EDC3,
                    TraceNumber                 : $scope.tracenumber3,
                    JenisKartu                  : $scope.jenisKartu3,
                    CardHolder                  : $scope.cardHolder3,
                    NomorKartu                  : $scope.nomorKartu3,
                    TglJatuhTempoOther          : '',
                    KeteranganOther             : '',
                })
                $scope.hitungpayment()
                $scope.setkredit()
            }else{
                // alert('cek kembali pembayaran')
                Swal.fire({type: 'warning',title: 'cek kembali pembayaran '});
                $scope.bayar();
            }
        }
     }else{
        //  alert('bank belum di pilih ');
        Swal.fire({type: 'warning',title: 'Bank Belum Di Pillih '});

     }
    }
//==================== other ===================
    $scope.koreksi4 = 0;
    $scope.belumLunas4 = 0;
    $scope.other = 0;
    $scope.kembalian1 = 0;

    $scope.setother = function(){
        if($scope.customer){
            $scope.stsmethod = 4;
            $scope.other = $scope.kurangBayar;
            $scope.otherproses();
            setTimeout(function(){
                $('#other').focus();
                $("#other").select();
            }, 200);
        }else{
            $('#model_payment').modal('hide');
            Swal.fire({type: 'error',title: 'Oops...',text: 'Anda Belum Memilih Customer',})
        }
    }

    $scope.otherproses = function(){
        $scope.belumLunas4 = $scope.kurangBayar + $scope.koreksi4;
    }

    $scope.otheroke = function(){
        if($scope.other){
            $scope.payment.push({
                jenisPembayaran             : 'other' ,
                JumlahBayar                 : $scope.other,
                Keterangan                  : $scope.keteranganOther,
                IdVoucher                   : '',
                SalesPaymentMethodID        : 3,
                SalesPaymentMethodDetailID  : 3,
                IdBank                      : '',
                IdEdc                       : '',
                TraceNumber                 : '',
                JenisKartu                  : '',
                CardHolder                  : '',
                NomorKartu                  : '',
                TglJatuhTempoOther          : $('#jatuhTempo').val(),
                KeteranganOther             : $scope.keteranganOther,
            })
            $scope.hitungpayment()
            $scope.otherproses()
        }
    }

//==================== point ===================
    $scope.pakaiPoint = 0
    $scope.kurangBayar1 = 0
    $scope.setpoint = function(){
        $scope.stsmethod = 6;
        $scope.pakaiPoint = 0;
        $scope.pointproses();
    }

    $scope.pointproses = function(){
        $scope.kurangBayar1 = $scope.kurangBayar - $scope.pakaiPoint
    }

    $scope.pointoke = function(){
        $scope.payment.push({
            jenisPembayaran             : 'point' ,
            JumlahBayar                 : $scope.pakaiPoint,
            Keterangan                  : '',
            IdVoucher                   : '',
            SalesPaymentMethodID        : 0,
            SalesPaymentMethodDetailID  : 0,
            IdBank                      : '',
            IdEdc                       : '',
            TraceNumber                 : '',
            JenisKartu                  : '',
            CardHolder                  : '',
            NomorKartu                  : '',
            TglJatuhTempoOther          : '',
            KeteranganOther             : '',
        })
        $scope.hitungpayment()
    }

//=================== VOUCHER ==========================

    $scope.getvoucher = function(){
        $parm = {
            'voucher':$scope.kodevoucher
        };
        $http.post(API.base_url + '/api_data/offline/getvoucher',$parm).then(function(res){
            item = res.data.data
            if($scope.kembalian < 0 ){
            if(res.data.statusCode==200){
                if(res.data.data==null){
                    // Swal.fire({type: 'error',title: 'Voucher tidak berlaku',text: '',})
                    alert('Voucher tidak berlaku')
                    Swal.fire({type: 'warning',title: 'Voucher Tidak Berlaku'});

                }
                vbarang   = res.data.data.setVoucherDetBarang

                if(vbarang.length==0){
                    var nilaivoucher = 0
                    if(res.data.data.nilai > $scope.totalTransaksi){
                        nilaivoucher = $scope.totalTransaksi
                    }else{
                        nilaivoucher = res.data.data.nilai
                    }

                    $scope.payment.push({
                        jenisPembayaran             : 'voucher' ,
                        JumlahBayar                 : nilaivoucher,//res.data.data.nilai,
                        Keterangan                  : 'VOUCHER '+res.data.data.kodeVoucher+' '+res.data.data.nilai,
                        IdVoucher                   : res.data.data.voucherID,
                        SalesPaymentMethodID        : 2,
                        SalesPaymentMethodDetailID  : 2,
                        IdBank                      : '',
                        IdEdc                       : '',
                        TraceNumber                 : '',
                        JenisKartu                  : '',
                        CardHolder                  : '',
                        NomorKartu                  : '',
                        TglJatuhTempoOther          : '',
                        KeteranganOther             : '',
                    })
                }else{
                    var tot = 0
                    var cek = []
                    var nilaivoucher = 0
                    angular.forEach($scope.detail, function(value, key){
                        cek =  vbarang.filter(function(d) {
                            return d.idBarang == value.id;
                        });

                        if(cek.length!=0){
                            tot = tot + value.total
                            // console.log(cek)
                        }

                    });
                    if(tot==0){
                        Swal.fire({type: 'error',title: 'Voucher tidak berlaku',text: 'karna tidak memenuhi kriteria syarat belanja',})
                    }else{
                        if(tot <= res.data.data.nilai){
                            nilaivoucher = tot
                        }

                        if(tot >= res.data.data.nilai){
                            nilaivoucher = res.data.data.nilai
                        }

                        $scope.payment.push({
                            jenisPembayaran             : 'voucher' ,
                            JumlahBayar                 : nilaivoucher,
                            Keterangan                  : 'VOUCHER '+res.data.data.kodeVoucher+' '+res.data.data.nilai,
                            IdVoucher                   : res.data.data.voucherID,
                            SalesPaymentMethodID        : 2,
                            SalesPaymentMethodDetailID  : 2,
                            IdBank                      : '',
                            IdEdc                       : '',
                            TraceNumber                 : '',
                            JenisKartu                  : '',
                            CardHolder                  : '',
                            NomorKartu                  : '',
                            TglJatuhTempoOther          : '',
                            KeteranganOther             : '',
                        })
                    }
                }
                $scope.kodevoucher=''
                $scope.hitungpayment()
            }else{
                Swal.fire({type: 'error',title: 'Voucher tidak berlaku',text: res.data.message,})
            }
            }else{
                // alert('cek kembali pembayaran')
                Swal.fire({type: 'warning',title: 'cek kembali pembayaran '});
                $scope.bayar();
            }
        })
    }

    //==============================================

    $scope.delpayment= function(idx){
        $scope.payment.splice(idx,1);
        $scope.hitungpayment()
    }

    $scope.hitungpayment = function(){
        $scope.jumlahBayar = 0;

        for(var i = 0; i < $scope.payment.length; i++){
            $scope.jumlahBayar += parseInt($scope.payment[i].JumlahBayar);
        }

        if($scope.persenbiayabank !=0){
            $scope.biayaBank = parseInt(($scope.persenbiayabank/100) * $scope.grandtotal)
        }

        $scope.totalTransaksi = $scope.grandtotal + $scope.biayaBank
        $scope.kurangBayar = $scope.totalTransaksi - $scope.jumlahBayar
        $scope.kembalian = $scope.jumlahBayar - $scope.totalTransaksi
        $scope.kurangBayar = parseInt($scope.kurangBayar)
        //console.log($scope.kembalian)
        if($scope.kurangBayar <= 0 ){
            $scope.kurangBayar = 0
            $scope.bayar();
        }
    }

    $scope.bayar = function(){
        $('#viewpay').modal('show');
    }

    $scope.simpan = async function(){
        if($scope.payment.length==0){
            Swal.fire({icon: 'warning',title: 'jumlah pembayaran belum di isi...',text: ''})
            return false
        }
        if($scope.detail.length==0){
            Swal.fire({icon: 'warning',title: 'Tidak Ada Barang Yang Di Beli...',text: ''})
            return false
        }
        Swal.fire({title: 'Loading..',onOpen: () => {Swal.showLoading()}})
        $scope.transdetail = []
        $scope.JumlahItem = 0
        $scope.Diskondalam = 0
        angular.forEach($scope.detail, function(value, key){
            $scope.JumlahItem = $scope.JumlahItem + parseFloat(value.qty)
            $scope.Diskondalam = $scope.Diskondalam + value.diskon
            $scope.transdetail.push({
                PenjualanID     :0,
                NoUrut          :key+1,
                IdBarang        :value.id,
                kodeBarang      :value.kode,
                namaBarang      :value.name,
                QtyJual         :value.qty,
                KodeSatuan      :value.satuan,
                HargaJual       :value.harga,
                Diskon1         :value.diskon,
                Diskon2         :null,
                SubTotal        :value.total,
                DisplayDiskon1  :value.d1+'%',
                DisplayDiskon2  :null,
            })
        })
        $scope.transpayment = []
        $scope.pakaipoint = 0

        var urut = 1
        angular.forEach($scope.payment, function(value, key){
            if(value.SalesPaymentMethodID != 0 ){
                $scope.transpayment.push({
                    PenjualanID                 : 0,
                    NoUrut                      : urut,
                    jenisPembayaran             : value.jenisPembayaran,
                    JumlahBayar                 : value.JumlahBayar,
                    Keterangan                  : value.Keterangan,
                    IdVoucher                   : value.IdVoucher,
                    SalesPaymentMethodID        : value.SalesPaymentMethodID,
                    SalesPaymentMethodDetailID  : value.SalesPaymentMethodDetailID,
                    IdBank                      : value.IdBank,
                    IdEdc                       : value.IdEdc,
                    TraceNumber                 : value.TraceNumber,
                    JenisKartu                  : value.JenisKartu,
                    CardHolder                  : value.CardHolder,
                    NomorKartu                  : value.NomorKartu,
                    TglJatuhTempoOther          : value.TglJatuhTempoOther,
                    KeteranganOther             : value.KeteranganOther,
                })
                urut++
            }else{
                $scope.pakaipoint = value.JumlahBayar
            }
        })

        promo = [];
        
        angular.forEach($scope.dataPromo, function(value, key){
            promo.push({
                NoUrut          :key+1,
                hadiah          :value.hadiah,
                idPromo         :value.idPromo,
                jml             :value.jml,
                jumlahHadiah    :value.jumlahHadiah,
                kelipatan       :value.kelipatan,
                nilaiPembelian  :value.nilaiPembelian,
                total           :value.total,
            })
        })
        var x = $scope.jumlahBayar.toString().length;
        if(x>9){
            // alert('jumlah bayar tidak boleh terlalu banyak');
            Swal.fire({type: 'warning',title: 'jumlah Bayar Tidak Boleh Terlalu Banyak '});
            Swal.close();
            return false
        }

        $data = {
            "PenjualanID"               : 0,
            "idHold"                    : ($scope.idHold)?$scope.idHold:null,
            "FakturPenjualan"           : "",
            "RefFaktur"                 : "",

            "IdCustomer"                : ($scope.customer)?$scope.customer.idCustomer:null,
            "namaCustomer"              : ($scope.customer)?$scope.customer.namaCustomer:null,
            "kodeCustomer"              : ($scope.customer)?$scope.customer.kodeCustomer:null,
            "jumlahPoint"               : ($scope.customer)?$scope.customer.jumlahPoint:null,
            
            "JumlahItem"                : $scope.JumlahItem,
            "TotalDiskonDalam"          : $scope.Diskondalam,
            "TotalTransaksi"            : $scope.subtotal,
            // "TambahanPointCustomer"     : 0,
            // "TotalPointCustomer"        : 1000,
            // "PakaiPointCustomer"        : $scope.pakaipoint,
            // "AwalTambahPointMember"     : 0,
            // "AkhirTambahPointMember"    : 0,
            // "AwalPakaiPointMember"      : 0,
            // "AkhirPakaiPointMember"     : 0,
            // "TotalTransaksi2"           : $scope.subtotal - $scope.pakaipoint,
            "DiskonLuarNilai"           : $scope.diskon,
            "DiskonLuarPersen"          : 0,
            "OngkosKirim"               : $scope.kirim,
            "Pembulatan"                : 0,
            "TotalTransaksi2"           : $scope.grandtotal,
            "TotalBayar"                : $scope.jumlahBayar,
            "Kembali"                   : $scope.kembalian,
            "BiayaBank"                 : $scope.biayaBank,
            "IsUsingVoucher"            : null,
            "UserEntry"                 : 1,
            "IdPosKasir"                : 1,
            "TransPenjualanDet"         : $scope.transdetail,
            "TransPenjualanDetPayment"  : $scope.transpayment,
            "promoHadiah"               : promo,
        }

        $scope.jml = $scope.detail.length;
        $scope.tot = 0;
        $scope.subtotal = 0;
         for(var i = 0; i < $scope.detail.length; i++){
             $scope.subtotal += parseInt($scope.detail[i].total);
             $scope.tot  += parseInt($scope.detail[i].qty);
         }
        $scope.grandtotal = parseInt($scope.subtotal)+parseInt($scope.kirim)-parseInt($scope.diskon);
        let response = await window.api.simpanTransaksi($data);
        console.log('simpan transaksi',response);
        if(response.succsess){
            Swal.close();
            $scope.kosongsemua();
            window.location.href = `./nota.html?id=${response.data}&print=0`;
        }else{
            Swal.fire({icon: 'error',title: 'Opps....',text: response.message})
        }
        // $http.post(API.base_url + '/api_data/offline/simpan',$data).then(function(res){
        //     // console.log(res)
        //     if(res.data.statusCode=='200'){
        //         // Swal.fire('Data Berhasil Tersimpan!','','success').then(function() {
        //         //     // location.reload();
        //         // });
        //         if(res.data.printer){
        //             Swal.close();
        //             $scope.kosongsemua()
        //         }else{
        //             $scope.kosongsemua()
        //             Swal.fire({
        //                 icon: 'info',
        //                 title: 'Oops...',
        //                 text: 'Printer Sedang Offline!',
        //               }).then(function() {

        //             });
        //         }
        //     }else{
        //         Swal.fire({icon: 'error',title: res.data.title,text: res.data.message,})
        //     }
        // })
    }

    $scope.print_ulang = function(){


    }

    $scope.print = function(){
        if($scope.nofakturprint != ''){
            // Swal.fire({title: 'Loading Printer..',onOpen: () => {Swal.showLoading()}})
            // $http.get(API.base_url + '/api_data/offline/print/'+$scope.nofakturprint).then(function(res){
            //     Swal.close();

            //     if(res.data.statusCode != '200'){
            //         $('#printulang').modal('hide');
            //         Swal.fire({type: 'error',title: 'Oops...',text: res.data.message,})
            //     }
            // })
            window.location.href = './nota.html?id='+$scope.nofakturprint+'&print=1'
        }else{
            window.location.href = './nota.html?id=0&print=0'
            // Swal.fire({title: 'Loading Printer..',onOpen: () => {Swal.showLoading()}})
            // $http.get(API.base_url + '/api_data/offline/printulang').then(function(res){
            //     $('#printulang').modal('hide');
            //     Swal.close();
            // })
        }
    }
//HOLD ==================================================================
    // clik hold
    $scope.hold = function(){
        Swal.fire({
            html: $scope.form,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            preConfirm: async function() {
                $data = {
                            username: $('#username1').val(),
                            password: $('#password1').val(),
                        }

                let response = await window.api.pengawasKasir($data);
                if(response.succsess){
                    $scope.sethold()
                    Swal.close()
                }else{
                    $('#username1').select()
                    $('#error').html(response.message);
                    return false
                }
                return false
            }
        }).then((result)=>{
            setTimeout(function(){
                $('#getproduct').focus()
            }, 500);
        })
        setTimeout(function(){
            $('#username1').focus()
        }, 500);
    }

    // hold transaki simpan di tablehold ->delete temp -> hapus data transksi ->
    $scope.sethold = async function(){
        if($scope.grandtotal != 0){
            Swal.fire({title: 'Loading..',onOpen: () => {Swal.showLoading()}})
            $data = {
                "idHold"         : $scope.idHold,
                "customer"       : $scope.customer,
                "diskon"         : $scope.diskon,
                "kirim"          : $scope.kirim,
                "grandtotal"     : $scope.grandtotal,
                "detail"         : $scope.detail,
                "TotalTransaksi2": $scope.grandtotal,
                "JumlahItem"     : $scope.tot,
                "qty"            : $scope.jml
            }
            let response = await window.api.insertHold($data);
            console.log('insertHold',response);
            if(response.succsess){
                Swal.fire('Transaksi Berhasil Pending!','....','success').then(function() {
                    $scope.deletetemp()
                    $scope.kosongsemua()
                });
            }else{
                Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
            }
        }
    }

    var tableHold = $('#tablehold').DataTable({
        "ordering": false,
        "bFilter": false,
        "bPaginate": false,
        "bInfo": false,
        select: {
          style: 'single'
        },
        keys: {
        keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        columns: [
          { title: "id","data": "id", "className": "text-right" ,visible:false},
          { title: "No Faktur","data": "FakturPenjualan" ,"width":"20px","className": "text-right"},
          { title: "Nama Customer","data": "namaCustomer" },
          { title: "Jam Input","data": "created_at" },
          { title: "Jumlah Item","data": "JumlahItem","className": "text-right", render: $.fn.dataTable.render.number( '.', ',', 0, '' ) },
          { title: "Total Transaksi","data": "TotalTransaksi2","className": "text-right", render: $.fn.dataTable.render.number( '.', ',', 0, '' ) },
      ]
    });

    // Handle event when cell gains focus
    $('#tablehold').on('key-focus.dt', function(e, datatable, cell){
        var data = tableHold.row(cell.index().row).data();
        tableHold.row(cell.index().row).select();
    });

    // Handle click on table cell
    $('#tablehold').on('click', 'tbody td', function(e){
        e.stopPropagation();

        if(tableHold.rows().count()!=0){
            var rowIdx = tableHold.cell(this).index().row;
            $scope.indexdetail = rowIdx;
            // Select row
            tableHold.row(rowIdx).select();
        }

    });

    //========================= INSERT HOLD / BUKA

    $('#tablehold').on('key.dt', function(e, datatable, key, cell, originalEvent){
        if(key === 13 && $scope.stshold==true){
            tableHold.clear().draw() // clear all data di table header hold
            Swal.fire({title: 'Loading..',allowOutsideClick: false,onOpen: () => {Swal.showLoading()}})
            //return false
            $('#listhold').modal('hide');
            getdatahold = $scope.datahold[cell.index().row]
            // console.log(getdatahold)
            tableHold.clear().draw() // clear all data di table header hold

            $scope.customer =getdatahold.customer;
            $scope.diskon =  getdatahold.diskon;
            $scope.kirim =  getdatahold.kirim;
            $scope.idHold = getdatahold.id;
            $scope.detail = [];
            angular.forEach(getdatahold.detail, function(value, key){
                newdata = value
                $scope.detail.push(newdata)
                $scope.inserttemp(newdata)
            })
            
            $scope.deletehold();
            $scope.reloadTable();
            $scope.hitung();
            $scope.$apply();
        }
    });

    $scope.datahold = []

    $scope.stshold = true;

    $scope.tablehold = async function(){
        $scope.stshold = true;
        $('#listhold').modal('show');
        Swal.fire({title: 'Loading..',onOpen: () => {Swal.showLoading()}})
        let response = await window.api.allHold();
        console.log(response);
        if(response.succsess){
            $scope.datahold = response.data
            tableHold.clear().draw()
            // tableHold.rows.add(res.data.data).draw()
            angular.forEach(response.data, function(value, key){
                tableHold.row.add({
                    "id"              : key,
                    "FakturPenjualan" : value.id,
                    "namaCustomer"    : '',
                    "qty"             : value.qty,
                    "created_at"      : '',
                    "JumlahItem"      : value.jumlah,
                    "TotalTransaksi2" : value.total,
                }).draw( )
            })
            Swal.close()
        }else{
            Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
        }
        // $http.get(API.base_url + '/api_data/offline/gethold').then(function(res){
        //     $scope.datahold = res.data.data
        //     tableHold.clear().draw()
        //     // tableHold.rows.add(res.data.data).draw()
        //     angular.forEach(res.data.data, function(value, key){
        //         tableHold.row.add({
        //             "id"              : key,
        //             "FakturPenjualan" : value.FakturPenjualan,
        //             "namaCustomer"    : value.namaCustomer,
        //             "qty"             : value.qty,
        //             "created_at"      : value.created_at,
        //             "JumlahItem"      : value.JumlahItem,
        //             "TotalTransaksi2" : value.TotalTransaksi2,
        //         }).draw( )
        //     })
        //     Swal.close()
        // });

    }

    $("#listhold").on("hidden.bs.modal", function () {
        $scope.stshold = false;
    });

    $scope.kosongsemua = function(){
        $scope.kirim = 0;
        $scope.displaybarang = '';
        $scope.customer = null;
        $scope.detail = []
        $scope.reloadTable();
        $scope.namacustomer = ''
        $scope.JumlahItem = 0
        $scope.Diskondalam = 0
        $scope.subtotal = 0
        $scope.diskon =  0
        $scope.grandtotal =  0
        $scope.idHold = null
        $scope.jml = 0
        $scope.tot = 0
        $('#viewpay').modal('hide');
        $('#model_payment').modal('hide');
        $( "#getproduct" ).focus();
        $scope.customer = null;
        $scope.deletetemp();
        $scope.nobukti();
        $scope.dataPromo = [];
        // $scope.$apply()
    }

    $scope.holdoropen = function(){
        if($scope.detail.length==0){
            $scope.tablehold()
        }else{
            Swal.fire({
                title: 'Apa Kamu Setuju?',
                text: "kamu akan pending transaksi ini!",
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Pending Transaksi!'
              }).then((result) => {
                if (result.value) {
                    $scope.hold()
                }
              })
        }
    }

    $scope.deletehold = async function(){
        $data = {'id' : $scope.idHold}
        let response = await window.api.deleteHold($data);
        if(response.succsess){
            Swal.close();
        }else{
            Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
        }
    }

    $scope.inserttemp = async function(data){
        $data = {
            'data' : data
        }
        let response = await window.api.insertTmp(data);
        console.log('insert-tmp',response);
    }

    $scope.deletetemp = async function(){
        let response = await window.api.deleteAllTmp();
        console.log('insert-tmp',response);
    }

    $scope.edittemp = async function(data){
        $data = {
            'data' : data
        }
        let response = await window.api.editTmp(data);
        console.log('edit-tmp',response);
    }

    $scope.removetemp = async function(data){
        $data = {
            'data' : data
        }
        let response = await window.api.deleteTmp(data);
        console.log('delete-tmp',response);
    }

    $scope.brg = [];

    $scope.gettemp = async () => {
        let response = await window.api.allTmp();
        console.log(response);
        $scope.detail = [];
        angular.forEach(response.data, function(value, key){
            newdata = value
            $scope.detail.push(newdata)
        });
        $scope.hitung();
    }

    $scope.gettemp()

    $scope.sample1 =  function(){
        Swal.fire({
            html: $scope.form,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            preConfirm: async function() {
                $data = {
                            username: $('#username1').val(),
                            password: $('#password1').val(),
                        }
                let response = await window.api.pengawasKasir($data);
                if(response.succsess){
                    Swal.close()
                }else{
                    $('#username1').select()
                    $('#error').html(response.message);
                    return false
                }
                return false
            }
        }).then((result)=>{
            setTimeout(function(){
                $('#getproduct').focus()
            }, 500);
        })
        setTimeout(function(){
            $('#username1').focus()
        }, 500);
    }
    $scope.lastno = ''
    $scope.nobukti = function(){
        // $http.get(API.base_url + '/api_data/offline/nobukti').then(function(res){
        //     // console.log(res.data.data.FakturPenjualan)
        //     $scope.lastno = res.data.data
        // });
    }
    $scope.nobukti();
});