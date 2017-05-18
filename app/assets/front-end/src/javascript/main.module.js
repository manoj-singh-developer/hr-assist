/*jshint esversion: 6 */

(function() {

  'use strict';

  angular.module('HRA', [
    'ngMaterial',
    'ngMessages',
    'ngFileUpload',
    'md.data.table',
    'ngSelectable',
    'ngSanitize',
    'ngCsv',
    'datePicker',
    'angular-loading-bar',
    'routes',
    'ui.gravatar'
  ]);

  angular
    .module('HRA')
    .constant('apiUrl', 'http://192.168.200.115:3000/api/v1');

}());
