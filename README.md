# vbcs-samples Repository

Each directory of this repository represents an example that can be used within Visual Builder Cloud Services (VBCS).

## Layout

```
+ _sample_name_
  + LICENSE.txt
  + README.md
  + resources
  + _sample_name_.ovb
```

### LICENSE.txt

The license governs rights to the sample. 

### README.md

The readme.md file in each sample describes what the sample does and what you need in order to run it. Any dependencies or prerequisites will be called out in this file. 

### resources directory

The resources directory contains the source code for the sample. This is provided as a convenience in case you just want to browse the code in the git repository without installing the sample.

### _sample_name_.ovb

The ovb file is the final packaged sample. Download the ovb file from this repository. You can then use the "Import" button in the Visual Builder landing page to load the sample into your Visual Builder environment. Some samples may require additional setup which will be documented in that sample's README.md file. 

### other directory

Depending on the sample, there may be additional resources made available in order to facilate use of the sample. 

## List of Samples

### businessRules 

This sample shows how server-side triggers and scripting can be used to implement custom business rules in the application.

### ComplexCRUDWithRelationships

This sample explores Many:One and Many:Many relationships and performing CRUD operations on related data.

### ContactsCRUD

Simple application with pages for data retrieval (fetch), create, udpdate, and delete operations on a business object. 

### DaisyChainCombos

This sample shows three cascading combo boxes and how a city selection can be broken down first into selection of continent, then country in that content, and finally city in that country.

### drillDownFromList

Application demonstrates several techniques for implementing drill down from a list to another page with details from the selected row.

### importBosFromExcel

This sample demonstrates how business objects can be created from a spreadsheet or csv file.

### masterDetailDetail

This application presents 3 levels of master-detail on a single page.

### navigationTabs

Sample application with tabs in the header area used for navigation between pages.

### webServiceConsumption

This sample shows how to consume an external REST API and create custom UI to interact with the data from that API.
