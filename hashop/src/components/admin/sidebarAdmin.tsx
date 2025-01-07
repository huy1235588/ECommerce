'use client'

import React, { useState } from 'react';
import { ClickAwayListener, Collapse, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import { BiCircle, BiHome } from 'react-icons/bi';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { FaCheck, FaCircle, FaPager } from 'react-icons/fa';
import { IoApps, IoBookOutline } from "react-icons/io5";
import { IoIosApps, IoMdHelpCircleOutline, IoMdSettings } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Language } from '@/app/admin/layout';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho props của Sidebar
interface SidebarProps {
    isOpen: boolean; // Xác định trạng thái của Sidebar (mở hoặc đóng)
    languages: Language[]; // Mảng các ngôn ngữ
    selectedLanguage: Language; // Ngôn ngữ được chọn
    setSelectedLanguage: (language: Language) => void; // Hàm xử lý thay đổi ngôn ngữ
}

// Định nghĩa kiểu dữ liệu cho các mục menu
type MenuItem = {
    label: string; // Tên hiển thị
    icon: JSX.Element; // Icon tương ứng
    section: string; // Tên của phần (phục vụ cho trạng thái mở/đóng)
    route?: string; // Route để xác định đường dẫn
    subItems2?: {
        label: string;
        level: number;
        route?: string; // Route cho các mục cấp 2
        subItems3?: {
            label: string;
            level: number;
            route?: string; // Route cho các mục cấp 3
        }[];
    }[];
    subSections?: {
        label: string;
        level?: number;
        route?: string; // Route cho các mục cấp 1
        subItems2?: {
            label: string;
            level: number;
            route?: string; // Route cho các mục cấp 2
            subItems3?: {
                label: string;
                level: number;
                route?: string; // Route cho các mục cấp 3
            }[];
        }[];
    }[];
};

// Kiểu dữ liệu cho menu
type MenuState = {
    isMenuOpen: boolean;
    submenu: string | null;
    anchorEl: HTMLElement | null;
};

// Kiểu dữ liệu cho menu
type MenuProps<T> = {
    items: T[];
    selectedItem: T;
    onSelect: (item: T) => void;
    anchorEl: HTMLElement | null;
};

const SidebarAdmin: React.FC<SidebarProps> = ({
    isOpen,
    languages,
    selectedLanguage,
    setSelectedLanguage
}) => {
    const router = useRouter(); // Khởi tạo router
    const { i18n, t } = useTranslation(); // Sử dụng hook i18n

    // Cấu trúc menu Sidebar
    const menuItems: MenuItem[] = [
        // Dashboards
        {
            label: t('admin.sidebar.Dashboards'),
            icon: <BiHome />,
            section: 'dashboards',
            subItems2: [
                { label: t('admin.sidebar.Default'), level: 1, route: 'dashboards' },
                { label: t('admin.sidebar.Alternative'), level: 1, route: 'dashboards/alternative' },
            ],
        },
        // Pages
        {
            label: t('admin.sidebar.Pages'),
            icon: <FaPager />,
            section: 'pages',
            subSections: [
                {
                    label: t('admin.sidebar.User'),
                    subItems2: [
                        { label: t('admin.sidebar.Overview'), level: 2, route: 'user' },
                        { label: t('admin.sidebar.Leaderboard'), level: 2, route: 'user/leaderboard' },
                        { label: t('admin.sidebar.Add User'), level: 2, route: 'user/add' },
                    ],
                },
                {
                    label: t('admin.sidebar.User Profile'),
                    subItems2: [
                        { label: t('admin.sidebar.Profile'), level: 2, route: 'use-profile' },
                        { label: t('admin.sidebar.Teams'), level: 2, route: 'user-profile/teams' },
                        { label: t('admin.sidebar.Projects'), level: 2, route: 'user-profile/projects' },
                        { label: t('admin.sidebar.Connections'), level: 2, route: 'user-profile/connections' },
                        { label: t('admin.sidebar.My Profile'), level: 2, route: 'user-profile/my-profile' },
                    ],
                },
                {
                    label: t('admin.sidebar.Account'),
                    subItems2: [
                        { label: t('admin.sidebar.Settings'), level: 2, route: 'account/settings' },
                        { label: t('admin.sidebar.Billing'), level: 2, route: 'account/billing' },
                        { label: t('admin.sidebar.Invoice'), level: 2, route: 'account/invoice' },
                        { label: t('admin.sidebar.Api Keys'), level: 2, route: 'account/api-keys' },
                    ],
                },
                {
                    label: t('admin.sidebar.E-commerce'),
                    subItems2: [
                        { label: t('admin.sidebar.Overview'), level: 2, route: 'e-commerce' },
                        {
                            label: t('admin.sidebar.Product'),
                            level: 2,
                            subItems3: [
                                { label: t('admin.sidebar.Products'), level: 3, route: 'e-commerce/products' },
                                { label: t('admin.sidebar.Product Details'), level: 3, route: 'e-commerce/product-details' },
                                { label: t('admin.sidebar.Add Product'), level: 3, route: 'e-commerce/add-product' },
                            ],
                        },
                        {
                            label: t('admin.sidebar.Orders'),
                            level: 2,
                            subItems3: [
                                { label: t('admin.sidebar.Orders'), level: 3, route: 'e-commerce/orders' },
                                { label: t('admin.sidebar.Order Details'), level: 3, route: 'e-commerce/order-details' },
                            ],
                        },
                        {
                            label: t('admin.sidebar.Customers'),
                            level: 2,
                            subItems3: [
                                { label: t('admin.sidebar.Customers'), level: 3, route: 'e-commerce/customers' },
                                { label: t('admin.sidebar.Customer Details'), level: 3, route: 'e-commerce/customer-details' },
                                { label: t('admin.sidebar.Add Customers'), level: 3, route: 'e-commerce/add-customer' },
                            ],
                        },
                        { label: t('admin.sidebar.Manage Reviews'), level: 2, route: 'e-commerce/manage-reviews' },
                        { label: t('admin.sidebar.Checkout'), level: 2, route: 'e-commerce/checkout' },
                    ],
                },
                {
                    label: t('admin.sidebar.Projects'),
                    subItems2: [
                        { label: t('admin.sidebar.Overview'), level: 2, route: 'projects' },
                        { label: t('admin.sidebar.Timeline'), level: 2, route: 'projects/timeline' },
                    ],
                },
                {
                    label: t('admin.sidebar.Project'),
                    subItems2: [
                        { label: t('admin.sidebar.Overview'), level: 2, route: 'project' },
                        { label: t('admin.sidebar.Files'), level: 2, route: 'project/files' },
                        { label: t('admin.sidebar.Activity'), level: 2, route: 'project/activity' },
                        { label: t('admin.sidebar.Teams'), level: 2, route: 'project/teams' },
                        { label: t('admin.sidebar.Settings'), level: 2, route: 'project/settings' },
                    ],
                },
                { label: t('admin.sidebar.Referrals'), level: 1, route: 'referrals' },
            ],
        },
        // Apps
        {
            label: t('Apps'),
            icon: <IoApps />,
            section: 'Apps',
            subItems2: [
                { label: t('admin.sidebar.Calendar'), level: 1, route: 'apps/calendar' },
                { label: t('admin.sidebar.Invoice Generator'), level: 1, route: 'apps/invoice-generator' },
                { label: t('admin.sidebar.File Manager'), level: 1, route: 'apps/file-manager' },
            ],
        },
        // Documentation
        {
            label: t('admin.sidebar.Documentation'),
            icon: <IoBookOutline />,
            section: 'Documentation',
            route: 'documentation',
        },
        // Components
        {
            label: t('admin.sidebar.Components'),
            icon: <IoIosApps />,
            section: 'Components',
            route: 'components',
        },
    ];

    // State theo dõi phần được chọn
    const [selectedIndex, setSelectedIndex] = useState<string>('');
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [nestedActiveSection, setNestedActiveSection] = useState<string | null>(null);
    const [nestedNestedActiveSection, setNestedNestedActiveSection] = useState<string | null>(null);

    // Hàm xử lý chọn mục
    const handleSelectItem = (item: string) => {
        setSelectedIndex(item);
    }

    // Hàm chuyển hướng đến trang được chọn
    const handleSelectRoute = (route: string) => {
        router.push(`/admin/${route}`);
    }

    // Hàm bật/tắt trạng thái của các phần
    const toggleSection = (section: string) => setActiveSection((prev) => (prev === section ? null : section));
    const toggleNestedSection = (section: string) => setNestedActiveSection((prev) => (prev === section ? null : section));
    const toggleNestedNestedSection = (section: string) => setNestedNestedActiveSection((prev) => (prev === section ? null : section));

    // State cho menu
    const [menuState, setMenuState] = useState<MenuState>({
        isMenuOpen: false,
        submenu: null,
        anchorEl: null
    });

    // Hàm render sub-items
    const renderSubItems = (
        items: {
            label: string;
            level: number;
            route?: string;
            subItems3?: {
                label: string;
                level: number;
                route?: string;
            }[];
        }[]
    ) => (
        items.map((item) => (
            <React.Fragment key={item.label}>
                <ListItemButton
                    sx={{ pl: item.level * 3 }}
                    onClick={() => {
                        toggleNestedNestedSection(item.label);

                        if (!item.subItems3) {
                            handleSelectRoute(item.route || '');
                        }
                    }}
                    selected={nestedNestedActiveSection === item.label}
                >
                    <ListItemIcon>
                        {item.subItems3 ? <FaCircle size={8} /> : (
                            <>
                                {nestedNestedActiveSection === item.label ? <FaCircle size={8} /> : <BiCircle size={8} />}
                            </>
                        )}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {item.subItems3 && (nestedNestedActiveSection === item.label ? <MdExpandLess /> : <MdExpandMore />)}
                </ListItemButton>

                {item.subItems3 && (
                    <Collapse in={nestedNestedActiveSection === item.label} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            {item.subItems3.map((subItem) => (
                                <ListItemButton
                                    key={subItem.label}
                                    sx={{ pl: subItem.level * 3 }}
                                    onClick={() => {
                                        handleSelectItem(item.label);
                                        handleSelectRoute(subItem.route || '');
                                    }}

                                    selected={selectedIndex === subItem.label}
                                >
                                    <ListItemIcon>
                                        {selectedIndex === subItem.label ? <FaCircle size={8} /> : <BiCircle size={8} />}
                                    </ListItemIcon>
                                    <ListItemText primary={subItem.label} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        ))
    );

    // Hàm render sub-sections
    const renderSubSections = (
        sections: {
            label: string;
            route?: string;
            subItems2?: {
                label: string;
                level: number;
            }[];
        }[]
    ) => (
        sections.map((section) => (
            <React.Fragment key={section.label}>
                <ListItemButton
                    onClick={() => {
                        toggleNestedSection(section.label);
                        if (!section.subItems2) {
                            handleSelectRoute(section.route || '');
                        }
                    }}

                    selected={nestedActiveSection === section.label}
                    sx={{ pl: 4 }}
                >
                    <ListItemIcon>
                        <FaCircle size={8} />
                    </ListItemIcon>

                    <ListItemText primary={section.label} />
                    {section.subItems2 && (
                        nestedActiveSection === section.label ? <MdExpandLess /> : <MdExpandMore />
                    )}
                </ListItemButton>
                <Collapse in={nestedActiveSection === section.label} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        {section.subItems2 && renderSubItems(section.subItems2)}
                    </List>
                </Collapse>
            </React.Fragment>
        ))
    );

    // Hàm xử lý toggle Menu
    const toggleMenu = (submenu: string, event: React.MouseEvent<HTMLElement>) => {
        setMenuState((prevState) => ({
            isMenuOpen: !prevState.isMenuOpen || prevState.submenu !== submenu,
            submenu: prevState.isMenuOpen && prevState.submenu === submenu ? '' : submenu,
            anchorEl: prevState.isMenuOpen && prevState.submenu === submenu ? null : event.currentTarget
        }));
    };

    // Hàm render menu
    const Menu = <T extends { id: number; code: string; name: string; src: string }>({
        items,
        selectedItem,
        onSelect,
        anchorEl
    }: MenuProps<T>) => {
        const anchorRect = anchorEl?.getBoundingClientRect();
        const style = anchorRect
            ? {
                position: 'absolute',
                top: `${anchorRect.top}px`,
            }
            : {};

        return (
            <ClickAwayListener onClickAway={() => onSelect(selectedItem)}>
                <Paper className="lang-menu"
                    elevation={4}
                    style={{
                        ...style,
                        position: 'absolute',
                        top: `calc(${anchorRect?.top}px - 120px)`,
                    }}
                >
                    <MenuList>
                        {items.map((item, index) => (
                            <MenuItem
                                className="lang-menu-item"
                                key={index}
                                selected={selectedItem.id === item.id}
                                onClick={() => onSelect(item)}
                            >
                                <Image
                                    className="lang-menu-item-icon"
                                    src={item.src}
                                    width={20}
                                    height={20}
                                    alt={item.code}
                                />

                                <Typography className="lang-menu-item-text"
                                    variant="body2"
                                >
                                    {item.name}
                                </Typography>

                                {selectedItem.id === item.id && <FaCheck className='lang-menu-item-check' />}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </ClickAwayListener>
        );
    };

    // Hàm xử lý thay đổi ngôn ngữ
    const handleLanguageChange = (language: Language) => {
        setSelectedLanguage(language);
        setMenuState({
            isMenuOpen: false,
            submenu: null,
            anchorEl: null
        });
        i18n.changeLanguage(language.code);
        console.log(t);
    };

    return (
        <Drawer
            variant="permanent"
            open={isOpen}
            className={`drawer ${isOpen ? 'drawerOpen' : 'drawerClosed'}`}
            classes={{
                paper: isOpen ? 'drawerOpen' : 'drawerClosed',
            }}
        >
            {/* Logo */}
            <div className="logo-sidebar">
                <Link href="/admin/dashboards">
                    <Image
                        src={isOpen ? '/logo/logo.png' : '/logo/logo-mini.png'}
                        width={isOpen ? 100 : 50}
                        height={40}
                        alt="logo"
                    />
                </Link>
            </div>

            {/* Content */}
            <List className="sidebar">
                {/* Menu Items */}
                {menuItems.map(item => (
                    <React.Fragment key={item.section}>
                        <ListItemButton
                            className="sidebar-item"
                            onClick={() => toggleSection(item.section)}
                            selected={activeSection === item.section}
                            sx={{
                                justifyContent: isOpen ? 'flex-start' : 'center',
                                height: isOpen ? "auto" : 60,
                                marginBottom: isOpen ? 0 : 1,
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {isOpen && (
                                <React.Fragment>
                                    <ListItemText primary={item.label} />
                                    {(item.subSections || item.subItems2) && (
                                        activeSection === item.section ? <MdExpandLess /> : <MdExpandMore />
                                    )}
                                </React.Fragment>
                            )}
                        </ListItemButton>

                        {isOpen && item.subItems2 && (
                            <Collapse in={activeSection === item.section} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                    {renderSubItems(item.subItems2)}
                                </List>
                            </Collapse>
                        )}

                        {isOpen && item.subSections && (
                            <Collapse in={activeSection === item.section} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                    {renderSubSections(item.subSections)}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}

                {!isOpen && (
                    <>
                        {/* Settings */}
                        <ListItemButton
                            className="sidebar-item"
                            sx={{
                                justifyContent: 'center',
                                height: 60,
                                marginBottom: 1,
                            }}
                        >
                            <ListItemIcon>
                                <IoMdSettings />
                            </ListItemIcon>
                        </ListItemButton>

                        {/* Help */}
                        <ListItemButton
                            className="sidebar-item"
                            sx={{
                                justifyContent: 'center',
                                height: 60,
                                marginBottom: 1,
                            }}>
                            <ListItemIcon>
                                <IoMdHelpCircleOutline />
                            </ListItemIcon>
                        </ListItemButton>

                        {/* Language */}
                        <ListItemButton
                            className="sidebar-item"
                            sx={{
                                justifyContent: 'center',
                                height: 60,
                                marginBottom: 1,
                            }}>
                            <ListItemIcon>
                                <Image
                                    src="/icons/flags/1x1/us.svg"
                                    width={20}
                                    height={20}
                                    alt="us"
                                />
                            </ListItemIcon>
                        </ListItemButton>
                    </>
                )}
            </List>

            {/* Footer */}
            {isOpen && (
                <div className='sidebar-footer'>
                    {/* Setting */}
                    <IconButton>
                        <IoMdSettings />
                    </IconButton>

                    {/* Help */}
                    <IconButton>
                        <IoMdHelpCircleOutline />
                    </IconButton>

                    {/* Language */}
                    <IconButton onClick={(e) => toggleMenu('language', e)}>
                        <Image
                            src={selectedLanguage.src}
                            width={20}
                            height={20}
                            alt="us"
                        />
                    </IconButton>

                    {/* Menu for Langue */}
                    {menuState.submenu === 'language' && (
                        <Menu
                            items={languages}
                            selectedItem={selectedLanguage}
                            onSelect={handleLanguageChange}
                            anchorEl={menuState.anchorEl}
                        />
                    )}
                </div>
            )}
        </Drawer >
    );
};

export default SidebarAdmin;
