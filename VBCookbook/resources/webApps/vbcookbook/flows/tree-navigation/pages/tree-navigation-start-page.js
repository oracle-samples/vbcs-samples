/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['knockout',
  'ojs/ojknockout-keyset',
  'ojs/ojarraytreedataprovider',
  'ojs/ojoffcanvas',
  'ojs/ojresponsiveknockoututils',
  'ojs/ojresponsiveutils'
], function (ko, keySet, ArrayTreeDataProvider, OffCanvasUtils, ResponsiveKnockoutUtils, ResponsiveUtils) {
  'use strict';

  let navigationMenu = [
    {
      "id": "home",
      "label": "Home",
      "icon": "home",
      "node": "parent"
    },
    {
      "id": "gettingstarted",
      "label": "Getting Started",
      "icon": "education",
      "node": "parent",
      "items": [
        {
          "id": "download",
          "label": "Download",
          "icon": "download",
          "badge": 13
        },
        {
          "id": "quickstart",
          "label": "Quick Start",
          "icon": "clock"
        }
      ]
    },
    {
      "id": "cookbook",
      "label": "Cookbook",
      "icon": "book",
      "node": "parent",
      "items": [
        {
          "id": "sample1",
          "label": "Sample 1",
          "icon": "list"
        },
        {
          "id": "sample2",
          "label": "Sample 2",
          "icon": "form-layout",
          "badge": "New"
        }
      ]
    },
    {
      "id": "library",
      "label": "Library",
      "icon": "library",
      "node": "parent",
      "items": [
        {
          "id": "articles",
          "label": "Articles",
          "icon": "custom-article-header"
        },
        {
          "id": "audios",
          "label": "Audios",
          "icon": "music"
        },
        {
          "id": "videos",
          "label": "Videos",
          "icon": "video-block"
        },
        {
          "id": "magazines",
          "label": "Magazines",
          "icon": "library-books"
        }
      ]
    }
  ];

  var PageModule = function PageModule() {
    this.metadata = {
      navigationMenu: navigationMenu
    };
    PageModule.prototype.getMetadata = function () {
      console.log(this.metadata);
      return this.metadata;
    };

    PageModule.prototype.getNavigationContent = function (metadata) {
      if (this.navigationContent === undefined) {
        this.navigationContent = ko.observable(new ArrayTreeDataProvider(
          this._getNavigationData(
            metadata.navigationMenu), {
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
            "node": origMenuItem.node
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

    this.navlistExpanded = new keySet.ObservableKeySet();

    var self = this;

    // If the drawer is open and the page gets resized close it on medium and larger screens
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

  var drawerParams = {
    displayMode: 'overlay',
    selector: '#startDrawer',
    content: '#page'
  };
  PageModule.prototype.toggleDrawer = function () {
    return OffCanvasUtils.toggle(drawerParams);
  };

  PageModule.prototype.animateNavMenu = function () {
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
      container.classList.remove("tree-navigation-menu-out");
    } else {
      container.classList.add("tree-navigation-menu-out");
    }
  };

  /**
   * Hide offcanvas navigation menu
   */
  PageModule.prototype.closeDrawer = function () {
    OffCanvasUtils.close(drawerParams);
  };

  return PageModule;
});
