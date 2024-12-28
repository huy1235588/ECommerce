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
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { LogoutUser } from '@/store/auth';
import { AppDispatch } from '@/store/store';

interface UserMenuProps {
    username: string;
    avatarUrl: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ username, avatarUrl }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [menuPosition, setMenuPosition] = React.useState<{ top: number; left: number } | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget.getBoundingClientRect();

        if (!menuPosition) {
            // Lưu vị trí ban đầu (top, left) của menu
            setMenuPosition({
                top: target.bottom,
                left: target.left ,
            });
        }

        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Hàm xử lý đăng xuất
    const handleClickLogout = async () => {
        try {
            // Gọi action LogoutUser
            await dispatch(LogoutUser());
            router.refresh();

        } catch (error) {
            console.log(error);
        }
    };

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
                anchorReference="anchorPosition" // Đặt menu theo vị trí cố định
                anchorPosition={menuPosition
                    ? { top: menuPosition.top, left: menuPosition.left }
                    : undefined
                }
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
                <MenuItem
                    onClick={handleClickLogout}
                >
                    <ListItemIcon>
                        <BiLogOut fontSize="20px" />
                    </ListItemIcon>
                    Log out
                </MenuItem>
            </Menu>
        </>
    );
};
