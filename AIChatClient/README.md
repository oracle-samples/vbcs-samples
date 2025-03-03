**Name:**

AI Chat  application

**Description:**

This application is an example of how to communicate from Visual Builder application with AI services (eg OpenAI)
and implement chat like interface.

**Environment Requirements:**

* VBCS Standalone instance

**Setup instructions:**

1. Import the application zip (ai-chat-client.zip) using the application import option
1. After the import is successful, open the application and in the Service -> Backends open the OpenAI backend,
   switch to the Headers and update the Authorization header in the Secure Headers section to the value of "Bearer <your OpenAI API key value>"
1. Switch to Web Applications -> xoxo and switch to the JavaScript tab. Locate and implement `convertMarkdownToHTML` method to convert AI structured response into rich text.

**External Dependencies:**

* None

**Compatibility**

* 2410
