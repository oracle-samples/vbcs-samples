/**
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['vb/test/TestUtils'], function(TestUtils) {
  'use strict';

  describe('webApps/vbcookbookshell/flows/patterns-show-ui-when-ready/pages/patterns-show-ui-when-ready-demo-page', function() {

      describe('fetchEmployeeChain', function() {

          it('SuccessPath', async function() {
              const context = await TestUtils.getContext(this);
              const mocks = await TestUtils.getMocks(this);
              const results = await TestUtils.run(this, context, mocks);
              const expectations = await TestUtils.getExpectations(this);
              await TestUtils.verifyExpectations(this, results, expectations);
          });

          it('FailurePath', async function() {
              const context = await TestUtils.getContext(this);
              const mocks = await TestUtils.getMocks(this);
              const results = await TestUtils.run(this, context, mocks);
              const expectations = await TestUtils.getExpectations(this);
              await TestUtils.verifyExpectations(this, results, expectations);
          });

      });

      describe('UpdateEmployeeChain', function() {

          it('SuccessPath', async function() {
              const context = await TestUtils.getContext(this);
              const mocks = await TestUtils.getMocks(this);
              const results = await TestUtils.run(this, context, mocks);
              const expectations = await TestUtils.getExpectations(this);
              await TestUtils.verifyExpectations(this, results, expectations);
          });

          it('FailurePath', async function() {
              const context = await TestUtils.getContext(this);
              const mocks = await TestUtils.getMocks(this);
              const results = await TestUtils.run(this, context, mocks);
              const expectations = await TestUtils.getExpectations(this);
              await TestUtils.verifyExpectations(this, results, expectations);
          });

      });

  });
});
