/**
 * PWS Tabs jQuery Plugin
 * Author: Alex Chizhov
 * Author Website: http://alexchizhov.com/pwstabs
 * GitHub: https://github.com/alexchizhovcom/pwstabs
 * Version: 1.2.1
 * Version from: 23.01.2015
 * Licensed under the MIT license
 */
;
(function ($, window, document, undefined) {

    var pluginName = "popUpCustomer",
        defaults = {
            title: "popUpCustomer",
            url:'',
            fidArray: [],
            row: [],
            data: [],
            callback: function(res) {
                return res
            },
            tutup: function(res){
                 return res
            }
        };

    function Plugin(element, options) {

        this.element = $(element);
        this.$elem = $(this.element);
        this._name = pluginName;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;

        return this.init();
    };

    Plugin.prototype = {

        options: function (option, val) {
            this.settings[option] = val;
        },

        // Constructing Tabs Plugin
        init: function () {
            this.$elem.on('click', {
                popOptions: this.settings
            }, function (e) {

                e.preventDefault(); // Prevent use of href attribute

                var $settings = e.data.popOptions;

                var no_id = '';
                var column_db = 'namaCustomer';
                var iscari = true;
                var database = [];

                var id='popUpCustomer';
                $("#"+id+"_modal").remove();

                var tbl = document.createElement("table")
                    tbl.setAttribute("class", "table table-bordered widthall table-css-popup")
                    tbl.style='width:100%'
                    tbl.setAttribute("id", id+"_table")
                var label = document.createElement("h3")
                    label.setAttribute("id","labelcustomer")
                var input = document.createElement("input")
                    input.setAttribute("type","text")
                    input.setAttribute("id","caricustomer")
                    input.setAttribute("class","form-control caricustomer")

                var divbody =document.createElement("div")
                    divbody.setAttribute("class", "modal-body")
                    divbody.appendChild(label)
                    divbody.appendChild(input)
                    divbody.appendChild(tbl)

                var divheader =document.createElement("div")
                    divheader.setAttribute("class", "modal-header")
                    // divheader.insertAdjacentHTML('beforeend','<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+$settings.title+'</h4>');
                    divheader.insertAdjacentHTML('beforeend',`
                        <h5 class="modal-title">${$settings.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    `);
                    
                var divcontent =document.createElement("div")
                    divcontent.setAttribute("class", "modal-content")
                    divcontent.appendChild(divheader)
                    divcontent.appendChild(divbody)

                var divdialog =document.createElement("div")
                    divdialog.setAttribute("class", "modal-dialog modal-lg modal-dialog-scrollable")
                    divdialog.setAttribute("role", "document")
                    divdialog.appendChild(divcontent)

                var divfade = document.createElement("div")
                    divfade.setAttribute("class", "modal")
                    divfade.setAttribute("id", id+"_modal")
                    divfade.setAttribute("tabindex", "-1")
                    divfade.setAttribute("role", "dialog")
                    divfade.setAttribute("aria-labelledby", "myModalLabel")
                    divfade.appendChild(divdialog)

                document.querySelector('body').appendChild(divfade);
                $('#labelcustomer').html('Cari Berdasarkan Nama Customer');

                var tableid ='#'+id+"_table";
                
                var table = $(tableid).DataTable({
                    "ordering": false,
                    "bFilter": false,
                    // "bPaginate": false,
                    "pageLength": 8,
                    "bInfo": false,
                    select: {
                        style: 'single'
                    },
                    keys: {
                        keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */,8 ]
                    },
                    columns:[
                        { title: "Kode",            "data": "kodeCustomer" },
                        { title: "Nama",            "data": "namaCustomer" },
                        { title: "Alamat",          "data": "alamatCustomer"},
                        { title: "Kota",            "data": "kota" },
                        { title: "No HP",           "data": "no_handphone" },
                        { title: "idCustomer",      "data": "idCustomer",visible:false },
                    ],
                });

                $(tableid).on('key-focus.dt', function(e, datatable, cell){
                    var data = table.row(cell.index().row).data();
                    table.row(cell.index().row).select();
                    no_id =cell.index().row;
                    this.hasil = data;
                });

                $(tableid).on('click', 'tbody td', function(e){
                    e.stopPropagation();
                    var rowIdx = table.cell(this).index().row;
                    table.row(rowIdx).select();
                });

                $(tableid).on('key.dt', function(e, datatable, key, cell, originalEvent){
                    if(key === 13){
                        if(iscari){
                            $('#'+id+"_modal").modal('hide');
                            items = table.rows('.selected').data()[0];
                            resdata =  database.filter(function(d) {
                                return d.idCustomer == items.idCustomer;
                            });
                            $settings.callback.call(this,resdata[0]);
                        }
                    }
                    if( key == 8){
                        // key.preventDefault();
                        table.row('.selected').deselect();
                        $("#caricustomer").prop('disabled', false);
                        $('#caricustomer').focus();
                        iscari=false
                    }
                });

                $(tableid).on('dblclick', 'tbody td', function(e){
                    $('#'+id+"_modal").modal('hide');
                    items = table.rows('.selected').data()[0];
                    resdata =  database.filter(function(d) {
                        return d.idCustomer == items.idCustomer;
                    });
                    $settings.callback.call(this,resdata[0]);
                });

                $('#'+id+"_modal").modal('show');

                $( tableid+'_filter label input' ).keyup(function(event) {
                    if(event.which==40){
                        if(no_id==''){
                            $(tableid+' tbody tr td:first').click();
                        }
                    }
                });
                $( "#caricustomer" ).keyup(async function(event) {
                    if ( event.which === 13 ) {
                        Swal.fire({title: 'Loading..',onOpen: () => {Swal.showLoading()}})
                        const res = await window.api.getDataMember({
                            cari    : $("#caricustomer").val(),
                            key     : column_db
                        });
                        console.log(res);
                        database = res
                        table.clear().draw();
                        table.rows.add(database).draw();
                        Swal.close();
                        if(res.length != 0){
                            $("#caricustomer").prop('disabled', true);
                            $(tableid+' tbody tr td:first').click();
                            iscari=true
                        }
                        return false;
                    }
                    console.log(event.which)
                    if(event.which == 117){
                        event.preventDefault();
                        $('#labelcustomer').html('Cari Berdasarkan Nama Customer');
                        column_db = 'namaCustomer'
                    }
                    if(event.which == 118){
                        event.preventDefault();
                        $('#labelcustomer').html('Cari Berdasarkan Kode Customer');
                        column_db = 'kodeCustomer'
                    }
                    if(event.which == 119){
                        event.preventDefault();
                        $('#labelcustomer').html('Cari Berdasarkan Alamat');
                        column_db = 'alamatCustomer'
                    }
                });
                $( '#'+id+"_modal" ).on('hidden.bs.modal', function(){
                    $('#'+id+"_modal").modal('hide');
                    $settings.tutup.call('tutup');
                })
                $( '#'+id+"_modal" ).on('shown.bs.modal', function(){
                    //$('#caricustomer').focus();
                })

                $( "#caricustomer" ).on( "click", function() {
                    if(iscari){
                        table.row('.selected').deselect();
                        $("#caricustomer").prop('disabled', false);
                        $('#caricustomer').focus();
                        iscari=false
                    }
                });
                $('#caricustomer').focus();
            });

        } // Init function END

    };

    $.fn[pluginName] = function (options) {

        // get the arguments
        var args = $.makeArray(arguments),
            after = args.slice(1);

        return this.each(function () {

            // see if we have an instance
            var instance = $.data(this, pluginName);

            if (instance) {
                if (instance[options]) {
                    instance[options].apply(instance, after);
                } else {
                    $.error('Method ' + options + ' does not exist on Plugin');
                }
            } else {
                // create the plugin
                var plugin = new Plugin(this, options);

                // Store the plugin on the element
                $.data(this, pluginName, plugin);
                return plugin;
            }
        });
    }


})(jQuery, window, document);
