'use strict';

define([
  'jquery',
  'ojs/ojcore',
  'knockout',
], ($, oj, ko) => {
  class PageModule {
    constructor() {
      // Media Queries for repsonsive header and navigation
      // Create small screen media query to update button menu display
      const smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      this.getNavListRenderer = (template, bReplaceNode) =>
        oj.KnockoutTemplateUtils.getRenderer(template, bReplaceNode);

      // Navigation setup
      const navData = [
        {
          name: 'Partner Program',
          id: 'partner-program',
          iconClass: 'demo-chart-icon-24 demo-icon-font-24 oj-navigationlist-item-icon',
//          iconClass: 'fa fa-youtube-play fa-2x',
        },
        {
          name: 'Partner Finder',
          id: 'partner-finder',
          iconClass: 'demo-fire-icon-24 demo-icon-font-24 oj-navigationlist-item-icon',
        },
        {
          name: 'Partner Registration',
          id: 'partner-apply',
          iconClass: 'demo-catalog-icon-24 demo-icon-font-24 oj-navigationlist-item-icon',
        },
      ];

      this.navDataSource = new oj.ArrayTableDataSource(navData, { idAttribute: 'id' });

      // Footer
      function FooterLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }

      this.footerLinks = ko.observableArray([
        new FooterLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new FooterLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new FooterLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new FooterLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new FooterLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html'),
      ]);
    }
  }

  return new PageModule();
});
