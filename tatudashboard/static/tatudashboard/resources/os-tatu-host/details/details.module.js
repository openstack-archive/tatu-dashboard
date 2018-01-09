/**
 * (c) Copyright 2016 Hewlett Packard Enterprise Development LP
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
   * @ngname tatudashboard.resources.os-tatu-host.details
   *
   * @description
   * Provides details features for hosts.
   */
  angular.module('tatudashboard.resources.os-tatu-host.details',
    ['horizon.framework.conf', 'horizon.app.core'])
    .run(run);

  run.$inject = [
    'tatudashboard.resources.os-tatu-host.resourceType',
    'tatudashboard.resources.os-tatu-host.api',
    'tatudashboard.resources.os-tatu-host.basePath',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function run(
    hostResourceType,
    hostApi,
    basePath,
    registry
  ) {
    var resourceType = registry.getResourceType(hostResourceType);
    resourceType
      .setLoadFunction(loadFunction)
      .setSummaryTemplateUrl(basePath + 'details/drawer.html');

    resourceType.detailsViews
      .prepend({
        id: 'hostDetailsOverview',
        name: gettext('Overview'),
        template: basePath + 'details/overview.html',
      }, 0);

    function loadFunction(identifier) {
      return hostApi.get(identifier);
    }
  }

})();
