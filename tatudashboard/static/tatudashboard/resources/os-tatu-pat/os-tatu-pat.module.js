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

(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @ngname tatudashboard.resources.os-tatu-host
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display SSH (Tatu) host related content.
   */
  angular
    .module('tatudashboard.resources.os-tatu-pat', [
      'ngRoute'
    ])
    .constant(
      'tatudashboard.resources.os-tatu-pat.resourceType', 'OS::Tatu::PAT')
    .config(config)
    .run(run);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'tatudashboard/resources/os-tatu-pat/';
    $provide.constant('tatudashboard.resources.os-tatu-pat.basePath', path);
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-pat.api',
    'tatudashboard.resources.os-tatu-pat.resourceType',
    'tatudashboard.resources.util'
  ];

  function run(registry,
               api,
               resourceTypeString,
               util) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .setNames(gettext('SSH PAT Gateway'), gettext('SSH PAT Gateways'))
      .setListFunction(listPATs)
      .setProperty('ip', {
        label: gettext('IP Address')
      })
      .setProperty('chassis', {
        label: gettext('Assigned Compute Node')
      })
      .setProperty('lport', {
        label: gettext('Neutron Port')
      });

    resourceType
      .tableColumns
      .append({
        id: 'ip',
        priority: 1
      })
      .append({
        id: 'lport',
        priority: 2
      })
      .append({
        id: 'chassis',
        priority: 2
      });


    function listPATs() {
      return api.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        response.data.items = response.data.pats;

        util.addTimestampIds(response.data.items, 'ip');

        return response;
      });
    }
  }

})();
