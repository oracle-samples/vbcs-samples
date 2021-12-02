/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
  define(['knockout',
  'ojs/ojkeyset',
  'ojs/ojarraytreedataprovider',
  'ojs/ojoffcanvas',
  'ojs/ojresponsiveknockoututils',
  'ojs/ojresponsiveutils',
  'text!resources/config/menu.json'
  ], function (ko, keySet, ArrayTreeDataProvider, OffCanvasUtils, ResponsiveKnockoutUtils, ResponsiveUtils, navigationMenuAsText) {
  'use strict';

  var navigationMenu = JSON.parse(navigationMenuAsText);
  
  var PageModule = function PageModule(context) {
    this.eventHelper = context.getEventHelper();
    var self = this; 
    var lgUpQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
    var lgUpScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(lgUpQuery);
    lgUpScreen.subscribe(function (on) {
      if (on) {
        OffCanvasUtils.close(drawerParams);
        self.hideNavMenu(false);
      }
    });

    var mdDownQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_DOWN);
    var mdDownScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdDownQuery);
    mdDownScreen.subscribe(function (on) {
      if (on) {
        self.hideNavMenu(true);
      }
    });

    PageModule.prototype.initNavigationMenu = function (arg1) {
      this.hideNavMenu(mdDownScreen());
    };
  };
  
  PageModule.prototype.getExpandedMenu = function() {
    return new keySet.AllKeySetImpl();
  };

  PageModule.prototype.animateNavMenu = function() {
    let container = document.getElementById("animationMenu");
    if (container.classList.contains("tree-navigation-menu-out")) {
        this.hideNavMenu(true);
    } else {
        this.hideNavMenu(false);
    }
  };
  
  PageModule.prototype.hideNavMenu = function (hide) {
    let container = document.getElementById("animationMenu");
    if (hide) {
      this.eventHelper.fireCustomEvent("application:navMenuVisible", {visible: false});
      container.classList.remove("tree-navigation-menu-out");
    } else {
      this.eventHelper.fireCustomEvent("application:navMenuVisible", {visible: true});
      container.classList.add("tree-navigation-menu-out");
    }
  };

  var drawerParams = {
    displayMode: 'overlay',
    selector: '#startDrawer',
    content: '#page'
  };
  PageModule.prototype.toggleDrawer = function () {
    return OffCanvasUtils.toggle(drawerParams);
  };

    PageModule.prototype.getNavigationContent = function () {
      if (this.navigationContent === undefined) {
        this.navigationContent = ko.observable(new ArrayTreeDataProvider(
          this._getNavigationData(
            navigationMenu), {
          keyAttributes: 'attr.id'
        }));
      }
      return this.navigationContent;
    };

    PageModule.prototype._getNavigationData = function (menu) {
      var navData = [],
      self = this;
      for (var i = 0; i < menu.length; i++) {
        var menuItem = {};
        var origMenuItem = menu[i];
        if (typeof origMenuItem === "object") {
          menuItem["attr"] = {
            "id": origMenuItem.id,
            "name": origMenuItem.label,
            "icon": origMenuItem.icon,
            "badge": origMenuItem.badge,
            "badgeType": origMenuItem.badgeType
          };
        }
        if (origMenuItem.items && origMenuItem.items.length > 0)
          menuItem["children"] = this._getNavigationData(origMenuItem.items);
        navData.push(menuItem);
      }
      return navData;
    };

  PageModule.prototype.itemSelectable = function (context) {
    return context['leaf'];
  }; 

  PageModule.prototype.closeDrawer = function () {
     OffCanvasUtils.close(drawerParams);
  };

  return PageModule;
});