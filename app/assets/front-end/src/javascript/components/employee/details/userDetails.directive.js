(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraUserDetails
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraUserDetails', hraUserDetails);

  function hraUserDetails() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        'candidate': '='
      },
      controller: 'userDetailsController',
      controllerAs: 'userDetails',
      templateUrl: rootTemplatePath + '/employee/details/userDetails.view.html'
    };
  }

}());
