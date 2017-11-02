Oracle JET - Google Map Integration Component
====================================================
The **`<ojx-google-map>`** provides a way of embedding Google maps into your application.

In order to use this component you will need to register for a Google Maps API Key [How to Get a Key](https://developers.google.com/maps/documentation/javascript/get-api-key)

## Example
To display a map, simply supply a target address and your API key like this:

``` JavaScript
<ojx-google-map address="200 Oracle Parkway, Redwood Shores" api-key="[[yourAPIKey]]"></ojx-google-map>
```

## Sizing
You can control the size of the map by using the standard CSS height and width values. If you do not specify a fixed size then the map will try and fill the parent container.
However, note that in a flex layout this can be unreliable as the containers may resize after the component is rendered and the map will remain fixed at it's initial size.

## Change History

### 1.0.0
* Initial version with basic functionality