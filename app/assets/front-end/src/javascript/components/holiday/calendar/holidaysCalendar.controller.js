(() => {

  'use strict';

  angular.module('HRA')
    .controller('holidaysCalendarController', ['$scope', 'Holiday', 'User', '$timeout', 'uiCalendarConfig', function($scope, Holiday, User, $timeout, uiCalendarConfig) {


      $scope.events = {
        events: []
      };

      Holiday.getAll().then((holidays) => {

        User.getAll().then((users) => {
          let holidayObj = {};
          let users_list = users;

          if (holidays) {
            holidays.forEach((holiday) => {

              if (users_list) {
                users_list.forEach((user) => {

                  if (user.id === holiday.user_id) {

                    holidayObj = {
                      title: user.first_name + ' ' + user.last_name,
                      start: holiday.start_date,
                      end: moment(holiday.end_date, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD"),
                      stick: true
                    };

                    $scope.events.events.push(holidayObj);

                  }
                });
              }

            });
          }
        });
      });
      $scope.eventSources = [$scope.events];
      $scope.renderCalender = function(calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      };

      $timeout(function() {
        $scope.renderCalender('myCalendar');
      }, 1000);

      $scope.uiConfig = {
        calendar: {
          height: 900,
          weekends: false,
          header: {
            left: 'title',
            center: '',
            right: 'prev,next'
          }
        }
      };

    }]);

})();
