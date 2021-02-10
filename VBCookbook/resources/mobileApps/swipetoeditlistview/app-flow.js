/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class AppModule {
    /**
      * Hide spinner screen since the application is ready to display root UI
      */
    hideSpinner() {
      // tear down the spinner screen
      const spinner = document.getElementById('vb-spinner');
      if (spinner) {
        // if the spinner screen is not yet displayed, immediately remove it and return
        const computedStyle = window.getComputedStyle(spinner);
        const opacity = parseInt(computedStyle.getPropertyValue('opacity'), 10);
        if (opacity < 0.1) {
          spinner.parentNode.removeChild(spinner);
          return;
        }

        const transEndFn = () => {
          if (spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
          }
          spinner.removeEventListener('transitionend', transEndFn);
        };

        spinner.addEventListener('transitionend', transEndFn, false);
        spinner.className += ' vb-spinner-reveal-trans';
      }
    }
  }

  return AppModule;
});
