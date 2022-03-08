import { 
  Button,
  makeStyles, 
  Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState, useRef } from "react";
import ListAlt from "@material-ui/icons/ListAlt";
import Map from "@material-ui/icons/Map";
import BikeTable from "../components/bikeTable";
import NewMap from "../Feature/userMap/NewMap";

// cynthia
const urlRoot = "https://bike-kollective1.uw.r.appspot.com";
// matt
// const urlRoot = "https://capstone-cs-467-react.wm.r.appspot.com/";
// const urlRoot = "https://capstone-cs467-backend.wm.r.appspot.com";
// const urlRoot ="http://localhost:8080";


export const numberFormat = (value) =>
  new Intl.NumberFormat( {
    maximumFractionDigits: 1
  }).format(value);

export default function FindBike() {
  // const classes = useStyles();
  const [bikeList, setBikeList] = useState([]);
  const [bikeListLoaded, setBikeListLoaded] = useState(false);
  // const loaded = useRef(false);
  const[showTable, setShowTable] = useState(false);
  // const lat = useRef(null);
  // const lng = useRef(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // const getCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {      
  //       setLat(position.coords.latitude);
  //       setLng(position.coords.longitude);
        
  //       window.position = position;
  //     },() => {
  //       console.log('Unable to retrieve your location');
  //     });
  //   }
  // }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {    
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);      
        // lat.current = position.coords.latitude;
        // lng.current = position.coords.longitude;
        
        window.position = position;

        fetch(`${urlRoot}/bikes?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
        .then(response => response.json())
        .then((data) => {
            try {
              setBikeList(data);
              console.log("data: " + data);
              setBikeListLoaded(true);
              // loaded.current = true;
              setLoaded(true);
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
  }, [])

  useEffect(() => {
    // loaded.current = true;
    setLoaded(true);
  }, [bikeList])
  
  const toggleTable = () =>{
    setShowTable((state) => (state === true ? false : true));
  };

  // const [mapDivRendered, setMapDivRendered] = useState(false);
  // const mapRef = useCallback(node => {
  //   console.log('use callback');
  //   if (node !== null) {
  //     setMapDivRendered(true);
  //   }
  // }, [])

  // const mapRef = useRef(null);

  return(
    <div>   
        <Button
          align="right"
          variant="contained" 
          color="primary" 
          onClick={toggleTable}>
          Toggle <ListAlt/>/<Map/> 
        </Button>
      

    {/* <div id="autocomplete-input" type="text"></div> */}
    {/* <div>
      <input id="autocomplete-input" type="text"></input>
    </div> */}
    {/* <div id="map"></div> */}

    {/* <div id="map" ref={mapRef}></div> */}
    {/* propRef={mapRef.current} */}

    {loaded
      ? showTable
        ? <BikeTable tableData={bikeList}/>
        : <NewMap tableData={bikeList}/>
      : <div>Loading...</div>
    }

    {/* {!showTable && bikeListLoaded ? <NewMap tableData={bikeList}/> : <div><BikeTable tableData={bikeList}/></div>} */}
    {/* {!showTable && bikeListLoaded && bikeList?.length > 0
      ? <NewMap tableData={bikeList}/>
      : <div><BikeTable tableData={bikeList}/></div>
    } */}
    </div>
  )

}