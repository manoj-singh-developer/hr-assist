(function(rootTemplatePath) {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraDateSelect
  // ------------------------------------------------------------------------

  // https://www.bennadel.com/blog/2969-passing-ngmodelcontroller-into-a-component-directive-controller-in-angularjs.htm

  angular
    .module('HRA')
    .directive('hraDateSelect', hraDateSelect);

  function hraDateSelect() {

    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: rootTemplatePath + '/_common/dateSelect/dateSelect.view.html',
      require: 'ngModel',

      link: function(scope, elem, attrs, model) {

        scope.val = {};

        var min = scope.min = moment(attrs.min || '1920-01-01');
        var max = scope.max = moment(attrs.max); // Defaults to now

        scope.years = [];

        for (var i = max.year(); i >= min.year(); i--) {

          scope.years.push(i);

        }


        scope.$watch('val.year', function() {

          updateMonthOptions();

        });


        scope.$watchCollection('[val.month, val.year]', function() {

          updateDateOptions();

        });


        scope.$watchCollection('[val.date, val.month, val.year]', function() {

          if (scope.val.year && scope.val.month && scope.val.date) {

            var m = moment([scope.val.year, scope.val.month - 1, scope.val.date]);
            model.$setViewValue(m.format('YYYY-MM-DD'));

          } else {

            model.$setViewValue();

          }

        });


        function updateMonthOptions() {

          // Values begin at 1 to permit easier boolean testing
          scope.months = [];

          var minMonth = scope.val.year && min.isSame([scope.val.year], 'year') ? min.month() : 0;
          var maxMonth = scope.val.year && max.isSame([scope.val.year], 'year') ? max.month() : 11;

          var monthNames = moment.months();

          for (var j = minMonth; j <= maxMonth; j++) {

            scope.months.push({

              name: monthNames[j],
              value: j + 1

            });

          }

          if (scope.val.month - 1 > maxMonth || scope.val.month - 1 < minMonth) {

            delete scope.val.month;

          }
        }


        function updateDateOptions() {

          var minDate, maxDate;

          if (scope.val.year && scope.val.month && min.isSame([scope.val.year, scope.val.month - 1], 'month')) {

            minDate = min.date();

          } else {

            minDate = 1;

          }

          if (scope.val.year && scope.val.month && max.isSame([scope.val.year, scope.val.month - 1], 'month')) {

            maxDate = max.date();

          } else if (scope.val.year && scope.val.month) {

            maxDate = moment([scope.val.year, scope.val.month - 1]).daysInMonth();

          } else {

            maxDate = 31;

          }

          scope.dates = [];

          for (var i = minDate; i <= maxDate; i++) {

            scope.dates.push(i);

          }

          if (scope.val.date < minDate || scope.val.date > maxDate) {

            delete scope.val.date;

          }
        }


        // model -> view
        model.$render = function() {

          if (!model.$viewValue) {

            return;

          }

          var m = moment(model.$viewValue);

          // Always use a dot in ng-model attrs...
          scope.val = {

            year: m.year(),
            month: m.month() + 1,
            date: m.date()

          };

        };


      }

    };


  }

}(rootTemplatePath));
