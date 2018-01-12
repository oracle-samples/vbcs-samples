# vbcs-ssamples Repository

Each directory of this repository represents an example that can be used within Visual Builder Cloud Services (VBCS).

## Layout

```
+ _sample_name_
  + resources
  + <sample_name>.zip
  + README.md
  + LICENSE.txt
```

README.md
---

The readme.md file in each sample describes what the sample does and what you need in order to run it. Any dependencies or prerequisites will be called out in this file. 

LICENSE.txt
---

The license governs rights to the sample. 

_sample_name_.zip
---

This zip file can be used in the VB designer from the "Import" button on the landing page to import the sample into your environment. Note that additional set up steps may be required, and if so, they will be noted in the README.md for that sample. 

resources directory
---

The resources directory contains the source code for the sample. This is provided as a convenience in case you just want to browse the code in the git repository without installing the sample.

other
---

Depending on the sample, there may be additional resources made available in order to facilate use of the sample.

## List of Samples

businessRules 
---

This sample shows how server-side triggers and scripting can be used to implement custom business rules in the application.

ContaactsCRUD
---

Simple application with pages for data retrieval (fetch), create, udpdate, and delete operations on a business object. 

drillDownFromList
---

Application demonstrates several techniques for implementing drill down from a list to another page with details from the selected row.

importBosFromExcel
---

This sample demonstrates how business objects can be created from a spreadsheet or csv file.

masterDetailDetail
---

This application presents 3 levels of master-detail on a single page.

navigationTabs
---

Sample application with tabs in the header area used for navigation between pages.

webServiceConsumption
---

This sample shows how to consume an external REST API and create custom UI to interact with the data from that API.
