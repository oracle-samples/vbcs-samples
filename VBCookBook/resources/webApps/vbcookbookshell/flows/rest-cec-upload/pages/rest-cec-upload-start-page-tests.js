/**
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['vb/test/TestUtils'], function(TestUtils) {
    'use strict';

    describe('webApps/vbcookbookshell/flows/rest-cec-upload/pages/rest-cec-upload-start-page', function() {

        describe('PreviewAttachment', function() {

            it('create preview Data URI', async function() {
                const context = await TestUtils.getContext(this);
                const mocks = await TestUtils.getMocks(this);
                const results = await TestUtils.run(this, context, mocks);
                const expectations = await TestUtils.getExpectations(this);
                await TestUtils.verifyExpectations(this, results, expectations);
            });

        });

        describe('UploadFile', function() {

        });

        describe('TakePhotoChain', function() {

            it('wrong file type test', async function() {
                const context = await TestUtils.getContext(this);
                const mocks = await TestUtils.getMocks(this);
                const results = await TestUtils.run(this, context, mocks);
                const expectations = await TestUtils.getExpectations(this);
                await TestUtils.verifyExpectations(this, results, expectations);
            });

            it('file too large', async function() {
                const context = await TestUtils.getContext(this);
                const mocks = await TestUtils.getMocks(this);
                const results = await TestUtils.run(this, context, mocks);
                const expectations = await TestUtils.getExpectations(this);
                await TestUtils.verifyExpectations(this, results, expectations);
            });

            it('upload', async function() {
                const context = await TestUtils.getContext(this);
                const mocks = await TestUtils.getMocks(this);
                const results = await TestUtils.run(this, context, mocks);
                const expectations = await TestUtils.getExpectations(this);
                await TestUtils.verifyExpectations(this, results, expectations);
            });

        });

    });
});