import { useThemeContext } from '@/context/ThemeContext';
import { LogoutUser } from '@/store/auth';
import { AppDispatch } from '@/store/store';
import { AppBar, ClickAwayListener, Divider, IconButton, InputBase, ListItemIcon, MenuItem, MenuList, Paper, Toolbar, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { BiArrowToLeft, BiArrowToRight, BiCodeBlock, BiHome, BiLock, BiLogOut, BiSearch, BiSolidUserAccount } from "react-icons/bi";
import { FaCheck, FaChevronRight, FaLanguage } from 'react-icons/fa';
import { IoMdClose, IoMdNotifications, IoMdSettings } from "react-icons/io";
import { useDispatch } from 'react-redux';

interface HeaderProps {
    toggleSidebar: () => void; // Function to toggle sidebar
    isOpen: boolean;
}

// Kiểu dữ liệu cho menu
type MenuState = {
    isMenuOpen: boolean;
    submenu: string | null;
    anchorEl: HTMLElement | null;
};

// Kiểu dữ liệu cho ngôn ngữ
type Language = {
    id: number;
    code: string;
    name: string;
};

// Kiểu dữ liệu cho display setting
type DisplaySetting = {
    id: number;
    name: string;
    mode: 'light' | 'dark';
};

// Hàm tạo submenu
type SubmenuProps<T> = {
    items: T[];
    selectedItem: T;
    onSelect: (item: T) => void;
    anchorEl: HTMLElement | null;
};

// Mảng các ngôn ngữ
const languages: Language[] = [
    {
        id: 1,
        code: 'en',
        name: 'English'
    },
    {
        id: 2,
        code: 'vi',
        name: 'Vietnamese'
    },
    {
        id: 3,
        code: 'fr',
        name: 'French'
    },
    {
        id: 4,
        code: 'es',
        name: 'Spanish'
    }
];

// display setting
const displaySettings: DisplaySetting[] = [
    {
        id: 1,
        name: 'Light Mode',
        mode: 'light'
    },
    {
        id: 2,
        name: 'Dark Mode',
        mode: 'dark'
    }
];

const HeaderAdmin: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { setTheme } = useThemeContext();

    const [menuState, setMenuState] = useState<MenuState>({
        isMenuOpen: false,
        submenu: null,
        anchorEl: null
    });
    const anchorRef = useRef<HTMLButtonElement>(null);

    const [searchValue, setSearchValue] = useState<string>('');
    const searchRef = useRef<HTMLInputElement>(null);

    const [selectedLanguage, setSelectedLanguage] = useState<Language>({ id: 1, code: 'en', name: 'English' }); // Ngôn ngữ đã chọn
    const [selectedDisplaySetting, setSelectedDisplaySetting] = useState<DisplaySetting>(displaySettings[0]); // Display setting đã chọn

    // Hàm xử lý thay đổi giá trị search
    const handleChange = (value: string) => {
        setSearchValue(value);
    };

    // Hàm xử lý mở menu
    const toggleMenu = () => {
        setMenuState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
    };

    // Hàm xử lý mở submenu
    const openSubmenu = (submenu: string, event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget.getBoundingClientRect());

        setMenuState({
            isMenuOpen: true,
            submenu,
            anchorEl: event.currentTarget
        });
    };

    // Hàm xử lý đóng menu
    const closeMenu = () => {
        setMenuState({ isMenuOpen: false, submenu: null, anchorEl: null });
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
        setSelectedLanguage(language);
        closeMenu();
    };

    // Hàm xử lý thay đổi display setting
    const handleDisplaySettingChange = (setting: DisplaySetting) => {
        setSelectedDisplaySetting(setting); // Cập nhật display setting đã chọn
        setTheme(setting.mode)
        closeMenu(); // Đóng submenu sau khi chọn
    };

    // Xử lý focus khi mở menu
    useEffect(() => {
        if (!menuState.isMenuOpen) {
            anchorRef.current?.focus();
        }

    }, [menuState.isMenuOpen]);

    const Submenu = <T extends { id: number; name: string }>({
        items,
        selectedItem,
        onSelect,
        anchorEl
    }: SubmenuProps<T>) => {
        const anchorRect = anchorEl?.getBoundingClientRect();
        const style = anchorRect
            ? {
                position: 'absolute',
                top: `${anchorRect.top}px`,
            }
            : {};

        return (
            <ClickAwayListener onClickAway={() => onSelect(selectedItem)}>
                <Paper className="user-submenu"
                    elevation={4}
                    style={{
                        ...style,
                        position: 'absolute',
                        top: `calc(${anchorRect?.top}px - 65px)`,
                    }}
                >
                    <MenuList>
                        {items.map((item, index) => (
                            <MenuItem
                                className="user-submenu-item"
                                key={index}
                                selected={selectedItem.id === item.id}
                                onClick={() => onSelect(item)}
                            >
                                {item.name}
                                {selectedItem.name === item.name && <FaCheck />}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </ClickAwayListener>
        );
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
                    <IconButton
                        ref={anchorRef}
                        onClick={toggleMenu}
                    >
                        <Image
                            src="/image/avatar/img2.jpg"
                            width={30}
                            height={30}
                            alt="avatar"
                            className="avatar"
                        />
                    </IconButton>

                    {/* Account Menu */}
                    {menuState.isMenuOpen && (
                        <ClickAwayListener onClickAway={closeMenu}>
                            <Paper
                                className="user-menu"
                                elevation={4}
                            >
                                <MenuList>
                                    {/* My Information */}
                                    <Typography variant="subtitle1" className="menu-section-title">
                                        My Information
                                    </Typography>
                                    <MenuItem className='menu-item'>
                                        <ListItemIcon>
                                            <BiHome fontSize="20px" />
                                        </ListItemIcon>
                                        Personal Homepage
                                    </MenuItem>
                                    <MenuItem className='menu-item'>
                                        <ListItemIcon>
                                            <BiSolidUserAccount fontSize="20px" />
                                        </ListItemIcon>
                                        Information Management
                                    </MenuItem>
                                    <MenuItem className='menu-item'>
                                        <ListItemIcon>
                                            <BiLock fontSize="20px" />
                                        </ListItemIcon>
                                        Privacy Settings
                                    </MenuItem>
                                    <MenuItem className='menu-item'>
                                        <ListItemIcon>
                                            <BiCodeBlock fontSize="20px" />
                                        </ListItemIcon>
                                        Manage Blocklist
                                    </MenuItem>
                                    <Divider className="menu-divider" />

                                    {/* System Settings */}
                                    <Typography variant="subtitle1" className="menu-section-title">
                                        System Settings
                                    </Typography>

                                    {/* Change Language */}
                                    <MenuItem className='menu-item' onClick={(e) => openSubmenu("language", e)}>
                                        <ListItemIcon>
                                            <FaLanguage fontSize="20px" />
                                        </ListItemIcon>
                                        Change Language
                                        <div className="menu-item-right">
                                            <Typography variant="body2" className="menu-item-text">
                                                {selectedLanguage.name}
                                            </Typography>
                                            <ListItemIcon className="menu-item-right-icon">
                                                <FaChevronRight />
                                            </ListItemIcon>
                                        </div>
                                    </MenuItem>

                                    {/* Display Settings */}
                                    <MenuItem className='menu-item' onClick={(e) => openSubmenu("settings", e)}>
                                        <ListItemIcon>
                                            <IoMdSettings fontSize="20px" />
                                        </ListItemIcon>
                                        Display Settings
                                        <div className="menu-item-right">
                                            <Typography variant="body2" className="menu-item-text">
                                                {selectedDisplaySetting.name}
                                            </Typography>
                                            <ListItemIcon className="menu-item-right-icon">
                                                <FaChevronRight />
                                            </ListItemIcon>
                                        </div>
                                    </MenuItem>


                                    <Divider className="menu-divider" />

                                    {/* Logout */}
                                    <MenuItem className='menu-item' onClick={handleClickLogout}>
                                        <ListItemIcon>
                                            <BiLogOut fontSize="20px" />
                                        </ListItemIcon>
                                        Log out
                                    </MenuItem>
                                </MenuList>

                                {/* Submenu for Langue */}
                                {menuState.submenu === 'language' && (
                                    <Submenu
                                        items={languages}
                                        selectedItem={selectedLanguage}
                                        onSelect={handleLanguageChange}
                                        anchorEl={menuState.anchorEl}
                                    />
                                )}

                                {/* Submenu for Display Settings */}
                                {menuState.submenu === 'settings' && (
                                    <Submenu
                                        items={displaySettings}
                                        selectedItem={selectedDisplaySetting}
                                        onSelect={handleDisplaySettingChange}
                                        anchorEl={menuState.anchorEl}
                                    />
                                )}
                            </Paper>
                        </ClickAwayListener>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderAdmin;