import { useThemeContext } from '@/context/ThemeContext';
import { LogoutUser } from '@/store/auth';
import { AppDispatch } from '@/store/store';
import '@/styles/admin.css';
import { AppBar, Divider, IconButton, InputBase, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { BiArrowToLeft, BiArrowToRight, BiCodeBlock, BiHome, BiLock, BiLogOut, BiSearch, BiSolidUserAccount } from "react-icons/bi";
import { FaCheck, FaChevronRight, FaLanguage } from 'react-icons/fa';
import { IoMdClose, IoMdNotifications, IoMdSettings } from "react-icons/io";
import { useDispatch } from 'react-redux';

interface HeaderProps {
    toggleSidebar: () => void; // Function to toggle sidebar
    isOpen: boolean;
}

type Language = {
    code: string;
    name: string;
};

type DisplaySetting = {
    name: string;
    mode: 'light' | 'dark';
};

// Mảng các ngôn ngữ
const languages: Language[] = [
    {
        code: 'en',
        name: 'English'
    },
    {
        code: 'vi',
        name: 'Vietnamese'
    }
];

// display setting
const displaySettings: DisplaySetting[] = [
    {
        name: 'Light Mode',
        mode: 'light'
    },
    {
        name: 'Dark Mode',
        mode: 'dark'
    }
];

const HeaderAdmin: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { setTheme } = useThemeContext();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string>('');

    const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null); // Quản lý submenu mở
    const [selectedLanguage, setSelectedLanguage] = useState<Language>({ code: 'en', name: 'English' }); // Ngôn ngữ đã chọn
    const [selectedDisplaySetting, setSelectedDisplaySetting] = useState<string>(displaySettings[0].name); // Display setting đã chọn

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

    // Hàm xử lý mở submenu
    const handleSubmenuOpen = (submenu: string, event: React.MouseEvent<HTMLElement>) => {
        setSubmenuAnchorEl(event.currentTarget);
        setSubmenuOpen(submenu); // Mở submenu tương ứng
    };

    // Hàm xử lý đóng submenu
    const handleSubmenuClose = () => {
        setSubmenuOpen(null); // Đóng submenu
        setSubmenuAnchorEl(null);
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

    // Hàm xử lý thay đổi ngôn ngữ
    const handleLanguageChange = (language: Language) => {
        setSelectedLanguage(language); // Cập nhật ngôn ngữ đã chọn
        handleSubmenuClose(); // Đóng submenu sau khi chọn
    };

    // Hàm xử lý thay đổi display setting
    const handleDisplaySettingChange = (setting: DisplaySetting) => {
        setSelectedDisplaySetting(setting.name); // Cập nhật display setting đã chọn
        setTheme(setting.mode)
        handleSubmenuClose(); // Đóng submenu sau khi chọn
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
                        <MenuItem onClick={(e) => handleSubmenuOpen("language", e)}>
                            <ListItemIcon>
                                <FaLanguage fontSize="20px" />
                            </ListItemIcon>
                            Change Language
                            <div className="menu-item-right">
                                <Typography variant="body2" style={{ color: '#666' }}>
                                    {selectedLanguage.name}
                                </Typography>
                                <ListItemIcon className='menu-item-right-icon'>
                                    <FaChevronRight />
                                </ListItemIcon>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={(e) => handleSubmenuOpen("settings", e)}>
                            <ListItemIcon>
                                <IoMdSettings fontSize="20px" />
                            </ListItemIcon>
                            Display Settings
                            <div className='menu-item-right'>
                                <Typography variant="body2" style={{ color: '#666' }}>
                                    {selectedDisplaySetting}
                                </Typography>
                                <ListItemIcon className='menu-item-right-icon'>
                                    <FaChevronRight />
                                </ListItemIcon>
                            </div>
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

                    {/* Submenu for Language */}
                    <Menu
                        className='user-menu user-submenu'
                        anchorEl={submenuAnchorEl}
                        open={submenuOpen === "language"}
                        onClose={handleSubmenuClose}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        {languages.map((language, index) => (
                            <MenuItem
                                className={`user-submenu-item ${selectedLanguage.code === language.code ? 'selected' : ''}`}
                                key={index}
                                onClick={() => handleLanguageChange(language)}
                            >
                                {language.name}

                                <ListItemIcon className='submenu-item-right-icon'>
                                    {selectedLanguage.code === language.code && <FaCheck />}
                                </ListItemIcon>
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Submenu for Display Settings */}
                    <Menu
                        className='user-menu user-submenu'
                        anchorEl={submenuAnchorEl}
                        open={submenuOpen === "settings"}
                        onClose={handleSubmenuClose}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        {displaySettings.map((setting, index) => (
                            <MenuItem
                                className={`user-submenu-item ${selectedDisplaySetting === setting.name ? 'selected' : ''}`}
                                key={index}
                                onClick={() => handleDisplaySettingChange(setting)}
                            >
                                {setting.name}

                                <ListItemIcon className='submenu-item-right-icon'>
                                    {selectedDisplaySetting === setting.name && <FaCheck />}
                                </ListItemIcon>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderAdmin;