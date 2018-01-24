/**
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
   * @ngname tatudashboard.resources.os-tatu-user.details
   *
   * @description
   * Provides details features for users.
   */
  angular.module('tatudashboard.resources.os-tatu-user.details',
    ['horizon.framework.conf', 'horizon.app.core'])
    .run(run);

  run.$inject = [
    'tatudashboard.resources.os-tatu-user.resourceType',
    'tatudashboard.resources.os-tatu-user.api',
    'tatudashboard.resources.os-tatu-user.basePath',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function run(
    userResourceType,
    userApi,
    basePath,
    registry
  ) {
    var resourceType = registry.getResourceType(userResourceType);
    resourceType
      .setLoadFunction(loadFunction)
      .setSummaryTemplateUrl(basePath + 'drawer.html');

    function loadFunction(identifier) {
      return userApi.get(identifier);
    }
  }

})();
