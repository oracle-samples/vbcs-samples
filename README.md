# vbcs-samples Repository

Each directory of this repository represents an example that can be used within Visual Builder Cloud Services (VBCS), with the exception of ApplicationsCloudUITheme which is a JET project used to create a Theme (look and feel) for VBCS to use.

## Layout

```
+ _sample_name_
  + LICENSE.txt
  + README.md
  + resources
  + _sample_name_.zip
```

### LICENSE.txt

The license governs rights to the sample.

### README.md

The readme.md file in each sample describes what the sample does and what you need in order to run it. Any dependencies or prerequisites will be called out in this file. 

### resources directory

The resources directory contains the source code for the sample. This is provided as a convenience in case you just want to browse the code in the git repository without installing the sample.

### _sample_name_.zip

The zip file is the final packaged sample. Download the zip file from this repository. You can then use the "Import" > "Application from File" button in the Visual Builder landing page to load the sample into your Visual Builder environment. Some samples may require additional setup which will be documented in that sample's README.md file.

### other directory

Depending on the sample, there may be additional resources made available in order to facilate use of the sample.

## List of Samples

### ApplicationsCloudUITheme

This is the source code project for a custom SaaS theme for use in JET and VBCS projects. See the README.md file for information on how to generate and install the theme.

### VBCookbook

This is the source code project for VB Cookbook. See the README.md file for information on how to use it.

### DashboardTemplate

This is an example of responsive application with navigation menu bar and a dashboard like page. The application responsively scales from desktop size down to mobile phone size.

## Contributing

This project is not accepting external contributions at this time. For bugs or enhancement requests, please file a GitHub issue unless it’s security related. When filing a bug remember that the better written the bug is, the more likely it is to be fixed. If you think you’ve found a security vulnerability, do not raise a GitHub issue and follow the instructions in our [security policy](./SECURITY.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security vulnerability disclosure process

## License

Copyright (c) 2014, 2023 Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.
