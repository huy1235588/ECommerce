import React from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Divider,
    Avatar,
    IconButton,
} from '@mui/material';
import { BiCodeBlock, BiHome, BiLock, BiLogOut, BiSolidUserAccount } from 'react-icons/bi';
import { FaLanguage } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

interface UserMenuProps {
    username: string;
    avatarUrl: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ username, avatarUrl }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // // Hàm xử lý đăng xuất
    // const onClickLogout = async () => {
    //     try {
    //         // Gọi action LogoutUser
    //         // await dispatch(LogoutUser());
    //         router.refresh();

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <>
            <IconButton
                onClick={handleMenuOpen}
                sx={{
                    borderRadius: '5px',
                    ":hover": {
                        backgroundColor: 'transparent',
                        opacity: '0.75'
                    },
                }}
            >
                <Avatar src={avatarUrl} alt={username} />
                <Typography
                    sx={{
                        paddingLeft: '10px',
                        color: 'white',
                    }}
                >
                    {username}
                </Typography>
            </IconButton>

            <Menu
                className='menu-account'
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                disableScrollLock={true}
            >
                {/* My Information */}
                <Typography variant="subtitle1" style={{ padding: '10px 16px', fontWeight: 'bold' }}>
                    My Information
                </Typography>
                <MenuItem>
                    <ListItemIcon>
                        <BiHome fontSize="20px" />
                    </ListItemIcon>
                    Personal Homepage
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <BiSolidUserAccount fontSize="20px" />
                    </ListItemIcon>
                    Information Management
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <BiLock fontSize="20px" />
                    </ListItemIcon>
                    Privacy Settings
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <BiCodeBlock fontSize="20px" />
                    </ListItemIcon>
                    Manage Blocklist
                </MenuItem>
                <Divider style={{ backgroundColor: '#444' }} />

                {/* System Settings */}
                <Typography variant="subtitle1" style={{ padding: '10px 16px', fontWeight: 'bold' }}>
                    System Settings
                </Typography>
                <MenuItem>
                    <ListItemIcon>
                        <FaLanguage fontSize="20px" />
                    </ListItemIcon>
                    Change Language
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <IoMdSettings fontSize="20px" />
                    </ListItemIcon>
                    Display Settings
                </MenuItem>
                <Divider style={{ backgroundColor: '#444' }} />

                {/* Logout */}
                <MenuItem>
                    <ListItemIcon>
                        <BiLogOut fontSize="20px" />
                    </ListItemIcon>
                    Log out
                </MenuItem>
            </Menu>
        </>
    );
};
