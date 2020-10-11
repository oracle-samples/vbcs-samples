/**
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['vb/test/TestUtils'], function(TestUtils) {
    'use strict';

    describe('webApps/web/flows/custom-no-records-message/pages/custom-no-records-message-demo-page', function() {

        describe('FilterActionChain', function() {

            it('Test 1', async function() {
                const context = await TestUtils.getContext(this);
                const mocks = await TestUtils.getMocks(this);
                const results = await TestUtils.run(this, context, mocks);
                const expectations = await TestUtils.getExpectations(this);
                await TestUtils.verifyExpectations(this, results, expectations);
            });

        });

    });
});