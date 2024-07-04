import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import ListingsActions from './ListingsActions';
import { useDispatch, useSelector } from 'react-redux';
import { setListings } from '../../../redux/state';
import axios from 'axios'
import isAdmin from '../utils/isAdmin';

const Listings = ({ setSelectedLink, link }) => {

  const [pageSize, setPageSize] = useState(5);
  const currentUser = useSelector((state) => state.user)

const dispatch = useDispatch()
const listings = useSelector((state) => state.listings)

const getFeedlistings = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/v1/listings")
        const data = response.data
        dispatch(setListings({ listings : data }))
    } catch (error) {
        console.log("Fetch listings failed", error.message);
    }
}

useEffect(()=>{
    getFeedlistings();
},[listings])

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'images',
        headerName: 'Photo',
        width: 80,
        renderCell: (params) => (
          <Avatar  style={{ marginTop: 7 }} src={`http://localhost:8000/${params.row.listingPhotoPaths[0]?.replace("public", "")}`} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: 'price',
        headerName: 'Cost',
        width: 80,
        renderCell: (params) => '$' + params.row.price,
      },
      { field: 'title', headerName: 'Title', width: 150},
      { field: 'description', headerName: 'Description', width: 250},

      {
        field: 'uName',
        headerName: 'Added by',
        width: 100,
        renderCell: (params) => (
          <Tooltip title={params.row.creator.firstName}>
            <Avatar   style={{ marginTop: 7 }} src={`http://localhost:8000/${params.row.creator.profileImagePath.replace(
                            "public",
                            ""
                        )}`} />
          </Tooltip>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 230,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS'),
      },
      { field: '_id', width:250, hide: true },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        width: 150,
        renderCell: (params) => <ListingsActions {...{ params }} />,
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Manage Listings
      </Typography>
      <DataGrid
        columns={columns}
        rows={isAdmin(currentUser) ? listings : listings.filter(listing=> listing.creator == currentUser)}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default Listings;