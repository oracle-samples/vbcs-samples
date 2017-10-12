define(['jquery', 'components/googlemap/prequire'], ($, prequire) => {

  // map of resolved addresses to Longitude/Latitude;
  // CompanyNumber is key; value is {loc, viewport, name, address}
  let resolvedAddresses = {};

  class GoogleMap {
    constructor(context) {
      context.props.then((properties) => {
        //Save the resolved properties for later access
        this.props = properties;
        const mapsModule = 'https://maps.googleapis.com/maps/api/js?key='+this.props.key;
        prequire(mapsModule).then(() => {
            this.sds = properties.datasource;
            this.mapdiv = $(context.element).children('#partners-map');
            if (this.props.height) {
                this.mapdiv.css('height', this.props.height);
            }
            this.map = new google.maps.Map(this.mapdiv[0], { zoom: 4 });
            this.geocoder = new google.maps.Geocoder();
            this.map.setCenter({lat: 37.778866, lng: -95.893914});
            this.markerArray = [];
            this.searchResultTotal = 0;
            this.counter = 0;
            this.currentInfoWindow = false;

            if (this.sds) {
                this.initializeMap();
                this.addListener();
            } else {
                // in this case showOnePartner needs to be called to display one partner
            }
        });
      });
    }

    focusPartner(companyNumber) {
        if (companyNumber && resolvedAddresses[companyNumber] && resolvedAddresses[companyNumber].loc) {
            this.map.setCenter(resolvedAddresses[companyNumber].loc);
       		this.map.fitBounds(resolvedAddresses[companyNumber].viewport);
        } else {
            //alert("This customer's address is invalid and cannot be localed on the map! Company:"+companyNumber);
            this.centerOnSearchResult();
        }
    }


    showOnePartner(partner) {
        this.showLocations([partner]);
    }

    redrawMap() {
        var self = this;
        window.setTimeout(function () {
            google.maps.event.trigger(self.map, 'resize');
            self.centerOnSearchResult();
        }, 321);
    }

    addMarker(data) {
        let self = this;
        let marker = new google.maps.Marker({
            map: self.map,
            position: data.loc
        });
      	this.markerArray.push(marker);
        let infowindow = new google.maps.InfoWindow({content: "<b>" + data.name + "</b><br>"+data.address});
        google.maps.event.addListener(marker, 'click', function () {
            // close existing infowindow if any.
            if (self.currentInfoWindow) {
                self.currentInfoWindow.close();
            }

            self.currentInfoWindow = infowindow;
            infowindow.open(self.map, marker);
        });
    }

    clearMarkers() {
        for (let i = 0; i < this.markerArray.length; i++ ) {
            this.markerArray[i].setMap(null);
        }
        this.markerArray.length = 0;
    };

    getAddressToQuery(data) {
        return ['AddressLineOne', 'City', 'State', 'PostalCode', 'Country'].reduce((currentResult, field) => {
            let value = data[field];
            if (value !== undefined && value !== null && value.length > 0) {
                return currentResult + (currentResult.length > 0 ? ', ' : '') + value;
            } else {
                return currentResult;
            }
        }, '');
    }

    showLocations(data) {
        this.clearMarkers();
        this.searchResultTotal = data.length;
        this.counter = 0;
        for (let index=0; index < data.length; index++) {
            let partnerModel = data[index];
            if (partnerModel !== undefined) {
                let partnerId = partnerModel.CompanyNumber;
                let address = this.getAddressToQuery(partnerModel);
                let partnerName = partnerModel.OrganizationName;
                const callback = this.handleGeoConversion(partnerId, address, partnerName);
                if (address !== undefined && partnerId !== undefined && resolvedAddresses[partnerId] === undefined) {
                    //console.log('Geocoding for partner: ' + partnerName + ' current time is: ' + new Date().getTime());
                    this.geocoder.geocode({'address': address}, callback);
                } else {
                    callback([resolvedAddresses[partnerId]], 'ALREADY_RESOLVED_LOCALLY');
                }
            }
        }
    };

    handleGeoConversion(partnerId, address, partnerName) {
        let self = this;
        return function (results, status) {
            if (status === 'OK') {
                //console.log('address: ' + address + ' has long/lat: ' + results[0].geometry.location);
                let data = {
                    loc: results[0].geometry.location,
                    viewport: results[0].geometry.viewport,
                    name : partnerName,
                    address: address
                };
                resolvedAddresses[partnerId] = data;
                self.addMarker(data);
            } else if (status === 'ALREADY_RESOLVED_LOCALLY') {
                if (results[0].loc !== undefined) {
                    self.addMarker(results[0]);
                }
            } else {
                resolvedAddresses[partnerId] = {
                    name : partnerName,
                    address: address
                };
                console.log('no address for: ' + address + ' (' + status+', '+partnerName+')');
            }
            self.counter ++;
            if ( self.searchResultTotal === self.counter) {
                // done with all markers
                // recenter map based on search results
                self.centerOnSearchResult();
            }
        }
    }

    centerOnSearchResult() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markerArray.length; i++) {
            bounds.extend(this.markerArray[i].getPosition());
        }
        if (this.markerArray.length === 0) {
            // no markers on map, center the US map
            this.map.setCenter({lat: 37.778866, lng: -95.893914});
            this.map.setZoom(4);
        } else {
            this.map.setCenter(bounds.getCenter());
            google.maps.event.addListenerOnce(this.map, 'bounds_changed', function(event) {
                if (this.getZoom() > 15) {
                    this.setZoom(15);
                }
            });
          this.map.fitBounds(bounds);
        }
    }


    initializeMap() {
        const self = this;
        this.sds.fetch().then(function(d) {
            self.showLocations(d.data);
        });
    }

    addListener() {
        const self = this;
        // when List changes filter criteria this even is fired and map
        // needs to refetched partners to display too.
        // FIXME: review whether this is the best approach
        this.sds.on('reset', function(a) {
            self.initializeMap();
        });
    }

  }

  return GoogleMap;
});