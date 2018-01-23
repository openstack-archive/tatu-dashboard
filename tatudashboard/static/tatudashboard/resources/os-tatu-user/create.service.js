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
    .module('tatudashboard.resources.os-tatu-user.actions')
    .factory('tatudashboard.resources.os-tatu-user.actions.create', action);

  action.$inject = [
    '$q',
    'tatudashboard.resources.os-tatu-user.actions.common-forms',
    'tatudashboard.resources.os-tatu-user.api',
    'tatudashboard.resources.os-tatu-user.resourceType',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.serviceCatalog',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service'
  ];

  /**
   * @ngDoc factory
   * @name tatudashboard.resources.os-tatu-user.actions.create
   *
   * @Description
   * Brings up the Create User modal.
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
    var createUserPolicy, sshServiceEnabled;
    var title = gettext("Generate User Certificate");
    var message = {
      success: gettext('Certificate %s was successfully generated.')
    };

    var service = {
      initScope: initScope,
      allowed: allowed,
      perform: perform
    };

    return service;

    /////////////////

    function initScope() {
      createUserPolicy = policy.ifAllowed({rules: [['ssh', 'create_user_cert']]});
      sshServiceEnabled = serviceCatalog.ifTypeEnabled('ssh');
    }

    function allowed() {
      return $q.all([
        createUserPolicy,
        sshServiceEnabled
      ]);
    }

    function perform() {
      var formConfig = forms.getCreateFormConfig();
      formConfig.title = title;
      return schemaFormModalService.open(formConfig).then(onSubmit, onCancel);
    }

    function onSubmit(context) {
      var userModel = angular.copy(context.model);
      waitSpinner.showModalSpinner(gettext('Creating User SSH Certificate'));
      return api.create(userModel).then(onSuccess, onFailure);
    }

    function onCancel() {
      waitSpinner.hideModalSpinner();
    }

    function onSuccess(response) {
      waitSpinner.hideModalSpinner();
      var user = response.data;
      toast.add('success', interpolate(message.success, [user.serial]));

      // To make the result of this action generically useful, reformat the return
      // from the deleteModal into a standard form
      return {
        created: [{type: resourceTypeName, id: user.serial}],
        updated: [],
        deleted: [],
        failed: []
      };
    }

    function onFailure() {
      waitSpinner.hideModalSpinner();
    }
    /**
     * Return the create User Cert form.
     * @returns {object} a schema form config, including default model
     */
    function getCreateFormConfig() {
      return {
        "schema": {
          "type": "object",
          "properties": {
            "key.pub": {
              "type": "string"
            }
          }
        },
        "form": [
          {
            "key": "key.pub",
            "type": "textarea",
            "title": gettext("SSH Public Key"),
            "description": gettext("The user's SSH public key."),
            "required": true
          }
        ]
      };
    }
  }
})();
