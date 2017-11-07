-- work in progress --

Each directory of this repository represents an example that can be used within VB.

<sample_name>
+ visual-app
+ data

Within each directory, the contents of the 'visual-app' directory can be imported to an existing
app via the 'import resources' feature of VB.
- from the visual-app folder of the desired app, "zip -r <filename>.zip ."
- create a new app in design-time (or use an existing app; the new web app will be added)
- import the ZIP using 'Import Resources'. Choose the option to delete existing files and resources before import.

Data required for the app (imported into the business objects) are within the 'data' directory.
- from the data folder of the desired app, "zip -r <filename>.zip ."
- go to Business Objects in VB designer and bring up the Data Manager
- choose the 'Import from File' option to import the zipped data file

For content authors producing samples in VB designer:
- use the 'Export Resources' option to produce a zip file of all the resources that should be in the visual-app folder
- use the 'Export All Data' button in the Data Manager to produce a zip file of all the data that should be in the data folder