import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import UsersActions from './UsersActions';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../../../redux/state';
import axios from 'axios'

const Users = ({ setSelectedLink, link }) => {
  const users = useSelector((state) => state.users.result);
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user)
  const getAllUsers = async () => {
    try {
        
        const response = await axios.get("http://localhost:8000/api/v1/users")
        const data = response.data
        dispatch(setUsers(data))

    } catch (error) {
        console.log("Fetch Users failed", error.message);
    }
}
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  
  useEffect(() => {
    setSelectedLink(link);
    getAllUsers()
  }, [link, setSelectedLink]);

  const columns = useMemo(
    () => [
      {
        field: 'photoURL',
        headerName: 'Avatar',
        width: 80,
        renderCell: (params) => (
          <Avatar
            style={{ marginTop: 7 }}
            src={params.row.profileImagePath}
          />
        ),
        sortable: false,
        filterable: false,
      },
      { field: 'firstName', headerName: 'Name', width: 150 },
      { field: 'email', headerName: 'Email', width: 270 },
      {
        field: 'role',
        headerName: 'Role',
        width: 100,
        type: 'singleSelect',
        valueOptions: ['basic', 'editor', 'admin'],
        editable: true,
      },
      {
        field: 'active',
        headerName: 'Active',
        width: 100,
        type: 'boolean',
        editable: true,
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 230,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS'),
      },
      { field: '_id', headerName: 'Id', width: 220 },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
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
        Manage Users
      </Typography>
      <div style={{ height: 350, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={users}
          getRowId={(row) => row._id}
          rowsPerPageOptions={[5, 10, 20]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
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
          onCellEditCommit={(params) => setRowId(params.id)}
        />
      </div>
    </Box>
  );
};

export default Users;
