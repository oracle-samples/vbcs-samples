**Name:**

Server Side Processing with Server Sent Events (SSE)

**Description:**

This is an example how to work with SSE events from Visual Builder application. The example comes with simple Node JS based SSE server
example and Visual Builder application client which connects to the SSE server.

The application is Task List where new tasks can be created. These tasks are stored in the SSE backend and the backend simulates that these tasks are long running and it is using Server Sent Events to notify client of tasks' progress. The progress is rendered in the VB application in two ways. Each task has Progress column showing percentage of task completness. And at the top of the app there is progress bar representing overall progress of all actively running tasks.

How this works is that the SSE server is run locally on your laptop (see Setup instructions below) and VB application deployed to a VB instance in the cloud connects to this SSE backend. Which works because VB application page runs in your local browser and it makes direct connection from your browser to your Node JS SSE server litening on localhost port 8080.

**Environment Requirements:**

* VBCS Standalone instance
* recent Node JS runtime installed

**Setup instructions:**

1. Unzip the application zip (sse.zip) locally and navigate in your OS terminal to the sse-server folder from the ZIP file. There is server.js file which is a simple Node JS implementation of SSE backend server.
1. Start the sse server using "node server.js" command 
1. Verify that server has started and printed to your terminal that it is listening on localhost 8080 port
1. Import the application zip (sse.zip) using the application import option into your Visual Builder instance
1. After the import is successful, open the application and run it

**External Dependencies:**

* None

**Compatibility**

* 2310
