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
   * @ngname tatudashboard.resources.os-tatu-host-cert
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display SSH (Tatu) host certificate related content.
   */
  angular
    .module('tatudashboard.resources.os-tatu-host-cert', [
      'ngRoute'
    ])
    .constant(
      'tatudashboard.resources.os-tatu-host-cert.resourceType', 'OS::Tatu::HostCert')
    .config(config)
    .run(run);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'tatudashboard/resources/os-tatu-host-cert/';
    $provide.constant('tatudashboard.resources.os-tatu-host-cert.basePath', path);
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'tatudashboard.resources.os-tatu-host-cert.api',
    'tatudashboard.resources.os-tatu-host-cert.resourceType',
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
      .setNames(gettext('Certificate'), gettext('Certificate'))
      .setListFunction(listHostCerts)
      .setProperty('host_id', {
        label: gettext('Host ID')
      })
      .setProperty('hostname', {
        label: gettext('Hostname')
      })
      .setProperty('fingerprint', {
        label: gettext('Fingerprint')
      })
      .setProperty('auth_id', {
        label: gettext('Project/CA ID')
      })
      .setProperty('cert', {
        label: gettext('Host Certificate')
      });

    resourceType
      .tableColumns
      .append({
        id: 'host_id',
        priority: 1
      })
      .append({
        id: 'hostname',
        priority: 2
      })
      .append({
        id: 'fingerprint',
        priority: 2
      })
      .append({
        id: 'auth_id',
        priority: 2
      })
      .append({
        id: 'cert',
        priority: 2,
        filters: [function(input){ return $filter('limitTo')(input, 50, 0); }]
      })


    function listHostCerts() {
      return api.list().then(function onList(response) {
        // listFunctions are expected to return data in "items"
        response.data.items = response.data.certs;

        util.addTimestampIds(response.data.items, 'host_id');

        return response;
      });
    }
  }

})();
