/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', "ojs/ojarraydataprovider", 'ojs/ojknockout',  'ojs/ojnavigationlist', "ojs/ojformlayout", "ojs/ojslider", "ojs/ojinputnumber", "ojs/ojswitch", "ojs/ojbutton","ojs/ojdialog"],
  function (oj, ko, ArrayDataProvider) {
    function ControllerViewModel() {
      var self = this;

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("Applications Cloud UI Theme");

      //For UI Tests
      self.selectedNav = ko.observable("one");

      var navdata = [
        { name: "Selected", id: "one" },
        { name: "Unselected", id: "two" },
        { name: "Disabled", disabled: "true", id: "three" }
      ];
      self.navDataDP = new ArrayDataProvider(navdata, { keyAttributes: "id" })

      self.dialogOpen = function(){
        var dialog = document.getElementById('sampleDialog');
        dialog.open();
      }
      self.dialogClose = function(){
        var dialog = document.getElementById('sampleDialog');
        dialog.close(); 
      }



      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
    }

    return new ControllerViewModel();
  }
);
