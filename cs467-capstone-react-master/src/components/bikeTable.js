import MaterialTable from "@material-table/core";
import { ExpandMore } from "@material-ui/icons";
import Rating from '@material-ui/lab/Rating';
import CheckIcon from "@material-ui/icons/Check";
import tableIcons from "../components/MaterialTableIcons";
import { 
   Avatar, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography} from "@material-ui/core";
import { useTheme, useMediaQuery } from '@material-ui/core';
import { useContext } from 'react';
import BikeCard from "./bikeCard";
import { numberFormat } from "./support";
import { UserTokenContext, CheckedOutBikeContext } from "../UserTokenContext";

var columns = [
  {title: "id", field: "id", hidden: true, render: rowData => (rowData['id'])},
  {title:"", field: "image_url", width: "50px", render: rowData => <Avatar variant="rounded" src={rowData["image_url"]}></Avatar>},
  {title: "Street Address", align: "center", field:"street"},
  {title: "Walking Distance (miles)", align: "center", width: "40px", field:"distance", render: rowData => numberFormat(rowData["distance"])},
  {title: "Type", align: "center", field:"type"},
  {title: "Speeds", align: "center", field:"num_speeds"},
  {title:"Basket", field:"basket", align: "center", render: rowData => (rowData['basket'] === true ? <CheckIcon/> :"")},
  {title:"Cargo Rack", align: "center", field:"cargo_rack", render: rowData => (rowData['cargo_rack'] === true ? <CheckIcon/> :"")},
  {title: "Rating", align: "center", field: "rating", render: rowData => {return <Rating name="hover-feedback" 
  value={rowData.rating} readOnly precision={0.5} />;}}
]

// export const numberFormat = (value) =>
//   new Intl.NumberFormat( {
//     maximumFractionDigits: 1
//   }).format(value);

// export default function BikeTable({tableData}){
  export default function BikeTable({tableData}){
    const { token } = useContext(UserTokenContext);
    const theme = useTheme()
    const tableForm = useMediaQuery(theme.breakpoints.up('sm'))
    return(
      <div>
        {tableForm &&<MaterialTable
          title="Nearby Bikes"
          icons={tableIcons}
          columns={columns}
          data={tableData}
          options={{pageSize:10}}
          />}
        {!tableForm && tableData.map(bike =>( <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          key={bike.id}
        >
          <Typography>{bike.street} <span>&nbsp;&nbsp;&nbsp;&nbsp;</span><Rating value={bike.rating} 
            readOnly precision={0.5} /> </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BikeCard bike={bike} tokenParam={token}/>
        </AccordionDetails>
      </Accordion>

        ))}
    </div>
  )
}