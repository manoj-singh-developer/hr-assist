/* global moment */

angular.module('sbDateSelect', [])

  .directive('sbDateSelect', [function () {

    var template = [
      '<div class="sb-date-select">',

        '<md-select ng-model="val.date">',
          '<md-option ng-repeat="day in dates" ng-value="day"> ',
           '{{ day }}',
          '</md-option>',
        '</md-select>',

        '<md-select ng-model="val.month">',
          '<md-option ng-repeat="month in months" ng-value="month.value"> ',
           '{{ month.name }}',
          '</md-option>',
        '</md-select>',

        '<md-select ng-model="val.year">',
          '<md-option ng-repeat="year in years" ng-value="year"> ',
           '{{ year }}',
          '</md-option>',
        '</md-select>',

      '</div>'
    ];

    return {
      restrict: 'A',
      replace: true,
      template: template.join(''),
      require: 'ngModel',
      scope: {
        selectClass: '@sbSelectClass'
      },
      transclude: true,

      link: function(scope, elem, attrs, model) {
        scope.val = {};

        var min = scope.min = moment(attrs.min || '1900-01-01');
        var max = scope.max = moment(attrs.max); // Defaults to now

        scope.years = [];

        for (var i=max.year(); i>=min.year(); i--) {
          scope.years.push(i);
        }

        scope.$watch('val.year', function () {
          updateMonthOptions();
        });

        scope.$watchCollection('[val.month, val.year]', function () {
          updateDateOptions();
        });

        scope.$watchCollection('[val.date, val.month, val.year]', function () {
          if (scope.val.year && scope.val.month && scope.val.date) {
            var m = moment([scope.val.year, scope.val.month-1, scope.val.date]);
            model.$setViewValue(m.format('YYYY-MM-DD'));
          }
          else {
            model.$setViewValue();
          }
        });

        function updateMonthOptions () {
          // Values begin at 1 to permit easier boolean testing
          scope.months = [];

          var minMonth = scope.val.year && min.isSame([scope.val.year], 'year') ? min.month() : 0;
          var maxMonth = scope.val.year && max.isSame([scope.val.year], 'year') ? max.month() : 11;

          var monthNames = moment.months();

          for (var j=minMonth; j<=maxMonth; j++) {
            scope.months.push({
              name: monthNames[j],
              value: j+1
            });
          }

          if (scope.val.month-1 > maxMonth || scope.val.month-1 < minMonth) delete scope.val.month;
        }

        function updateDateOptions (year, month) {
          var minDate, maxDate;

          if (scope.val.year && scope.val.month && min.isSame([scope.val.year, scope.val.month-1], 'month')) {
            minDate = min.date();
          } else {
            minDate = 1;
          }

          if (scope.val.year && scope.val.month && max.isSame([scope.val.year, scope.val.month-1], 'month')) {
            maxDate = max.date();
          } else if (scope.val.year && scope.val.month) {
            maxDate = moment([scope.val.year, scope.val.month-1]).daysInMonth();
          } else {
            maxDate = 31;
          }

          scope.dates = [];

          for (var i=minDate; i<=maxDate; i++) {
            scope.dates.push(i);
          }

          if (scope.val.date < minDate || scope.val.date > maxDate) delete scope.val.date;
        }

        // model -> view
        model.$render = function() {
          if (!model.$viewValue) return;

          var m = moment(model.$viewValue);

          // Always use a dot in ng-model attrs...
          scope.val = {
            year: m.year(),
            month: m.month()+1,
            date: m.date()
          };
        };
      }
    };
  }]);

