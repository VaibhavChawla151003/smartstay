import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import axios from 'axios'
import MuiAppBar from '@mui/material/AppBar';
import { Brightness4, Brightness7, Home, Menu } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideList from './SideList';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../../redux/state';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Dashboard() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const users = useSelector((state) => state.users)
    console.log(users.length);
    const getAllUsers = async () => {
        try {
            
            const response = await axios.get("http://localhost:8000/api/v1/users")
            const data = response.data
            dispatch(setUsers(data))

        } catch (error) {
            console.log("Fetch Users failed", error.message);
        }
    }

    useEffect(()=>{
      getAllUsers();
    },[])
  const [dark, setDark] = useState(true);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? 'dark' : 'light',
        },
      }),
    [dark]
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const navigate = useNavigate();
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <Menu />
            </IconButton>
            <Tooltip title="Go back to home page">
              <IconButton sx={{ mr: 1 }} onClick={() => navigate('/')}>
                <Home />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton onClick={() => setDark(!dark)}>
              {dark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <SideList {...{ open, setOpen }} />
      </Box>
    </ThemeProvider>
  );
}