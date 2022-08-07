/**
 * Created by mkozub on 22.07.2022.
 */

({
    init: function (cmp, event, helper) {
        const getWholesalersAccountsByProductId = cmp.get("c.getWholesalersAccountsByProductId");

        getWholesalersAccountsByProductId.setParams({
            productId: cmp.get("v.recordId")
        });

        getWholesalersAccountsByProductId.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                let values = response.getReturnValue();
                let locations = [];

                values.forEach(val =>{
                    let obj = {
                        location: {
                            City: val.ShippingAddress.city,
                            Country: val.ShippingAddress.country
                        },
                        value: val.Name,
                        icon: 'custom:custom26',
                        title: val.Name
                    };
                    locations.push(obj);
                });


                cmp.set("v.mapMarkers", locations);
            }
            else {
                console.log('Something went wrong with apex function getWholesalersAccountsByProductId');
            }
        });

        $A.enqueueAction(getWholesalersAccountsByProductId);

        cmp.set('v.markersTitle', 'Wholesalers');
    },

    handleMarkerSelect: function (cmp, event, helper) {
        var marker = event.getParam("selectedMarkerValue");
    }
});