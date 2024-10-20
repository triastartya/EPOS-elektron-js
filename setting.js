window.api.loginPageMenu();
app.controller("myCtrl", function($scope,$http,API) {
    $scope.list_printer = [];
    $scope.id_kasir = 0;
    $scope.ip_server = '';
    $scope.printer = '';
    $scope.platform = '';
    angular.element(window).ready( async ()=>{
        Swal.fire({title: 'Loading..',onOpen: () => {
            Swal.showLoading()
        }});
        $scope.list_printer = await window.api.getPrinter({
            get:'default'
        });
        console.log($scope.list_printer);
        $scope.platform = await window.api.getPlatform('ok');
        console.log($scope.platform);
        $scope.$apply();
        Swal.close();
    });

    $scope.quit = async function(){
        await window.api.appQuit();
    }

    $scope.login = async function(){
        await window.api.linkLogin();
    }

    $scope.dev = async function(){
        await window.api.devTools();
    }

    $scope.getkasir = async ()=>{
        Swal.fire({title: 'Loading..',onOpen: () => {
            Swal.showLoading()
        }});
        kasir = await window.api.getKasir();
        console.log(kasir);
        if(kasir.success){
            $scope.id_kasir = kasir.data.id_kasir;
            $scope.ip_server = kasir.data.ip_server;
            $scope.printer = kasir.data.printer;
            $scope.$apply();
        }
        Swal.close();
    }

    $scope.getkasir();

    $scope.validator_login = $("#formSetting").validate({
        rules: {
            id_kasir: {
                required: !0,
            }
        },
        invalidHandler: function(e, r){

        },
        submitHandler: async function(e){
            Swal.fire({title: 'Loading..',onOpen: () => {
                Swal.showLoading()
            }});
            let response = await window.api.updateKasir({
                ip_server   :$scope.ip_server,
                id_kasir    :$scope.id_kasir,
                printer     :$scope.printer
            });
            if(response.success){
                Swal.fire('Setting Kasir Berhasil Di Update!','','success')
            }else{
                Swal.fire({type: 'error',title: 'Oops...',text: response.message,})
            }
            return false;
        }
    });
})