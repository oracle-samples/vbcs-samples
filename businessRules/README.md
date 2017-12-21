-- ready for final review --

**Name:**

Business rules

**Description:**

This sample shows a table of expenses, with a Create Expense button linking to a Create page. Business rules are configured so that when a new expense is created, it is auto-approved (the Approved field is set to true) if the expense <= $200 and sends an email to that effect. If the expense is greater than $200, an email notification is sent noting that the expense is pending approval. 

**Environment Requirements:**

* VBCS Standalone instance

**Setup instructions:**

1. Import the sample application zip (BusinessRules.zip) using the application import option
2. After the import is successful, open the application.
3. Go to the Business Objects tab, select the Expenses business object, select the Business Rules tab. On the Triggers tab, click the Auto-Approve expenses trigger. Edit the Send Email Notification actions to set the recipient email address to your email address.
6. Save your changes.
7. Hit the play button to view the expenses table and create a new expense.

**External Dependencies:**

* None

**Compatibility**

* 18.1.1
