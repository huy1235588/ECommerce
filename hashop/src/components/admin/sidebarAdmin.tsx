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
    route?: string; // Route để xác định đường dẫn
    children?: MenuItem[];
};

const SidebarAdmin: React.FC<SidebarProps> = ({
    isOpen,
    languages,
    selectedLanguage,
    setSelectedLanguage
}) => {
    const router = useRouter(); // Khởi tạo router
    const { i18n, t } = useTranslation(); // Sử dụng hook i18n

    // Trạng thái
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [menuState, setMenuState] = useState<{ isMenuOpen: boolean; anchorEl: HTMLElement | null }>({
        isMenuOpen: false,
        anchorEl: null
    });

    // Cấu trúc menu Sidebar
    const menuItems: MenuItem[] = [
        {
            label: t('admin.sidebar.Dashboards'),
            icon: <BiHome />,
            children: [
                { label: t('admin.sidebar.Default'), icon: <BiCircle size={8} />, route: 'dashboards' },
                { label: t('admin.sidebar.Alternative'), icon: <BiCircle size={8} />, route: 'dashboards/alternative' },
            ],
        },
        {
            label: t('admin.sidebar.Pages'),
            icon: <FaPager />,
            children: [
                {
                    label: t('admin.sidebar.User'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'user' },
                        { label: t('admin.sidebar.Leaderboard'), icon: <BiCircle size={8} />, route: 'user/leaderboard' },
                        { label: t('admin.sidebar.Add User'), icon: <BiCircle size={8} />, route: 'user/add' },
                    ],
                },
                {
                    label: t('admin.sidebar.User Profile'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { label: t('admin.sidebar.Profile'), icon: <BiCircle size={8} />, route: 'user-profile' },
                        { label: t('admin.sidebar.Teams'), icon: <BiCircle size={8} />, route: 'user-profile/teams' },
                        { label: t('admin.sidebar.Projects'), icon: <BiCircle size={8} />, route: 'user-profile/projects' },
                        { label: t('admin.sidebar.Connections'), icon: <BiCircle size={8} />, route: 'user-profile/connections' },
                        { label: t('admin.sidebar.My Profile'), icon: <BiCircle size={8} />, route: 'user-profile/my-profile' },
                    ],
                },
                {
                    label: t('admin.sidebar.Account'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { label: t('admin.sidebar.Settings'), icon: <BiCircle size={8} />, route: 'account/settings' },
                        { label: t('admin.sidebar.Billing'), icon: <BiCircle size={8} />, route: 'account/billing' },
                        { label: t('admin.sidebar.Invoice'), icon: <BiCircle size={8} />, route: 'account/invoice' },
                        { label: t('admin.sidebar.Api Keys'), icon: <BiCircle size={8} />, route: 'account/api-keys' },
                    ],
                },
                {
                    label: t('admin.sidebar.E-commerce'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'e-commerce' },
                        {
                            label: t('admin.sidebar.Product'),
                            icon: <BiCircle size={8} />,
                            children: [
                                { label: t('admin.sidebar.Products'), icon: <FaCircle size={8} />, route: 'e-commerce/product' },
                                { label: t('admin.sidebar.Product Details'), icon: <FaCircle size={8} />, route: 'e-commerce/product/details' },
                                { label: t('admin.sidebar.Add Product'), icon: <FaCircle size={8} />, route: 'e-commerce/product/add' },
                            ],
                        },
                        {
                            label: t('admin.sidebar.Orders'),
                            icon: <BiCircle size={8} />,
                            children: [
                                { label: t('admin.sidebar.Orders'), icon: <FaCircle size={8} />, route: 'e-commerce/order' },
                                { label: t('admin.sidebar.Order Details'), icon: <FaCircle size={8} />, route: 'e-commerce/order/details' },
                            ],
                        },
                        {
                            label: t('admin.sidebar.Customers'),
                            icon: <BiCircle size={8} />,
                            children: [
                                { label: t('admin.sidebar.Customers'), icon: <FaCircle size={8} />, route: 'e-commerce/customer' },
                                { label: t('admin.sidebar.Customer Details'), icon: <FaCircle size={8} />, route: 'e-commerce/customer/details' },
                                { label: t('admin.sidebar.Add Customers'), icon: <FaCircle size={8} />, route: 'e-commerce/customer/add' },
                            ],
                        },
                        { label: t('admin.sidebar.Manage Reviews'), icon: <BiCircle size={8} />, route: 'e-commerce/manage-reviews' },
                        { label: t('admin.sidebar.Checkout'), icon: <BiCircle size={8} />, route: 'e-commerce/checkout' },
                    ],
                },
                {
                    label: t('admin.sidebar.Projects'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'projects' },
                        { label: t('admin.sidebar.Timeline'), icon: <BiCircle size={8} />, route: 'projects/timeline' },
                    ],
                },
                {
                    label: t('admin.sidebar.Project'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'project' },
                        { label: t('admin.sidebar.Files'), icon: <BiCircle size={8} />, route: 'project/files' },
                        { label: t('admin.sidebar.Activity'), icon: <BiCircle size={8} />, route: 'project/activity' },
                        { label: t('admin.sidebar.Teams'), icon: <BiCircle size={8} />, route: 'project/teams' },
                        { label: t('admin.sidebar.Settings'), icon: <BiCircle size={8} />, route: 'project/settings' },
                    ],
                },
                { label: t('admin.sidebar.Referrals'), icon: <FaCircle size={8} />, route: 'referrals' },
            ],
        },
        {
            label: t('admin.sidebar.Apps'),
            icon: <IoApps />,
            children: [
                { label: t('admin.sidebar.Calendar'), icon: <BiCircle size={8} />, route: 'apps/calendar' },
                { label: t('admin.sidebar.Invoice Generator'), icon: <BiCircle size={8} />, route: 'apps/invoice-generator' },
                { label: t('admin.sidebar.File Manager'), icon: <BiCircle size={8} />, route: 'apps/file-manager' },
            ],
        },
        {
            label: t('admin.sidebar.Documentation'),
            icon: <IoBookOutline />,
            route: 'documentation',
        },
        {
            label: t('admin.sidebar.Components'),
            icon: <IoIosApps />,
            route: 'components',
        },
    ];

    // Hàm chuyển hướng đến trang được chọn
    const handleSelectRoute = (route: string) => {
        router.push(`/admin/${route}`);
    };

    // Hàm xử lý thay đổi ngôn ngữ
    const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuState((prevState) => ({
            isMenuOpen: !prevState.isMenuOpen,
            anchorEl: prevState.isMenuOpen ? null : event.currentTarget
        }));
    };

    // Hàm render các mục menu đệ quy
    const renderMenuItems = (items: MenuItem[], parentPath: string, depth: number) => (
        items.map((item) => {
            const currentPath = parentPath ? `${parentPath}/${item.label}` : item.label;
            const isExpanded = expandedSections.has(currentPath);

            const handleToggle = () => {
                setExpandedSections((prev) => {
                    const newSet = new Set(prev);
                    if (isExpanded) {
                        newSet.delete(currentPath);
                    } else {
                        // Đóng tất cả các mục menu cùng cấp
                        items.forEach((i) => {
                            const siblingPath = parentPath ? `${parentPath}/${i.label}` : i.label;
                            if (newSet.has(siblingPath)) {
                                newSet.delete(siblingPath);
                            }
                        });
                        // Mở mục menu được chọn
                        newSet.add(currentPath);
                    }
                    return newSet;
                });
            };

            return (
                <React.Fragment key={currentPath}>
                    <ListItemButton
                        sx={{ pl: depth * 2 }}
                        onClick={() => {
                            if (item.children) {
                                handleToggle();
                            } else if (item.route) {
                                setSelectedRoute(item.route);
                                handleSelectRoute(item.route);
                            }
                        }}
                        selected={selectedRoute === item.route}
                    >
                        <ListItemIcon>
                            {item.icon ? (
                                item.icon
                            ) : item.children ? (
                                <FaCircle size={8} />
                            ) : selectedRoute === item.route ? (
                                <FaCircle size={8} />
                            ) : (
                                <BiCircle size={8} />
                            )}
                        </ListItemIcon>

                        <ListItemText primary={item.label} />
                        {item.children && (isExpanded ? <MdExpandLess /> : <MdExpandMore />)}
                    </ListItemButton>

                    {item.children && (
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <List disablePadding>
                                {renderMenuItems(item.children, currentPath, depth + 1)}
                            </List>
                        </Collapse>
                    )}
                </React.Fragment>
            );
        })
    );

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
                        priority
                    />
                </Link>
            </div>

            {/* Menu */}
            <List className="sidebar">
                {renderMenuItems(menuItems, '', 1)}
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
                    <IconButton onClick={toggleMenu}>
                        <Image
                            src={selectedLanguage.src}
                            width={20}
                            height={20}
                            alt={selectedLanguage.code}
                        />
                    </IconButton>

                    {/* Menu for Langue */}
                    {menuState.isMenuOpen && (
                        <ClickAwayListener onClickAway={() => setMenuState({ isMenuOpen: false, anchorEl: null })}>
                            <Paper className="lang-menu" elevation={4} style={{ position: 'absolute', top: 'calc(100% - 120px)' }}>
                                <MenuList>
                                    {languages.map((language) => (
                                        <MenuItem
                                            key={language.id}
                                            selected={selectedLanguage.id === language.id}
                                            onClick={() => {
                                                setSelectedLanguage(language);
                                                i18n.changeLanguage(language.code);
                                                setMenuState({ isMenuOpen: false, anchorEl: null });
                                            }}
                                        >
                                            <Image
                                                src={language.src}
                                                width={20}
                                                height={20}
                                                alt={language.code}
                                            />
                                            <Typography variant="body2">{language.name}</Typography>
                                            {selectedLanguage.id === language.id && <FaCheck />}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Paper>
                        </ClickAwayListener>
                    )}
                </div>
            )}
        </Drawer >
    );
};

export default SidebarAdmin;
