angular.module('starter.controllers', ['ui.router'])

// Menu
.controller('MenuCtrl',function($scope, $ionicSideMenuDelegate){
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
})

//Compte
.controller('AccountCtrl', function($scope, $ionicModal, $ionicPopup, $http, $window) {
    // log in
    console.log("token : " + token());
    if(getToken()){
        $scope.token = true;
        $scope.user = getToken();
    }
    else{
        $scope.token = false;
    }
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });

    // sign Up
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope,
        animation: 'slide-in-up'

    }).then(function(modal) {
        $scope.signupModal = modal;
    });

    // logIn
    $scope.logIn = function() {
        var emailOrUsername = this.loginData.emailOrUsername;
        var password = this.loginData.password;

        $http.post("http://localhost:8080/api/login?emailOrUsername=" + emailOrUsername + "&password=" + password)
        .then(function(response) {
            console.log(response.data);
            if(response.data.success == true){
                var token = response.data.token;
                setToken(token);
                $window.location.reload(true);
                $scope.loginModal.hide();
                // $route.reload();
            }
        });
    }

    // signUp
    $scope.signUp = function() {
        var email = this.signupData.email;
        var username = this.signupData.username;
        var password = this.signupData.password;

        $http.post("http://localhost:8080/api/signup?email=" + email + "&username=" + username + "&password=" + password + "&seller=false")
        .then(function(response) {
            console.log(response.data);
            if(response.data.success == true){
                var token = response.data.token;
                setToken(token);
                $window.location.reload(true);
                $scope.signupModal.hide();
            }
        });
    }

    // log out
    $scope.showLogout = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Voulez-vous vous déconnecter',
            template: 'Etes-vous sûr de vouloir vous déconnecter ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                deleteToken();
                console.log('Vous êtes sûr');
                $window.location.reload(true);
            } else {
                console.log('Vous n\'êtes pas sûr');
            }
        });
    };

    //  popup de confirmations
    $scope.showSupprimer = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation suppression compte',
            template: 'Etes-vous sûr de vouloir supprimer votre compte ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                $http.delete("http://localhost:8080/api/users/" + getToken().email + "?token=" + token())
                .then(function(response) {
                    console.log(response.data);
                    if(response.data.success == true){
                        deleteToken();
                        $window.location.reload(true);
                        $scope.signupModal.hide();
                        // $route.reload();
                    }
                });
                console.log('Vous êtes sûr');
            } else {
                console.log('Vous n\'êtes pas sûr');
            }
        });
    };

    // version
    $scope.info = {
        platform: ionic.Platform.platform(),
        version: ionic.Platform.version()
    };
})

// Mes offres
.controller('MesOffresCtrl', function($scope, $ionicModal, $ionicPopup, MyOffers) {

    // Ajouter une offre
    $ionicModal.fromTemplateUrl('templates/ajouteroffre.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addOffreModal = modal;
    });

    $scope.myoffers = MyOffers.all();

    //  popup de confirmations
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Supprimer l\'offre',
            template: 'Etes-vous sûr de vouloir supprimer cette offre ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('Vous êtes sûr');
            } else {
                console.log('Vous n\'êtes pas sûr');
            }
        });
    };
})

// Onglet
// Offres Populaires
.controller('PopulairesCtrl', function($scope, $http) {
    $http.get("http://localhost:8080/api/vouchers?top=5")
    .then(function(response) {
        console.log(response.data.vouchers);
        $scope.offersPop = response.data.vouchers;
    });
})

// Toutes les offres

.controller('OffresCtrl', function($scope, $http) {
    $http.get("http://localhost:8080/api/vouchers")
    .then(function(response) {
        $scope.offers = response.data.vouchers;
    });
})

// Offres details
.controller('OffreDetailCtrl', function($scope, $stateParams, $ionicPopup, $http) {
    $http.get("http://localhost:8080/api/vouchers/" + $stateParams.offerId)
    .then(function(response) {
        $scope.offer = response.data.voucher;


        if(getToken()){
            console.log(getToken());
            if(getToken().seller == "true"){
                $scope.client = false;
            }
            else{
                $scope.client = true;
            }
        }
        else{
            $scope.client = false;
        }

        //  popup de confirmations
        $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Sélectionner l\'offre',
                template: 'Etes-vous sûr de vouloir choisir cette offre ?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    console.log('Vous êtes sûr');
                } else {
                    console.log('Vous n\'êtes pas sûr');
                }
            });
        };
    });
});

function token(){
	return window.localStorage.getItem("dealapp-token");
}

function getToken(){
	return parseJwt(token());
}

function setToken(token){
	window.localStorage.setItem("dealapp-token", token);
}

function deleteToken(){
	window.localStorage.removeItem("dealapp-token");
}

function parseJwt (token) {
	if(token){
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
	}
	else{
		return null;
	}
};
