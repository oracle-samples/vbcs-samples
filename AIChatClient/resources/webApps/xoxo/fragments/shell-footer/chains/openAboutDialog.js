define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class openAboutDialog extends ActionChain {

    /**
     * Opens About Dialog
     * @param {Object} context
     */
    async run(context) {
      const { $application } = context;

      const callAboutDialogOpenResult = await Actions.callComponentMethod(context, {
        selector: '#aboutDialog',
        method: 'open',
      });
    }
  }

  return openAboutDialog;
});
