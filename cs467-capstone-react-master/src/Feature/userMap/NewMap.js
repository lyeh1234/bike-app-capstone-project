import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

import BikeCard from '../../components/bikeCard';
import ReactDOMServer from 'react-dom/server';
import ReactDOM, { createPortal } from 'react-dom';
import { UserTokenContext, CheckedOutBikeContext } from "../../UserTokenContext";
import { useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

const libraries = ["places"];
const urlRoot = "https://bike-kollective1.uw.r.appspot.com";

export default function NewMap({tableData}) {
  const [bikeMarkers, setBikeMarkers] = useState(tableData);
  const { token } = useContext(UserTokenContext);
  const { checkedOutBike, setCheckedOutBike } = useContext(CheckedOutBikeContext);
  const history = useHistory();

  const mapContainerStyle = {
      width: "100vw",
      height: "100vh",
  };
  const center = {
      lat: 44.564568, 
      lng: -123.262047
  };
  const options = {
      // styles: 
  }
  const [map, setMap] = React.useState(null)
 
  const { isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: "AIzaSyCCaWtMzpSHe7HkdHE64nlLzaGyq1BXBm0",
    libraries,
  });

  //   const { isLoaded, loadError } = useJsApiLoader({
  //     id: 'google-map-script',
  //     googleMapsApiKey: process.env.REACT_APP_API_KEY_NOT_SECURE_FIX_BEFORE_PUBLISHING,
  //     libraries
  //   });

  //   if (loadError) return "Error loading maps";
  //   if (!isLoaded) return "loading maps";

  const [markers, setMarkers] = useState([]);
  const [currentLatLng, setCurrentLatLng] = useState();
  const [isMarkerShown, setIsMarkerShown] = useState(false);

  const lat = useRef(0);
  const lng = useRef(0);

  const bounds = useRef();
  useEffect(() => {
      if (window?.google?.maps && bounds.current !== undefined) {
          // pass in value
          defineBounds();
      }
  }, [isLoaded])
  
  useEffect(() => {
    if (!tableData) {
      getTableData();
    }
  }, [])

  const getTableData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {      
        lat.current = position.coords.latitude;
        lng.current = position.coords.longitude;
        
        window.position = position;
        
        fetch(`${urlRoot}/bikes?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
        .then(response => response.json())
        .then((data) => {
            try {
              setBikeMarkers(data);
            }
            catch (err) {
              console.error(`err: ${err.message}`);
            }
          },
          (error) => {
            console.error(`error: ${error}`);
          }
        )
      },() => {
        console.log('Unable to retrieve your location');
      });
    }
  }

  // change to take an argument, so that bounds get extended as needed
  const defineBounds = () => {
      if (mapCenter.current !== undefined) {
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(mapCenter.current);
          bounds.current = bounds;
      }
  }

  const onLoad = React.useCallback(function callback(map) {
      // const bounds = new window.google.maps.LatLngBounds();
      // map.fitBounds(bounds);
      setMap(map);
      // map.setZoom(10);
      // showCurrentLocation();
  }, []);

  const mapCenter = useRef();
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
      mapRef.current = map;
      showCurrentLocation();
    }, []);

  const onInfoWindowOpen = (bike) => {
    console.log("onInfoWindowOpen()");
    console.log("token: " + token);
    
    // const history = useHistory();
    console.log("history: ");
    console.log(history);

    const bikeCard = (
      <BikeCard bike={bike} tokenParam={token}></BikeCard>
    );
    const bikeDiv = document.getElementById(bike.id);

    if (bikeDiv) {
      ReactDOM.render(
        bikeCard,
        bikeDiv
      );
    }
  }

  useEffect(() => {
      if (window?.google?.maps) {
      showCurrentLocation();

      console.log("after showCurrentLocation();");
      if (!tableData) {
        getTableData();
      }
      console.log("tableData:");
      console.log(tableData);
      if (tableData) {
        console.log("bikeMarkers:");
        console.log(bikeMarkers);
        tableData.map(bike => {
            console.log(bike);
            const marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng({ 
                  lat: parseFloat(bike.lat),
                  lng: parseFloat(bike.lng),
                }),
                title: 'Your Location',
                // draggable: true,
                map: map,
                icon: '/bike.png'
            });
            setMarkers((current) => [
                ...current,
                marker
                // { lat: bike.lat,
                //     lng: bike.lng,
                // }
            ]);

            marker.addListener("click", () => {
              const infowindow = new window.google.maps.InfoWindow;
              window.google.maps.event.addListener(infowindow, 'domready', function() {
                onInfoWindowOpen(bike);
              });

              infowindow.setContent(ReactDOMServer.renderToString(<div id={bike.id}></div>));
              infowindow.open(map, marker);
            })
        })

        // var outputArray = [];  
        // for (let element in tableData) {  
        //     outputArray.push({  
        //         id: element,  
        //         lat: element["lat"]  
        //     });  

        //     setMarkers((current) => [
        //         ...current,
        //         { lat: element.lat,
        //             lng: element.lng,
        //         }
        //     ]);
        // }  
        // console.log("outputArray: ");
        // console.log(outputArray);

        console.log("markers:" );
        console.log(markers);

        // for (let element in markers) { 
        //     console.log("tableData: " + element)
        //     const marker = new window.google.maps.Marker({
        //         position: new window.google.maps.LatLng(element),
        //         title: 'Your Location',
        //         draggable: true,
        //         map: map
        //     });

        // }


        
        // bikeMarkers.array.forEach(bike => {
        //     if (bike.lat && bike.lng) {
        //         setMarkers((current) => [
        //             ...current,
        //             { lat: bike.lat,
        //                 lng: bike.lng,
        //             }
        //         ]);
        //     }
        // });
      }
  }
  }, [map, bikeMarkers])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {      
        lat.current = position.coords.latitude;
        lng.current = position.coords.longitude;
        
        window.position = position;
      },() => {
        console.log('Unable to retrieve your location');
      });
    }
  }

  const showCurrentLocation = () => {
    //developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
    if (navigator.geolocation) {
      console.log("geolocation happening");
      //   if (window?.google?.maps) {
      navigator.geolocation.getCurrentPosition(
        position => {
          {
            const pos = new window.google.maps.LatLng( {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            console.log(pos);
            mapCenter.current = pos;
            console.log(bikeMarkers);
            // infoWindow.setPosition(pos);
            // infoWindow.setContent("Location found.");
            // infoWindow.open(map);

            // mapRef.current.setCenter(pos);

            // const marker = <Marker 
            //     position={pos}
            //     title={"Your Location"}
            //     draggable={true}
            //     // map={mapRef.current}
            //     map={map}
            // >
            // </Marker>

            const marker = new window.google.maps.Marker({
                position: mapCenter.current,
                title: 'Your Location',
                draggable: true,
                map: map
            });

            setMarkers((current) => [
                ...current,
                pos
            ]);
            
            // // Create bounds object, loop over markers, set best map view.
            // const bounds = new window.google.maps.LatLngBounds();
            // if (pos != null) {
            //   bounds.extend(pos);
            // }
            defineBounds();
            
            // if (mapRef.current) {
            //     mapRef.current.fitBounds(bounds);
            //     mapRef.current.setZoom(15);
            // }
            if (map) {
                map.fitBounds(bounds);
                map.setZoom(13);
            }
          }
        }
      )
    // }
    } else {
      console.log("geolocation error")
    }
  }

  console.log("NewMap started");

  return (
    <div>
      {/* <Search panTo={panTo} /> */}

    {isLoaded && mapCenter.current ? 
      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={mapCenter.current}
        options={options}
        onClick={(event) => {
            console.log(event);
        }}
        onLoad={onLoad}
        // onLoad={onMapLoad}
      >
        {   markers && markers.length > 0 ? 
            markers.map((marker) => {
                <Marker 
                    key={marker.lat}
                    position={{lat: marker.lat, lng: marker.lng}}
                ></Marker>
                })
            : null
        }
        {/* <Marker position={{
            lat: 44.564568, 
            lng: -123.262047
            }}
        >
        </Marker> */}
      </GoogleMap>
      : <></>
    }
    </div>
  ) ;
}