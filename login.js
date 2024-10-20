window.api.loginPageMenu();
app.controller("myCtrl", function($scope,$http,API) {
    $scope.username = '';
    $scope.password = '';
    $scope.online = false;
    $scope.platform = '';
    angular.element(window).ready(async function () {
        Swal.fire({title: 'Loading Persiapan Kasir...',onOpen: () => {
            Swal.showLoading()
        }});

        online = await window.api.cekOnline();
        console.log(online);
        if(online.success){
            $scope.online = true;
            kasirs = await window.api.getListKasir();
            if(!kasirs.success){
                Swal.fire({type: 'error',title: 'Oops...',text: kasirs.message});
            }
            console.log(kasirs);
        }else{
            $scope.online = false;
        }
        kasir = await window.api.getKasir();
        console.log(kasir);
        if(!kasir.success){
            window.location.href = './setting.html';
        }
        $scope.platform = await window.api.getPlatform('ok');
        console.log($scope.platform);
        Swal.close();
        $scope.$apply();
    });

    $scope.quit = async function(){
        await window.api.appQuit();
    }

    $scope.setting = async function(){
        await window.api.linkSetting();
    }

    $scope.dev = async function(){
        await window.api.devTools();
    }

    $scope.validator_login = $("#formLogin").validate({
        rules: {
            username: {
                required: !0,
            },
            password: {
                required: !0,
            }
        },
        invalidHandler: function(e, r){

        },
        submitHandler: async function(e){
            Swal.fire({title: 'Loading..',allowOutsideClick: false,onOpen: () => {Swal.showLoading()}})
            let response = await window.api.login({
                username:$scope.username,
                password:$scope.password
            })
            if(response.success){
                Swal.fire('Berhasil Login!','','success').then(async function(){
                    if($scope.online){
                        Swal.fire({title: 'Loading Tarik Data Dari Server...',allowOutsideClick: false,onOpen: () => {Swal.showLoading()}})
                        let data_server = await window.api.updateData();
                        if(data_server.success){
                            window.location.href = './index.html';
                        }else{
                            Swal.fire({type: 'error',title: 'Oops...',text: data_server.message});
                        }
                    }else{
                        window.location.href = './index.html';                        
                    }
                });
            }else{
                Swal.fire({type: 'error',title: '',text: response.message,})
            }
            console.log(response);
            return false;
        }
    });
})
