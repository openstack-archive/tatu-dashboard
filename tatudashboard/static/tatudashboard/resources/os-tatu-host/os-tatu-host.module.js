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
      'ngRoute',
      'tatudashboard.resources.os-tatu-host.actions',
      'tatudashboard.resources.os-tatu-host.details'
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
    'horizon.app.core.detailRoute',
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-host.api',
    'tatudashboard.resources.os-tatu-host.resourceType',
    'tatudashboard.resources.util'
  ];

  function run(detailRoute,
               registry,
               hostApi,
               resourceTypeString,
               util) {
    var resourceType = registry.getResourceType(resourceTypeString);
    resourceType
      .setNames(gettext('SSH Host'), gettext('SSH Hosts'))
      .setListFunction(listHosts)
      .setProperty('action', {
        label: gettext('Action'),
        values: util.actionMap()
      })
      .setProperty('instance_id', {
        label: gettext('Instance ID')
      })
      .setProperty('hostname', {
        label: gettext('Hostname'),
      })
      .setProperty('proj_id', {
        label: gettext('Project ID'),
      })
      .setProperty('proj_name', {
        label: gettext('Project Name'),
      })
      .setProperty('cert', {
        label: gettext('Certificate')
      })
      .setProperty('pat', {
        label: gettext('IP:Port for PAT')
      })
      .setProperty('srv_url', {
        label: gettext('SRV Record URL')
      })

    resourceType
      .tableColumns
      .append({
        id: 'hostname',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'' + detailRoute + 'OS::Tatu::Host/\' + item.instance_id $}">{$ item.hostname $}</a>'
      })
      .append({
        id: 'proj_name',
        priority: 2,
      })
      .append({
        id: 'pat',
        priority: 2,
      })
      .append({
        id: 'srv_url',
        priority: 2
      });

    resourceType
      .filterFacets
      .append({
        label: gettext('Hostname'),
        name: 'hostname',
        isServer: false,
        singleton: true,
        persistent: false
      })
      .append({
        label: gettext('Project'),
        name: 'proj_name',
        isServer: false,
        singleton: true,
        persistent: false
      });

    function listHosts() {
      return hostApi.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        response.data.items = response.data.hosts;

        util.addTimestampIds(response.data.items, 'updated_at');

        return response;
      });
    }
  }

})();
