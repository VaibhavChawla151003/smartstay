import { Group, MapsHomeWork } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import axios from 'axios'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { setListings, setUsers } from '../../../redux/state';
import PieRoomsCost from './PieRoomCost';
import AreaRoomsUsers from './AreaRoomUsers';

const Main = ({ setSelectedLink, link }) => {
    
    const dispatch = useDispatch()
    const listings = useSelector((state) => state.listings)

    const getFeedlistings = async () => {
        try {
            const response = await axios.get("https://smartstay-2.onrender.com/api/v1/listings")
            const data = response.data
            dispatch(setListings({ listings : data }))
        } catch (error) {
            console.log("Fetch listings failed", error.message);
        }
    }

    const users = useSelector((state) => state.users)
    const getAllUsers = async () => {
        try {
            
            const response = await axios.get("https://smartstay-2.onrender.com/api/v1/users")
            const data = response.data
            dispatch(setUsers(data))

        } catch (error) {
            console.log("Fetch Users failed", error.message);
        }
    }

    useEffect(() => {
       setSelectedLink(link);
       getFeedlistings()
    }, []);

    useEffect(()=>{
        getAllUsers()
    },[])
   
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'grid' },
        gridTemplateColumns: 'repeat(3,1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gap: 3,
        textAlign: 'center',
        flexDirection: 'column',
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">Total Users</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Group sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{users.result.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4">Total Listings</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MapsHomeWork sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{listings.length}</Typography>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: 3, gridRow: '1/4' }}>
        <Box>
          <Typography>Recently added Users</Typography>
          <List>
            {users.result.slice(0, 4).map((user, i) => (
              <Box key={user._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={user?.name} src={user.profileImagePath} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user?.firstName}
                    secondary={`Time Created: ${moment(user?.createdAt).format(
                      'YYYY-MM-DD H:mm:ss'
                    )}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
        <Divider sx={{ mt: 3, mb: 3, opacity: 0.7 }} />
        <Box>
          <Typography>Recently added Rooms</Typography>
          <List>
            {listings.slice(0, 4).map((room, i) => (
              <Box key={room._id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={room?.title}
                      src={room?.listingPhotoUrls[0]}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={room?.title}
                    secondary={`Added: ${moment(room?.createdAt).fromNow()}`}
                  />
                </ListItem>
                {i !== 3 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
        <PieRoomsCost/>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
        <AreaRoomsUsers />
      </Paper>
    </Box>

  );
};

export default Main;