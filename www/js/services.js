angular.module('starter.services', [])

.factory('OffersPop', function() {
  // Might use a resource here that returns a JSON array

  var offersPop = [{
    id: 0,
    icon: 'ion-ios-information',
    title: 'Offre Populaire 1',
    shop: 'Auchan',
    timeout: 'Jours restant : 5',
    reduction: '-40%',
    description: 'Description Offre 1'

  }, {
    id: 1,
    icon: 'ion-ios-information',
    title: 'Offre Populaire 2',
    shop: 'Burger King',
    timeout: 'Jours restant : 2',
    reduction: '-5%',
    description: 'Description Offre 2'
  }, {
    id: 2,
    icon: 'ion-ios-information',
    title: 'Offre Populaire 3',
    shop: 'Jules',
    timeout: 'Jours restant : 4',
    reduction: '-20%',
    description: 'Description Offre 3'
  }];

  return {
    all: function() {
      return offersPop;
    },
    remove: function(offersPop) {
      offers.splice(offers.indexOf(offersPop), 1);
    },
    get: function(offerPopId) {
      for (var i = 0; i < offersPop.length; i++) {
        if (offersPop[i].id === parseInt(offerPopId)) {
          return offersPop[i];
        }
      }
      return null;
    }
  };
})

.factory('Offers', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var offers = [{
    id: 0,
    icon: 'ion-ios-information',
    title: 'Offre 1',
    shop: 'Auchan',
    timeout: 'Jours restant : 5',
    reduction: '-40%',
    description: 'Description Offre 1'

  }, {
    id: 1,
    icon: 'ion-ios-information',
    title: 'Offre 2',
    shop: 'Burger King',
    timeout: 'Jours restant : 2',
    reduction: '-5%',
    description: 'Description Offre 2'
  }, {
    id: 2,
    icon: 'ion-ios-information',
    title: 'Offre 3',
    shop: 'Jules',
    timeout: 'Jours restant : 4',
    reduction: '-20%',
    description: 'Description Offre 3'
  },  {
    id: 3,
    icon: 'ion-ios-information',
    title: 'Offre 4',
    shop: 'H&M',
    timeout: 'Date expiration : 4',
    reduction: '-15%',
    description: 'Description Offre 4'
  }];

  return {
    all: function() {
      return offers;
    },
    remove: function(offers) {
      offers.splice(offers.indexOf(offers), 1);
    },
    get: function(offerId) {
      for (var i = 0; i < offers.length; i++) {
        if (offers[i].id === parseInt(offerId)) {
          return offers[i];
        }
      }
      return null;
    }
  };
})

.factory('MyOffers', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var myoffers = [{
    id: 0,
    icon: 'ion-ios-information',
    title: 'Mon Offre 1',
    shop: 'Auchan',
    timeout: 'Jours restant : 5',
    reduction: '-40%',
    description: 'Description Offre 1'
  },{
    id: 1,
    icon: 'ion-ios-information',
    title: 'Mon Offre 2',
    shop: 'Burger King',
    timeout: 'Jours restant : 5',
    reduction: '-20%',
    description: 'Description Offre 2'
  }];
  return {
    all: function() {
      return myoffers;
    },
    remove: function(myoffers) {
    myoffers.splice(myoffers.indexOf(offers), 1);
    },
    get: function(offerId) {
      for (var i = 0; i < myoffers.length; i++) {
        if (myoffers[i].id === parseInt(myofferId)) {
          return myoffers[i];
        }
      }
      return null;
    }
  };
});
