import { LogoutUser } from '@/store/auth';
import { AppDispatch } from '@/store/store';
import '@/styles/admin.css';
import { AppBar, Divider, IconButton, InputBase, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { BiArrowToLeft, BiArrowToRight, BiCodeBlock, BiHome, BiLock, BiLogOut, BiSearch, BiSolidUserAccount } from "react-icons/bi";
import { FaLanguage } from 'react-icons/fa';
import { IoMdClose, IoMdNotifications, IoMdSettings } from "react-icons/io";
import { useDispatch } from 'react-redux';

interface HeaderProps {
    toggleSidebar: () => void; // Function to toggle sidebar
    isOpen: boolean;
}

const HeaderAdmin: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string>('');

    // Hàm xử lý thay đổi giá trị search
    const handleChange = (value: string) => {
        setSearchValue(value);
    };

    // Hàm xử lý mở menu
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Hàm xử lý đóng menu
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
        <AppBar className={`navbar-menu ${isOpen ? "drawerOpen" : "drawerClosed"}`}        >
            <Toolbar className="toolbar">
                <div className="content-left">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <BiArrowToLeft /> : <BiArrowToRight />}
                    </IconButton>


                    {/* Search */}
                    <div className="search">
                        <BiSearch className="searchIcon" />

                        <InputBase
                            className="searchInput"
                            ref={searchRef}
                            value={searchValue}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder="Search in front"
                        />

                        <IconButton
                            className="searchIcon"
                            onClick={() => {
                                setSearchValue('');
                                searchRef.current?.focus();
                            }}
                        >
                            <IoMdClose />
                        </IconButton>
                    </div>
                </div>

                <div className="content-right">
                    <IconButton color="inherit">
                        <IoMdNotifications />
                    </IconButton>
                    <IconButton color="inherit">
                        <BiSolidUserAccount />
                    </IconButton>

                    {/* Account */}
                    <IconButton onClick={handleMenuOpen}>
                        <Image
                            src="/image/avatar/img2.jpg"
                            width={30}
                            height={30}
                            alt="avatar"
                            className="avatar"
                        />
                    </IconButton>

                    {/* Account Menu */}
                    <Menu
                        className='user-menu'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
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
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderAdmin;