(function() {
  'use strict';

  function StoreObj() {

    var store = {};

    this.setObject = function(oBj) {
      store = oBj;
    };

    this.getObject = function() {
      return store;
    };

  }

  angular.module('HRA')
    .service('StoreObj', StoreObj);

}());
