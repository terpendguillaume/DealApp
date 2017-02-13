angular.module('starter.controllers', [])

// Menu
.controller('MenuCtrl',function($scope, $ionicSideMenuDelegate){
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
})

//Compte
.controller('AccountCtrl', function($scope, $ionicModal, $ionicPopup, $http) {
    // log in
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
        console.log("window opened");
    });

    // sign Up
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope,
        animation: 'slide-in-up'

    }).then(function(modal) {
        $scope.signupModal = modal;
        console.log("window opened");
    });

    // signUp
    $scope.signUp = function() {
        var email = this.signupData.email;
        var username = this.signupData.username;
        var password = this.signupData.password;

        $http.post("http://localhost:8080/api/signup?email=" + email + "&username=" + username + "&password=" + password + "&seller=false")
        .then(function(response) {
            console.log(response.data);
            if(response.data.success){
                var token = response.data.token;
                setToken(token);
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
                console.log('Vous êtes sûr');
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

// Offres Populaires Details
.controller('OffrePopDetailCtrl', function($scope, $stateParams, $ionicPopup, $http) {
    $http.get("http://localhost:8080/api/vouchers/" + $stateParams.offerPopId)
    .then(function(response) {
        $scope.offerPop = response.data.voucher;

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
})

// Toutes les offres

.controller('OffresCtrl', function($scope, $http) {
    $http.get("http://localhost:8080/api/vouchers")
    .then(function(response) {
        console.log(response.data.vouchers);
        $scope.offers = response.data.vouchers;
    });
})

// Toutes les offres details
.controller('OffreDetailCtrl', function($scope, $stateParams, $ionicPopup, $http) {
    $http.get("http://localhost:8080/api/vouchers/" + $stateParams.offerId)
    .then(function(response) {
        $scope.offer = response.data.voucher;

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
