import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function ResponsiveAppBar() {

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { user, loading, googleSignIn, googleSignOut } = useContext(AuthContext)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogin = () => {
        googleSignIn()
    }

    return (
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position="static" sx={{ backgroundColor: "#0d47a1" }}>
                <Toolbar>
                    <GavelRoundedIcon sx={{ mr: 2 }} fontSize='large'></GavelRoundedIcon>
                    <Typography variant="h5" component="div">
                        Bidding
                    </Typography>
                    <Box sx={{ flexGrow: 1, ml: 3 }}>
                        <Button sx={{ color: '#fff' }} href='/biddingPage'>
                            Dashboard
                        </Button>
                        {user?.isAdmin && (
                            <Button sx={{ color: '#fff' }} href='/adminPage'>
                                Admin
                            </Button>
                        )}
                        <Button sx={{ color: '#fff' }} >
                            About
                        </Button>
                    </Box>
                    {user ? (
                        <>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Typography variant="h6" component="div" color="white">
                                        {user.userName}
                                    </Typography>
                                    <Avatar sx={{ ml: 2 }} src={user.photoURL} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '48px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Typography sx={{ px: 2, mt: 0, pt: 0 }} textAlign="center" >{user.email}</Typography>
                                <Box display="flex" justifyContent="center" width="100%">
                                    <Button variant='outlined' sx={{ borderRadius: '50px',mt:1, textAlign:"center"}} onClick={() => googleSignOut()}>Log Out</Button>
                                </Box>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleLogin}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default ResponsiveAppBar;
