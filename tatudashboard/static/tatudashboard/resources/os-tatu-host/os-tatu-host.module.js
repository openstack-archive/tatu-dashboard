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
    .module('tatudashboard.resources.os-tatu-host', [
      'ngRoute'
    ])
    .constant(
      'tatudashboard.resources.os-tatu-host.resourceType', 'OS::Tatu::Host')
    .config(config)
    .run(run);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'tatudashboard/resources/os-tatu-host/';
    $provide.constant('tatudashboard.resources.os-tatu-host.basePath', path);
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-host.api',
    'tatudashboard.resources.os-tatu-host.resourceType',
    'tatudashboard.resources.util',
    '$filter'
  ];

  function run(registry,
               api,
               resourceTypeString,
               util,
               $filter) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .setNames(gettext('SSH Host'), gettext('SSH Hosts'))
      .setListFunction(listHosts)
      .setProperty('id', {
        label: gettext('Host ID')
      })
      .setProperty('name', {
        label: gettext('Hostname')
      })
      .setProperty('pat_bastions', {
        label: gettext('PAT Bastions')
      })
      .setProperty('srv_url', {
        label: gettext('SRV Recordset URL')
      });

    resourceType
      .tableColumns
      .append({
        id: 'id',
        priority: 1
      })
      .append({
        id: 'name',
        priority: 2
      })
      .append({
        id: 'srv_url',
        priority: 2
      })
      .append({
        id: 'pat_bastions',
        priority: 2,
        filters: ['noName']
      });

    function listHosts() {
      return api.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        response.data.items = response.data.hosts;

        util.addTimestampIds(response.data.items, 'id');

        return response;
      });
    }
  }

})();
