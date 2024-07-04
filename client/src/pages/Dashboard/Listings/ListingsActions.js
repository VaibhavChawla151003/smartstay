import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview } from '@mui/icons-material';
// import { useValue } from '../../../context/ContextProvider';
// import { deleteRoom } from '../../../actions/room';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios'

const RoomsActions = ({ params }) => {
  const navigate = useNavigate()

//   const {
//     dispatch,
//     state: { currentUser },
//   } = useValue();

const [loading, setLoading] = useState(false);

const handleDelete = async () => {
  setLoading(true);
  
  const response = await axios.delete(`https://smartstay-2.onrender.com/api/v1/listings/delete/${params.row._id}`);

  if (response.status === 200) {
    console.log("Listing deleted!!");
  }
  setLoading(false);
};

  return (
    <Box>
      <Tooltip title="View room details">
        <IconButton
          onClick={() => navigate(`/listings/${params.row._id}`)}
        >
          <Preview />
        </IconButton>
      </Tooltip>
      {/* <Tooltip title="Edit this room">
        <IconButton onClick={() => {}}>
          <Edit />
        </IconButton>
      </Tooltip> */}
      <Tooltip title="Delete this room">
        <IconButton
          onClick={handleDelete}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RoomsActions;