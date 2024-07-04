import { Box, CircularProgress, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import axios from 'axios'
import { green } from '@mui/material/colors';
import { useSelector } from 'react-redux';


const UsersActions = ({ params, rowId, setRowId }) => {
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.user)
  const users = useSelector((state) => state.users.result);
  

  const handleSubmit = async () => {
    setLoading(true);
    const { role, active, _id } = params.row;
    const response = await axios.patch(`http://localhost:8000/api/v1/users/updateStatus/${_id}`, { role, active });

    if (response) {
      setRowId(null);
      const user = users.find(user=> user._id === _id)
      user.role = role
      user.active = active
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   if (rowId === params.id && success) setSuccess(false);
  // }, [rowId]);

  return (
    <div>
<Box
      sx={{
        m: 1,
        position: 'relative',
      }}
    >
      <Fab
        color="primary"
        sx={{
          width: 40,
          height: 40,
        }}
        onClick={handleSubmit}
      >
        <Save />
      </Fab>
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
    </div>
    
  );
};

export default UsersActions;