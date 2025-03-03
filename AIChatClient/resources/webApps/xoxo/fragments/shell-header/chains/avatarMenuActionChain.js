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

  class avatarMenuActionChain extends ActionChain {

    /**
     * Action Chain to handle menu item selection in the Avatar menu 
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.menuId 
     */
    async run(context, { menuId }) {
      const { $fragment, $application } = context;

      // If one of the theme sub-menu item is selected, fire an application event to change the current theme
      if (menuId.startsWith('theme:')) {
        await Actions.fireEvent(context, {
          event: 'application:changeTheme',
          payload: {
            themeName: menuId.substring(6),
          },
        });
      }
      
    }
  }

  return avatarMenuActionChain;
});
