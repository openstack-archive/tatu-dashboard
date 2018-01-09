/**
 * (c) Copyright 2016 Hewlett Packard Enterprise Development LP
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

(function() {
  'use strict';

  angular
    .module('tatudashboard.resources.os-tatu-host.actions')
    .factory('tatudashboard.resources.os-tatu-host.actions.delete', action);

  action.$inject = [
    '$q',
    'tatudashboard.resources.os-tatu-host.api',
    'tatudashboard.resources.util',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.deleteModalService',
    'horizon.framework.widgets.toast.service',
    'tatudashboard.resources.os-tatu-host.resourceType'
  ];

  /*
   * @ngdoc factory
   * @name tatudashboard.resources.os-tatu-host.actions.delete
   *
   * @Description
   * Brings up the delete host confirmation modal dialog.

   * On submit, delete given host.
   * On cancel, do nothing.
   */
  function action(
    $q,
    hostApi,
    util,
    policy,
    actionResultService,
    gettext,
    $qExtensions,
    deleteModal,
    toast,
    resourceType
  ) {
    var scope, context, deleteHostPromise;
    var notAllowedMessage = gettext("You are not allowed to delete hosts: %s");

    var service = {
      initScope: initScope,
      allowed: allowed,
      perform: perform
    };

    return service;

    //////////////

    function initScope(newScope) {
      scope = newScope;
      context = { };
      deleteHostPromise = policy.ifAllowed({rules: [['ssh', 'delete_host']]});
    }

    function perform(items) {
      var hosts = angular.isArray(items) ? items : [items];
      context.labels = labelize(hosts.length);
      context.deleteEntity = deleteHost;
      return $qExtensions.allSettled(hosts.map(checkPermission)).then(afterCheck);
    }

    function allowed(host) {
      // only row actions pass in host
      // otherwise, assume it is a batch action
      if (host) {
        return $q.all([
          deleteHostPromise,
          util.notDeleted(host),
          util.notPending(host)
        ]);
      } else {
        return policy.ifAllowed({ rules: [['ssh', 'delete_host']] });
      }
    }

    function checkPermission(host) {
      return {promise: allowed(host), context: host};
    }

    function afterCheck(result) {
      var outcome = $q.reject();  // Reject the promise by default
      if (result.fail.length > 0) {
        toast.add('error', getMessage(notAllowedMessage, result.fail));
        outcome = $q.reject(result.fail);
      }
      if (result.pass.length > 0) {
        outcome = deleteModal.open(scope, result.pass.map(getEntity), context).then(createResult);
      }
      return outcome;
    }

    function createResult(deleteModalResult) {
      // To make the result of this action generically useful, reformat the return
      // from the deleteModal into a standard form
      var actionResult = actionResultService.getActionResult();
      deleteModalResult.pass.forEach(function markDeleted(item) {
        actionResult.deleted(resourceType, getEntity(item).id);
      });
      deleteModalResult.fail.forEach(function markFailed(item) {
        actionResult.failed(resourceType, getEntity(item).id);
      });
      return actionResult.result;
    }

    function labelize(count) {
      return {

        title: ngettext(
          'Confirm Delete Host',
          'Confirm Delete Hosts', count),

        message: ngettext(
          'You have selected "%s". Deleted host is not recoverable.',
          'You have selected "%s". Deleted hosts are not recoverable.', count),

        submit: ngettext(
          'Delete Host',
          'Delete Hosts', count),

        success: ngettext(
          'Deleted Host: %s.',
          'Deleted Hosts: %s.', count),

        error: ngettext(
          'Unable to delete Host: %s.',
          'Unable to delete Hosts: %s.', count)
      };
    }

    function deleteHost(host) {
      return hostApi.deleteHost(host, true);
    }

    function getMessage(message, entities) {
      return interpolate(message, [entities.map(getName).join(", ")]);
    }

    function getName(result) {
      return getEntity(result).name;
    }

    function getEntity(result) {
      return result.context;
    }
  }
})();
