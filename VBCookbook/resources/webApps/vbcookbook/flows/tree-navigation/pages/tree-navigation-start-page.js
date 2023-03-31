/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['knockout',
  'ojs/ojknockout-keyset',
  'ojs/ojarraytreedataprovider'
], function (ko, keySet, ArrayTreeDataProvider) {
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

  };


  return PageModule;
});
