/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(
    ['ojs/ojcomposite', './input-text-typeahead-viewModel', 'text!./input-text-typeahead-view.html', 'text!./component.json', 'css!./input-text-typeahead-styles.css'],
    function (Composite, viewModel, view, metadata) {
        'use strict';
        Composite.register('input-text-typeahead',
            {
                view: view,
                viewModel: viewModel,
                metadata: JSON.parse(metadata)
            });
    }
);