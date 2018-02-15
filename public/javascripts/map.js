function startMap() {

// --- Map initialization
    var map = new google.maps.Map(
    document.getElementById('map'),
      {
        zoom: 13,
      }
    );

// --- Put a marker on the map for every property belonging to the user
  var locationStats = document.getElementsByClassName('location_stats');
  for (var i=0; i < locationStats.length; i++) {
    let latitude = parseFloat(locationStats[i].childNodes[1].innerText);
    let longitude = parseFloat(locationStats[i].childNodes[4].innerText);
    let marker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map,
      title: "Property"
    });
  }

  var GeoMarker = new GeolocationMarker(map);

// --- user geocalization
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }

}

// --- use a blue bubble for user position
(function(){
  /*
   geolocation-marker version 2.0.5
   @copyright 2012, 2015 Chad Killingsworth
   @see https://github.com/ChadKillingsworth/geolocation-marker/blob/master/LICENSE.txt
  */
  'use strict';var b;function e(a,c){function f(){}f.prototype=c.prototype;a.B=c.prototype;a.prototype=new f;a.prototype.constructor=a;for(var g in c)if("prototype"!=g)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(c,g);d&&Object.defineProperty(a,g,d)}else a[g]=c[g]}
  function h(a,c,f,g){var d=google.maps.MVCObject.call(this)||this;d.c=null;d.b=null;d.a=null;d.i=-1;var l={clickable:!1,cursor:"pointer",draggable:!1,flat:!0,icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#C8D6EC",fillOpacity:.7,scale:12,strokeWeight:0},position:new google.maps.LatLng(0,0),title:"Current location",zIndex:2},m={clickable:!1,cursor:"pointer",draggable:!1,flat:!0,icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#4285F4",fillOpacity:1,scale:6,strokeColor:"white",strokeWeight:2},
  optimized:!1,position:new google.maps.LatLng(0,0),title:"Current location",zIndex:3};c&&(l=k(l,c));f&&(m=k(m,f));c={clickable:!1,radius:0,strokeColor:"1bb6ff",strokeOpacity:.4,fillColor:"61a0bf",fillOpacity:.4,strokeWeight:1,zIndex:1};g&&(c=k(c,g));d.c=new google.maps.Marker(l);d.b=new google.maps.Marker(m);d.a=new google.maps.Circle(c);google.maps.MVCObject.prototype.set.call(d,"accuracy",null);google.maps.MVCObject.prototype.set.call(d,"position",null);google.maps.MVCObject.prototype.set.call(d,
  "map",null);d.set("minimum_accuracy",null);d.set("position_options",{enableHighAccuracy:!0,maximumAge:1E3});d.a.bindTo("map",d.c);d.a.bindTo("map",d.b);a&&d.setMap(a);return d}e(h,google.maps.MVCObject);b=h.prototype;b.set=function(a,c){if(n.test(a))throw"'"+a+"' is a read-only property.";"map"===a?this.setMap(c):google.maps.MVCObject.prototype.set.call(this,a,c)};b.f=function(){return this.get("map")};b.l=function(){return this.get("position_options")};
  b.w=function(a){this.set("position_options",a)};b.g=function(){return this.get("position")};b.m=function(){return this.get("position")?this.a.getBounds():null};b.j=function(){return this.get("accuracy")};b.h=function(){return this.get("minimum_accuracy")};b.v=function(a){this.set("minimum_accuracy",a)};
  b.setMap=function(a){google.maps.MVCObject.prototype.set.call(this,"map",a);a?navigator.geolocation&&(this.i=navigator.geolocation.watchPosition(this.A.bind(this),this.o.bind(this),this.l())):(this.c.unbind("position"),this.b.unbind("position"),this.a.unbind("center"),this.a.unbind("radius"),google.maps.MVCObject.prototype.set.call(this,"accuracy",null),google.maps.MVCObject.prototype.set.call(this,"position",null),navigator.geolocation.clearWatch(this.i),this.i=-1,this.c.setMap(a),this.b.setMap(a))};
  b.u=function(a){this.b.setOptions(k({},a))};b.s=function(a){this.a.setOptions(k({},a))};
  b.A=function(a){var c=new google.maps.LatLng(a.coords.latitude,a.coords.longitude),f=!this.b.getMap();if(f){if(null!=this.h()&&a.coords.accuracy>this.h())return;this.c.setMap(this.f());this.b.setMap(this.f());this.c.bindTo("position",this);this.b.bindTo("position",this);this.a.bindTo("center",this,"position");this.a.bindTo("radius",this,"accuracy")}this.j()!=a.coords.accuracy&&google.maps.MVCObject.prototype.set.call(this,"accuracy",a.coords.accuracy);!f&&this.g()&&this.g().equals(c)||google.maps.MVCObject.prototype.set.call(this,
  "position",c)};b.o=function(a){google.maps.event.trigger(this,"geolocation_error",a)};function k(a,c){for(var f in c)!0!==p[f]&&(a[f]=c[f]);return a}var p={map:!0,position:!0,radius:!0},n=/^(?:position|accuracy)$/i;var q=window;function r(){h.prototype.getAccuracy=h.prototype.j;h.prototype.getBounds=h.prototype.m;h.prototype.getMap=h.prototype.f;h.prototype.getMinimumAccuracy=h.prototype.h;h.prototype.getPosition=h.prototype.g;h.prototype.getPositionOptions=h.prototype.l;h.prototype.setCircleOptions=h.prototype.s;h.prototype.setMap=h.prototype.setMap;h.prototype.setMarkerOptions=h.prototype.u;h.prototype.setMinimumAccuracy=h.prototype.v;h.prototype.setPositionOptions=h.prototype.w;return h}
  "function"===typeof q.define&&q.define.amd?q.define([],r):"object"===typeof q.exports?q.module.exports=r():q.GeolocationMarker=r();
  }).call(this)
  
  //# sourceMappingURL=geolocation-marker.js.map


startMap();
