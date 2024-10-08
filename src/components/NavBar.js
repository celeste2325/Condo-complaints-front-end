import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {NavLink, useNavigate} from 'react-router-dom';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import {useAuth} from "./auth";

const drawerWidth = 240;

const routes = [];
routes.push({
    to: '/create-complaint',
    text: 'Create complaint'
});
routes.push({
    to: '/home',
    text: 'View complaints'
});

const routesAdmin = [];
routesAdmin.push({
    to: '/create-building',
    text: 'Create Building'
});

routesAdmin.push({
    to: '/home',
    text: 'View complaints'
});

export function NavBar(props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();
    const {isAdmin} = useAuth();
    const {window} = props;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const menuVariable = () => {
        return isAdmin ? routesAdmin : routes;
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Typography variant="h6" sx={{my: 2}}>
                Condo's complaints
            </Typography>
            <Divider/>
            <List>
                {routes.map((item) => (
                    <ListItem key={item.to} disablePadding>
                        <Button sx={{textAlign: 'center'}}>
                            <NavLink
                                style={({isActive}) => ({
                                    color: isActive ? 'red' : 'blue',
                                    textDecoration: 'none'
                                })}
                                to={item.to}>
                                {item.text}
                            </NavLink>
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const logout = () => {
        navigate('/logout')
    }

    return (
        <Box sx={{display: 'flex'}}>
            <AppBar component="nav">
                <Toolbar sx={{
                    justifyContent: {xs: 'space-between'},
                    padding: {xs: 1}
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}, textAlign: 'left'}}
                    >
                        Condo's complaints

                    </Typography>
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        {menuVariable().map((item) => (
                            <Button variant="outlined" key={item.to} sx={{color: '#fff', marginRight: 1}}>
                                <NavLink
                                    style={({isActive}) => ({
                                        color: isActive ? 'red' : 'blue',
                                        textDecoration: 'none',
                                        border: !isActive ? '1px solid transparent' : 'none',
                                        display: isActive ? 'none' : 'flex',

                                    })}
                                    to={item.to}>
                                    {item.text}
                                </NavLink>
                            </Button>
                        ))}
                    </Box>
                    <ExitToAppRoundedIcon
                        onClick={logout} fontSize='large' color='secondary' xs={{cursor: 'pointer'}}>
                    </ExitToAppRoundedIcon>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

NavBar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

