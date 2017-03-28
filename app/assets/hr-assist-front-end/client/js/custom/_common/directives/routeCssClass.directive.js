(function() {

  'use strict';

  // hraRouteCssClass directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraRouteCssClass', hraRouteCssClass);

  hraRouteCssClass
    .$inject = ['$rootScope'];

  function hraRouteCssClass($rootScope) {

    return ({

      restrict: 'A',
      scope: {},
      link: function(scope, elem) {

        $rootScope.$on('$stateChangeSuccess', addCustomClass);

        addCustomClass
          .$inject = ['event', 'toState', 'toParams', 'fromState'];

        function addCustomClass(event, toState, toParams, fromState) {

          var fromClassnames = angular.isDefined(fromState.data) && angular.isDefined(fromState.data.cssClassNames) ? fromState.data.cssClassNames : null;
          var toClassNames = angular.isDefined(toState.data) && angular.isDefined(toState.data.cssClassNames) ? toState.data.cssClassNames : null;

          // don't do anything if they are the same
          if (fromClassnames !== toClassNames) {

            if (fromClassnames) {

              elem.removeClass(fromClassnames);

            }

            if (toClassNames) {

              elem.addClass(toClassNames);

            }

          }

        }

      }

    });

  }

}());
