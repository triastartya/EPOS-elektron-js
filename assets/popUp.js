(function ( $ ) {

    $.fn.popUpGrid = function( options ) {
        this.hasil = [];
        // Default options
        var settings = $.extend({
            title: 'PopUpGrid',
            fidArray: [],
            row: [],
            hasil:[],
            callback: function(res) {
               return res
            },
        }, options );

        // Apply options
        this.click(function() {
          var no_id = '';
          var id='popUpGrid';
          $("#"+id+"_modal").remove();

          var tbl = document.createElement("table");
          tbl.setAttribute("class", "table table-bordered table-css-popup");
          tbl.style='width:100%';
          tbl.setAttribute("id", id+"_table");

          var divbody =document.createElement("div") ;
              divbody.setAttribute("class", "modal-body");
              divbody.appendChild(tbl);

          var divheader =document.createElement("div") ;
              divheader.setAttribute("class", "modal-header");
              divheader.insertAdjacentHTML('beforeend','<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+settings.title+'</h4>');

          var divcontent =document.createElement("div") ;
              divcontent.setAttribute("class", "modal-content");
              divcontent.appendChild(divheader);
              divcontent.appendChild(divbody);

          var divdialog =document.createElement("div") ;
              divdialog.setAttribute("class", "modal-dialog modal-lg");
              divdialog.setAttribute("role", "document");
              divdialog.appendChild(divcontent);

          var divfade = document.createElement("div");
              divfade.setAttribute("class", "modal");
              divfade.setAttribute("id", id+"_modal");
              divfade.setAttribute("tabindex", "-1");
              divfade.setAttribute("role", "dialog");
              divfade.setAttribute("aria-labelledby", "myModalLabel");
              divfade.appendChild(divdialog);

          document.querySelector('body').appendChild(divfade);

          var tableid ='#'+id+"_table";

        //   console.log(settings.fidArray);

          var table = $(tableid).DataTable({
                "scrollX"   : true,
                "scrollY"   :350,
                //"scrollCollapse"  : true,
                select: {

                    style: 'single'
                },
                keys: {
                    keys: [ 13 /* ENTER */,37,39, 38 /* UP */, 40 /* DOWN */ ]
                },
                data: settings.row,
                columns: settings.fidArray,
            });

            // Handle event when cell gains focus
            $(tableid).on('key-focus.dt', function(e, datatable, cell){
                var data = table.row(cell.index().row).data();
                // Select highlighted row
                table.row(cell.index().row).select();
                no_id =cell.index().row;
                this.hasil = data;
                // return this.hasil
            });

            // Handle click on table cell
            $(tableid).on('click', 'tbody td', function(e){
                e.stopPropagation();

                // Get index of the clicked row
                var rowIdx = table.cell(this).index().row;

                // Select row
                table.row(rowIdx).select();
            });

            // Handle key event that hasn't been handled by KeyTable
            $(tableid).on('key.dt', function(e, datatable, key, cell, originalEvent){
                // If ENTER key is pressed
                if(key === 13){
                    // Get highlighted row data
                    $('#'+id+"_modal").modal('hide');
                    items = table.rows('.selected').data()[0];

                    options.callback.call(this,items);
                }
            });

            $(tableid).on('dblclick', 'tbody td', function(e){
                $('#'+id+"_modal").modal('hide');
                items = table.rows('.selected').data()[0];
                options.callback.call(this,items);
            });

            $('#'+id+"_modal").modal('show');

            // setTimeout(function(){
                $(tableid+'_filter label input').focus();
                $('#container').css( 'display', 'block' );
                table.columns.adjust().draw();
            // }, 500);

            $( '#'+id+"_modal" ).on('shown.bs.modal', function(){
                
            })

            $( tableid+'_filter label input' ).keyup(function(event) {
                if(event.which==40){
                    if(no_id==''){
                        $(tableid+' tbody tr td:first').click();
                    }
                }
            });
        });

        return this.hasil;

    };

}( jQuery ));
