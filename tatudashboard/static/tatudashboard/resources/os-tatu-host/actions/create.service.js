/**
 *
 * (c) Copyright 2016 Hewlett Packard Enterprise Development Company LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
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

  angular
    .module('tatudashboard.resources.os-tatu-host.actions')
    .factory('tatudashboard.resources.os-tatu-host.actions.create', action);

  action.$inject = [
    '$q',
    'tatudashboard.resources.os-tatu-host.actions.common-forms',
    'tatudashboard.resources.os-tatu-host.api',
    'tatudashboard.resources.os-tatu-host.resourceType',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.serviceCatalog',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service'
  ];

  /**
   * @ngDoc factory
   * @name tatudashboard.resources.os-tatu-host.actions.create
   *
   * @Description
   * Brings up the Create Host modal.
   */
  function action($q,
                  forms,
                  api,
                  resourceTypeName,
                  policy,
                  serviceCatalog,
                  schemaFormModalService,
                  toast,
                  waitSpinner) {
    var createHostPolicy, sshServiceEnabled;
    var title = gettext("Create Host");
    var message = {
      success: gettext('Host %s was successfully created.')
    };

    var service = {
      initScope: initScope,
      allowed: allowed,
      perform: perform
    };

    return service;

    /////////////////

    function initScope() {
      createHostPolicy = policy.ifAllowed({rules: [['ssh', 'create_host']]});
      sshServiceEnabled = serviceCatalog.ifTypeEnabled('ssh');
    }

    function allowed() {
      return $q.all([
        createHostPolicy,
        sshServiceEnabled
      ]);
    }

    function perform() {
      var formConfig = forms.getCreateFormConfig();
      formConfig.title = title;
      return schemaFormModalService.open(formConfig).then(onSubmit, onCancel);
    }

    function onSubmit(context) {
      var hostModel = angular.copy(context.model);
      // schema form doesn't appear to support populating the masters array directly
      // Map the masters objects to simple array of addresses
      if (context.model.hasOwnProperty("masters")) {
        var masters = context.model.masters.map(function (item) {
          return item.address;
        });
        hostModel.masters = masters;
      }

      waitSpinner.showModalSpinner(gettext('Creating Host'));

      return api.create(hostModel).then(onSuccess, onFailure);
    }

    function onCancel() {
      waitSpinner.hideModalSpinner();
    }

    function onSuccess(response) {
      waitSpinner.hideModalSpinner();
      var host = response.data;
      toast.add('success', interpolate(message.success, [host.name]));

      // To make the result of this action generically useful, reformat the return
      // from the deleteModal into a standard form
      return {
        created: [{type: resourceTypeName, id: host.id}],
        updated: [],
        deleted: [],
        failed: []
      };
    }

    function onFailure() {
      waitSpinner.hideModalSpinner();
    }
  }
})();
