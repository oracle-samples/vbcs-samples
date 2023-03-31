/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
    './employee-card-viewModel',
    'ojs/ojcomposite',
    'text!./employee-card-view.html',
    'text!./component.json',
    'css!./employee-card-styles'
], function (
    viewModel,
    Composite,
    view,
    metadata) {
        'use strict';

        Composite.register('employee-card', {
            view: view,
            viewModel: viewModel,
            metadata: JSON.parse(metadata)
        });
    }
);