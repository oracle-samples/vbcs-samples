**Name:**

HeatWave GenAI Ask Question application

**Description:**

This application is an example of how to communicate from Visual Builder application with Oracle HeatWave GenAI services as described in the https://blogs.oracle.com/vbcs/post/heatwave-genai-in-vb-application blog post. To use the application read the blog post first to setup HeatWave backend.

**Environment Requirements:**

* VBCS Standalone instance

**Setup instructions:**

1. Import the application zip (heatwave-genai-ask-question.zip) using the application import option
1. After the import is successful, open the application and in Service -> Backends open OCI_Gateway backend,
   switch to Source and update URL with your Ask endpoint
1. If you endpoint is different from /ask you may have to update in similar way also AskQuestion service connection
1. Update names of your DB tables in main-start.html page

**External Dependencies:**

* None

**Compatibility**

* 2304
