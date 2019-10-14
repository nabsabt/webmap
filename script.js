

var extent = [0,0,1024,968];
var projection = new ol.proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent
  });



////here I define the map, put it in the "map" container. This block
////below is responsible for visualizating the entire map
var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        
        center: ol.proj.fromLonLat([16.382900,48.211381]),
        zoom: 14
        
    }),
    
});

////here I put the base map (OSM) in an object, named "tileLayer"
var tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

////here I put the web map server into a Tile object 
var tileWMS = new ol.layer.Tile({
    soure: new ol.source.TileWMS({
        projection: 'EPSG:4326',
        url: 'http://demo.boundlessgeo.com/geoserver/wms',
        params: {
            'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
        },
        extent: extent,
        projection: projection
    })
});


////here I remove the default zoom-in-out controls from the map
map.getControls().forEach(function(control) {
    if (control instanceof ol.control.Zoom) {
      map.removeControl(control);
    }
  }, this);

////here I create a pre-defined border and street style

var borderStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: "#ffa42e",
        width: 2
        
      })
})

var streetStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#ff0000',
        width: 2
    })
})
////here I create a new vector layer, using GeoJSON, and make it use the 
////pre-defined border style

var vectorMap = new ol.layer.Vector({
    source: new ol.source.Vector({

        url: 'https://openlayers.org/en/v5.1.3/examples/data/geojson/countries.geojson',
        format: new ol.format.GeoJSON(),
        
        extent: extent,
        projection: projection

    }),
    style: borderStyle
});



////here I create another vector layer, and put it in a ol.layer.Vector object, 
////using lines, and a pre-defined style as well
var polylineMap = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://openlayers.org/en/v5.1.3/examples/data/geojson/vienna-streets.geojson',
        format: new ol.format.GeoJSON(),
        extent: extent,
        projection: projection
    }),
    style: streetStyle
    

    
})

////here I add a vector layer (point), the same way I just did

var naturalearth = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '/naturalearth/populated_places.json',
        format: new ol.format.GeoJSON(),
        extent: extent,
        projection: projection
    })
})



////here I add a raster layer (a png-image). I have to geoposition it, and it's recommended
////to set an opacity value, lower than 1, so we can see the layer right under it
var viennaSat = new ol.layer.Image({
    source: new ol.source.ImageStatic({
        url: "becs_raster.png",
        imageSize: [483, 276],
        imageExtent: ol.proj.transformExtent([16.375173, 48.236950, 16.407456, 48.249156], 'EPSG:4326','EPSG:3857')
    }),
    opacity: '0.9'
})

////here I create an object, so the map will show the coordinates of the mouse's 
////current position
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',   
    target: document.getElementById('p_coordinates'),
    undefinedHTML: '&nbsp;'
});

////now I add each and every layer via the objects I created before

map.addLayer(tileLayer);
map.addLayer(tileWMS);
map.addLayer(vectorMap);
map.addLayer(polylineMap);
map.addControl(mousePositionControl);
map.addLayer(naturalearth);
map.addLayer(viennaSat);

////here I create strings, and put the layer names into it.
////this is not neccessary (though strongly recommended) to
////type them accurately from the point of the script, as these strings will just only 
////be represented in a HTML paragraph

var baselayer = 'Geoserver WMS ne:NE1_HR_LC_SR_W_DR';  //this is the tileLayer
var layer_2 = 'countries.geojson';   //this is the vectorMap
var layer_3 = 'vienna-streets.geojson';   // this is the polylineMap
var layer_4 = 'becs_raster.png';  //this is the viennaSat
////now I put the strings into the paragraphs, defined in the HTML

document.getElementById("layer1_value").innerHTML = baselayer;
document.getElementById("layer2_value").innerHTML = layer_2;
document.getElementById("layer3_value").innerHTML = layer_3;
document.getElementById("layer4_value").innerHTML = layer_4;

////now I create variables, which point to the specified checkbox elements

var checkbox_baselayer = document.getElementById('cb1');
var checkbox_layer2 = document.getElementById('cb2');
var checkbox_layer3 = document.getElementById('cb3');
var checkbox_layer4 = document.getElementById('cb4');

////now I add an event listener to each checkbox.
////With these, the user can remove/re-add the layers with a click
checkbox_baselayer.addEventListener('change', function(){
    
    if(this.checked){
        tileLayer.setVisible(true);
        document.getElementById("layer1_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer1_value").style.textDecoration = "none";
    } else {
        tileLayer.setVisible(false);
        document.getElementById("layer1_value").style.color = "red";
        document.getElementById("layer1_value").style.textDecoration = "line-through";
    }
})


checkbox_layer2.addEventListener('change', function(){
    
    if(this.checked){
        vectorMap.setVisible(true);
        document.getElementById("layer2_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer2_value").style.textDecoration = "none";
    } else {
        vectorMap.setVisible(false);
        document.getElementById("layer2_value").style.color = "red";
        document.getElementById("layer2_value").style.textDecoration = "line-through";
    }
})

checkbox_layer3.addEventListener('change', function(){
    
    if(this.checked){
        polylineMap.setVisible(true);
        document.getElementById("layer3_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer3_value").style.textDecoration = "none";
    } else {
        polylineMap.setVisible(false);
        document.getElementById("layer3_value").style.color = "red";
        document.getElementById("layer3_value").style.textDecoration = "line-through";
    }
})

checkbox_layer4.addEventListener('change', function(){
    
    if(this.checked){
        viennaSat.setVisible(true);
        document.getElementById("layer4_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer4_value").style.textDecoration = "none";
    } else {
        viennaSat.setVisible(false);
        document.getElementById("layer4_value").style.color = "red";
        document.getElementById("layer4_value").style.textDecoration = "line-through";
    }
})


var long = 19;
var lat = 47;
var center = [0,12];





function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
  }



////with this controller, the user can re-set the view to the default
////position
onClick('zoomToCenter', function() {
    map.getView().animate({
      center: ol.proj.fromLonLat([16.382900,48.211381]),
      duration: 2000,
      zoom: 14
    });
  });


////here I set two controllers, so the user can zoom in and out

var zoomType;
document.getElementById('zoomIn').onclick = function() {
    zoomType="customZoomIn";
};


document.getElementById('zoomOut').onclick = function(){
    zoomType="customZoomOut";
}




onClick('zoomOut', function(evt) {
    if(zoomType=="customZoomOut"){
         var view = map.getView();
         var zoom = view.getZoom();
         view.setZoom(zoom - 1);
    }

});


onClick('zoomIn', function(evt) {
    if(zoomType=="customZoomIn"){
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
   }
    
});

