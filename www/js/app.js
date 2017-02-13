// app.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  //lien html-controller
  $stateProvider

  // Tab
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // offres populaires
  .state('tab.populaires', {
    url: '/populaires',
    views: {
      'tab-populaires': {
        templateUrl: 'templates/tab-populaires.html',
        controller: 'PopulairesCtrl'
      }
    }
  })

  //detail offres populaires
  .state('tab.offrePop-detail', {
    url: '/populaires/:offerId',
    views: {
      'tab-populaires': {
          templateUrl: 'templates/offre-detail.html',
          controller: 'OffreDetailCtrl'
      }
    }
  })

  // toutes les offres
  .state('tab.offres', {
    url: '/offres',
    views: {
      'tab-offres': {
        templateUrl: 'templates/tab-offres.html',
        controller: 'OffresCtrl'
      }
    }
  })

  //detail toutes les offres
  .state('tab.offre-detail', {
    url: '/offres/:offerId',
    views: {
      'tab-offres': {
        templateUrl: 'templates/offre-detail.html',
        controller: 'OffreDetailCtrl'
      }
    }
  })

  // compte perso (sign in/up)
  .state('compte',{
    url: '/compte',
    templateUrl: 'templates/account.html',
    controller: 'AccountCtrl'
  })

  // les offres possédés par le gars
  .state('mesoffres', {
    url: '/mesoffres',
    templateUrl: 'templates/mesoffres.html',
    controller: 'MesOffresCtrl'
  })

  // Echange
  .state('echange', {
    url: '/echange',
    abstract: true,
    templateUrl: 'templates/echange.html'
  })

  // Echange chercher
  .state('echange.chercher', {
    url: '/chercher',
    views: {
      'chercher': {
        templateUrl: 'templates/chercher.html',
        // controller: 'ChercherCtrl'
      }
    }
  })

  // Echange Poster
  .state('echange.poster', {
    url: '/poster',
    views: {
      'poster': {
        templateUrl: 'templates/poster.html',
        // controller: 'PosterCtrl'
      }
    }
  });

  // url apr défauts si mauvaise url
  $urlRouterProvider.otherwise('/tab/populaires');

});
