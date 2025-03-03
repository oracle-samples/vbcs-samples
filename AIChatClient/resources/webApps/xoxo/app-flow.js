/**
 * Copyright (c)2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "ojs/ojhtmlutils",
  // "https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js"
  ], (
    HtmlUtils,
    // showdown
    ) => {
  'use strict';

  class AppModule {

    convertMarkdownToHTML(mdContent) {
      //
      // commented out is example of how to import and use for example
      // showdown Markdown formatter
      // https://github.com/showdownjs/showdown
      // see above for commented out import statements
      //
      // any other, or none, formatter can be used;
      // this is optional part of the solution
      //
      // return new showdown.Converter().makeHtml(mdContent);
      return mdContent;
    }

    getBindDOMConfigForMarkdownContent(mdContent) {
      let html = this.convertMarkdownToHTML(mdContent);
      const config = {
        view: HtmlUtils.stringToNodeArray(html),
        data: {},
      };
      return config;
    }

  }
  
  return AppModule;
});
