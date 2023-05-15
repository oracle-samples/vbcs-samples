# Source for the Sample Applications Cloud UI Theme
Version 9.0.0 - Visual Builder 23.07.0 compatible

May 2023

## About
This distribution is a sample UI theme for Oracle JET and Oracle Visual Builder. This provides a look and feel similar to the Oracle SaaS lightBlue theme and can be used as the basis for creating customized themes of your own.

This theme sample currently only contains a web theme.

## Prerequisites
In order to customize or develop new themes you will need to have installed the Oracle JET command line tooling. This involves installing nodejs and the node package manager followed by installation of the JET command line tooling package. The details of the JET installation process can be found in the [JET Developers Guide](https://docs.oracle.com/en/middleware/developer-tools/jet/14.1/develop/getting-started-oracle-javascript-extension-toolkit-jet.html#GUID-6AEB5A00-22D8-4BC1-AAB3-4134F906C1C0)

## Getting Started
Having installed the JET CLI and unpacked this distribution, carry out the following steps:
1. Change to the /ApplicationsCloudUIThemeSource folder within this distribution
2. From your OS prompt, run the command `ojet restore`. *If you get an error at this point please read the __Prerequisites__ section above*
3. Once the restore is complete you can run the command `ojet serve --theme=ApplicationsCloudUI:web` This will run the source application so you can test out changes to the theme if required. It's important that you include the --theme switch in the the above command, this ensures that the correct theme is generated.

## Exporting the Theme for Use in Visual Builder
This theme is already available in Oracle Visual Builder when you create a project using the Oracle SaaS R13 LightBlue application template. So the easiest way to use it is simply to create a new project based on that template.  However, if you have an existing project that requires the theme, or if you decide to customize the theme and need to re-apply it, then carry out the following:
1. Open a command line in theme source folder (/ApplicationsCloudUIThemeSource).
2. Execute the command `ojet build --theme=ApplicationsCloudUI:web --release`  This will ensure that your latest changes will be incorporated into the theme.
3. As a side effect of the `ojet build` command you will find a zip file called **ApplicationsCloudUI-export.zip** in the */deploy* folder.  This file contains the theme assets.

### Adding the theme to Visual Builder
Once you have generated the theme export as above carry out the following steps to add it to your Visual Builder Web Application project:
1. In Visual Builder select the Web Applications icon on the left hand side of the screen and expand the navigator for the application that you want to add the theme to.
2. Expand the */resources* folder
3. Right mouse click on the */css* folder and choose **`import`**
4. Leave the import location as defined and select the *ApplicationsCloudUI-export.zip* from your local disk to upload
5. After import you will see a new folder called *ApplicationsCloudUI*
6. Now select the root WebApp node in the navigator and in the main editor panel select the settings editor panel to being up the settings for the webapp.
7. The Application Settings page will appear. In the selection list labeled as *Theme* choose the option **ApplicationsCloudUI/6.0.0/web/ApplicationsCloudUI.css"

## Using the Theme in Visual Builder
The theme you have just imported will set the broad color palette and other aspects of the look and feel, however, there are two additional tasks you can carry out to retrofit the look of a SaaS application onto your own.

### Adding the Cloud Watermark 
You can add a cloud watermark to the heading of your application using the following steps 
1. With your Web application selected, expand the **root pages** node in the navigator and open the root page for your application. 
2. Using the Page Structure navigator (or the code view) locate the &lt;header&gt; tag.  This should already have a style class of **oj-web-applayout-header** set.
3. Add the extra style class **`ApplicationsCloudUI-watermark`** to this header

e.g. In code:

```
<header role="banner" class="oj-web-applayout-header ApplicationsCloudUI-watermark">
```

### Adding Top Level Navigation  
You can add a top level navigation menu using circular icons as follows
1. With your Web application selected, expand the **root pages** node in the navigator and open the root page for your application. 
2. Using the Page Structure navigator (or the code view) locate the &lt;header&gt; tag.
3. Drop a new **Bar Container** from the component pallet into the Header. Drop it just below the existing header
4. Set the *class* property of the Bar Container to: `oj-flex-item oj-sm-justify-content-center oj-sm-align-items-center oj-flex-bar` The label of the container will change to Flex Container once you have done this.
5. Drag a **Navigation List** component and drop it into the **`middle`** slot of the bar
6. Select the Navigation List component and in the Property inspector *General* tab set the **Edge** property to **`top`**, the **Overflow** property to **`popup`** and the **Center** property to **`relative`**
7. Next select the **Data** tab in the Property Inspector, for this example we'll just add a hardcoded list, so press the + icon by the *Static List* section and add some menu options.  For each one you can press the [+] button in the list and select an icon to display along with the label.
8. Next select the **All** tab for the navigation list Property Inspector and change the **class** property to **`oj-sm-condense oj-navigationlist-stack-icon-label oj-flex-bar-middle oj-sm-justify-content-center`**
9. Switch to the **Code** view for the editor and locate the &lg;oj-navigation-list&gt; tag. Change the **`id`** property from the generated id which will be something like *oj-navigation-list--38590647-1* to the specific value of **`ApplicationsCloudUI-navigation-list-main`**. In design view you will observe that the icons are now larger.
10. (Optional) In code view add the following tag inside of each of your menu option &lt;li&gt; tags, after the &lt;a&gt;...&lt;/a&gt;: **`<span class="ApplicationsCloudUI-menu-selection-indicator"></span>`** This creates the triangle selection marker underneath but should only be used if your Navigation list is the last entry in the header. 

So a typical root page header might look like this in code:

```
  <header role="banner" class="oj-web-applayout-header ApplicationsCloudUI-watermark">
    <div class="oj-web-applayout-max-width oj-flex-bar oj-sm-align-items-center">
      <div class="oj-flex-bar-start">
        <img id="img--38590647-1" :src="{{ $application.path + 'resources/images/oracle-blk.png' }}" alt="oracle logo" height="36px">
      </div>
      <div class="oj-flex-bar-middle oj-sm-align-items-baseline">
        <!-- Logo can go here -->
        <!--img src="" alt="Company Logo"></img-->
        <h1 class="oj-sm-only-hide oj-web-applayout-header-title" title="Application Name">
          <oj-bind-text value="My Application"></oj-bind-text>
        </h1>
      </div>
      <div class="oj-flex-bar-end">
        <oj-toolbar id="toolbar1">
          <oj-menu-button id="userMenu" display="[[$application.responsive.SM_ONLY === false ? 'icons' : 'all']]" chroming="half">
            <oj-bind-text value="[[ $application.user.email ]]"></oj-bind-text>
            <span slot="endIcon" css="oj-component-icon oj-button-menu-dropdown-icon"></span>
            <oj-menu slot="menu" id="menu1" style="display:none">
              <oj-option id="out" value="out">Sign Out</oj-option>
            </oj-menu>
          </oj-menu-button>
        </oj-toolbar>
      </div>
    </div>
    <div class="oj-flex-item oj-sm-justify-content-center oj-sm-align-items-center oj-flex-bar">
      <oj-navigation-list id="ApplicationsCloudUI-navigation-list-main" class="oj-sm-condense oj-navigationlist-stack-icon-label oj-flex-bar-middle oj-sm-justify-content-center" edge="top" overflow="popup">
        <ul>
          <li><a href="#">Home<span class="oj-navigationlist-item-icon vb-icon vb-icon-building"></span></a>
            <span class="ApplicationsCloudUI-menu-selection-indicator"></span>
          </li>
          <li><a href="#">Reporting<span class="oj-navigationlist-item-icon vb-icon vb-icon-line-chart"></span></a>
            <span class="ApplicationsCloudUI-menu-selection-indicator"></span>
          </li>
        </ul>
      </oj-navigation-list>
    </div>
  </header>
```

## Updating the Theme
To make changes to the theme you can edit the following files:
1. **src/themes/ApplicationsCloudUI/common/ApplicationsCloudUI.config.scss** - This file contains the key variables used to define the overall color palette and styling of the theme.  In most cases it will be enough to just change this file.
2. **src/themes/ApplicationsCloudUI/web/_ApplicationsCloudUI.web.settings.scss** - This file contains more detailed configuration of how the variables defined in (1) are used. Consult the JET theming documentation before changing this file.
You can add sample components to index.html for testing. 
Once you have edited the above files as required, use the **`ojet serve --theme=ApplicationsCloudUI:web`** command to run the project and see the effect of your changes in the context of the testing page.

You can make further changes without stopping and restarting the ojet serve command, it will re-deploy your theme as you make changes.  Once you are happy with your updated theme then stop the *ojet serve* command, if it is still running, and follow the steps given in the **Exporting the Theme for Use in Visual Builder** section above.