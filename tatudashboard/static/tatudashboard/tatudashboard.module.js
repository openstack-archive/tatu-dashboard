/**
 * (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @ngname tatudashboard
   *
   * @description
   * Provides the services and widgets required
   * to support and display the project search panel.
   */
  angular
    .module('tatudashboard', [
      'ngRoute',
      'tatudashboard.resources'
    ])
    .constant(
      'tatudashboard.apiPassthroughUrl', '/api/ssh/')
    .config(config)
    .run(run);

  config.$inject = [
    '$provide',
    '$routeProvider',
    '$windowProvider'
  ];

  /**
   * @name tatudashboard.basePath
   * @description Base path for the project dashboard
   *
   * @param {function} $provide ng provide service
   *
   * @param {function} $routeProvider ng route service
   *
   * @param {function} $windowProvider NG window provider
   *
   * @returns {undefined}
   */
  function config($provide, $routeProvider, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'tatudashboard/';
    $provide.constant('tatudashboard.basePath', path);

    $routeProvider
      .when('/project/tatu_ca/', {
        templateUrl: path + 'ca.html'
      })
      .when('/project/tatu_user/', {
        templateUrl: path + 'ca.html'
      })
      .when('/project/tatu_host/', {
        templateUrl: path + 'ca.html'
      });
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.basePath'
  ];

  function run(registry, basePath) {
    //registry.setDefaultSummaryTemplateUrl(basePath + 'table/default-drawer.html');
  }

})();
