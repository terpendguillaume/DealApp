angular.module('starter.controllers', [])

// Menu
.controller('MenuCtrl',function($scope, $ionicSideMenuDelegate){
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

//Compte
.controller('AccountCtrl', function($scope, $ionicModal, $ionicPopup) {
 // log in
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
.controller('PopulairesCtrl', function($scope, OffersPop) {
   $scope.offersPop = OffersPop.all();
})

// Offres Populaires Details
.controller('OffrePopDetailCtrl', function($scope, $stateParams, $ionicPopup, OffersPop) {
  $scope.offerPop = OffersPop.get($stateParams.offerPopId);

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
})

// Toutes les offres
.controller('OffresCtrl', function($scope, Offers) {
   $scope.offers = Offers.all();
})

// Toutes les offres details
.controller('OffreDetailCtrl', function($scope, $stateParams, $ionicPopup, Offers) {
  $scope.offer = Offers.get($stateParams.offerId);

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
