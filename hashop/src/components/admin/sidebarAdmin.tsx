'use client'

import React, { useEffect, useState } from 'react';
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
import { useCurrentRoute } from '@/context/SidebarConext';

// Định nghĩa kiểu dữ liệu cho props của Sidebar
interface SidebarProps {
    isOpen: boolean; // Xác định trạng thái của Sidebar (mở hoặc đóng)
    languages: Language[]; // Mảng các ngôn ngữ
    selectedLanguage: Language; // Ngôn ngữ được chọn
    setSelectedLanguage: (language: Language) => void; // Hàm xử lý thay đổi ngôn ngữ
}

// Định nghĩa kiểu dữ liệu cho các mục menu
type MenuItem = {
    id: string; // ID của mục menu
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
    const { currentRoute } = useCurrentRoute();

    // Trạng thái của các mục menu được mở rộng
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    const [menuState, setMenuState] = useState<{ isMenuOpen: boolean; anchorEl: HTMLElement | null }>({
        isMenuOpen: false,
        anchorEl: null
    });

    // Đóng tất cả các mục menu khi Sidebar được đóng
    useEffect(() => {
        if (!isOpen) {
            setExpandedSections(new Set());
        }
    }, [isOpen]);

    // Lấy route hiện tại
    useEffect(() => {
        const path = findPathToRoute(menuItems, currentRoute);

        console.log('path', path);

        if (path) {
            setSelectedPath(path);
            // Lấy tất cả các parent (trừ leaf cuối cùng) để expand
            const parentPaths = path.slice(0, -1);
            setExpandedSections(new Set(parentPaths));
        } else {
            setSelectedPath([]);
            setExpandedSections(new Set());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoute]);

    // Cấu trúc menu Sidebar
    const menuItems: MenuItem[] = [
        {
            id: 'dashboards',
            label: t('admin.sidebar.Dashboards'),
            icon: <BiHome />,
            children: [
                { id: 'dashboards-default', label: t('admin.sidebar.Default'), icon: <BiCircle size={8} />, route: 'dashboards' },
                { id: 'dashboards-alternative', label: t('admin.sidebar.Alternative'), icon: <BiCircle size={8} />, route: 'dashboards/alternative' },
            ],
        },
        {
            id: 'pages',
            label: t('admin.sidebar.Pages'),
            icon: <FaPager />,
            children: [
                {
                    id: 'pages-user',
                    label: t('admin.sidebar.User'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { id: 'pages-user-overview', label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'user' },
                        { id: 'pages-user-leaderboard', label: t('admin.sidebar.Leaderboard'), icon: <BiCircle size={8} />, route: 'user/leaderboard' },
                        { id: 'pages-user-add', label: t('admin.sidebar.Add User'), icon: <BiCircle size={8} />, route: 'user/add' },
                    ],
                },
                {
                    id: 'pages-user-profile',
                    label: t('admin.sidebar.User Profile'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { id: 'pages-user-profile-profile', label: t('admin.sidebar.Profile'), icon: <BiCircle size={8} />, route: 'user-profile' },
                        { id: 'pages-user-profile-teams', label: t('admin.sidebar.Teams'), icon: <BiCircle size={8} />, route: 'user-profile/teams' },
                        { id: 'pages-user-profile-projects', label: t('admin.sidebar.Projects'), icon: <BiCircle size={8} />, route: 'user-profile/projects' },
                        { id: 'pages-user-profile-connections', label: t('admin.sidebar.Connections'), icon: <BiCircle size={8} />, route: 'user-profile/connections' },
                        { id: 'pages-user-profile-my-profile', label: t('admin.sidebar.My Profile'), icon: <BiCircle size={8} />, route: 'user-profile/my-profile' },
                    ],
                },
                {
                    id: 'pages-account',
                    label: t('admin.sidebar.Account'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { id: 'pages-account-settings', label: t('admin.sidebar.Settings'), icon: <BiCircle size={8} />, route: 'account/settings' },
                        { id: 'pages-account-billing', label: t('admin.sidebar.Billing'), icon: <BiCircle size={8} />, route: 'account/billing' },
                        { id: 'pages-account-invoice', label: t('admin.sidebar.Invoice'), icon: <BiCircle size={8} />, route: 'account/invoice' },
                        { id: 'pages-account-api-keys', label: t('admin.sidebar.Api Keys'), icon: <BiCircle size={8} />, route: 'account/api-keys' },
                    ],
                },
                {
                    id: 'pages-ecommerce',
                    label: t('admin.sidebar.E-commerce'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { id: 'pages-ecommerce-overview', label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'e-commerce' },
                        {
                            id: 'pages-ecommerce-product',
                            label: t('admin.sidebar.Product'),
                            icon: <BiCircle size={8} />,
                            children: [
                                { id: 'pages-ecommerce-product-products', label: t('admin.sidebar.Products'), icon: <FaCircle size={8} />, route: 'e-commerce/product' },
                                { id: 'pages-ecommerce-product-details', label: t('admin.sidebar.Product Details'), icon: <FaCircle size={8} />, route: 'e-commerce/product/details' },
                                { id: 'pages-ecommerce-product-add', label: t('admin.sidebar.Add Product'), icon: <FaCircle size={8} />, route: 'e-commerce/product/add' },
                            ],
                        },
                        {
                            id: 'pages-ecommerce-orders',
                            label: t('admin.sidebar.Orders'),
                            icon: <BiCircle size={8} />,
                            children: [
                                { id: 'pages-ecommerce-orders-list', label: t('admin.sidebar.Orders'), icon: <FaCircle size={8} />, route: 'e-commerce/order' },
                                { id: 'pages-ecommerce-orders-details', label: t('admin.sidebar.Order Details'), icon: <FaCircle size={8} />, route: 'e-commerce/order/details' },
                            ],
                        },
                        {
                            id: 'pages-ecommerce-customers',
                            label: t('admin.sidebar.Customers'),
                            icon: <BiCircle size={8} />,
                            children: [
                                { id: 'pages-ecommerce-customers-list', label: t('admin.sidebar.Customers'), icon: <FaCircle size={8} />, route: 'e-commerce/customer' },
                                { id: 'pages-ecommerce-customers-details', label: t('admin.sidebar.Customer Details'), icon: <FaCircle size={8} />, route: 'e-commerce/customer/details' },
                                { id: 'pages-ecommerce-customers-add', label: t('admin.sidebar.Add Customers'), icon: <FaCircle size={8} />, route: 'e-commerce/customer/add' },
                            ],
                        },
                        { id: 'pages-ecommerce-manage-reviews', label: t('admin.sidebar.Manage Reviews'), icon: <BiCircle size={8} />, route: 'e-commerce/manage-reviews' },
                        { id: 'pages-ecommerce-checkout', label: t('admin.sidebar.Checkout'), icon: <BiCircle size={8} />, route: 'e-commerce/checkout' },
                    ],
                },
                {
                    id: 'pages-projects',
                    label: t('admin.sidebar.Projects'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { id: 'pages-projects-overview', label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'projects' },
                        { id: 'pages-projects-timeline', label: t('admin.sidebar.Timeline'), icon: <BiCircle size={8} />, route: 'projects/timeline' },
                    ],
                },
                {
                    id: 'pages-project',
                    label: t('admin.sidebar.Project'),
                    icon: <FaCircle size={8} />,
                    children: [
                        { id: 'pages-project-overview', label: t('admin.sidebar.Overview'), icon: <BiCircle size={8} />, route: 'project' },
                        { id: 'pages-project-files', label: t('admin.sidebar.Files'), icon: <BiCircle size={8} />, route: 'project/files' },
                        { id: 'pages-project-activity', label: t('admin.sidebar.Activity'), icon: <BiCircle size={8} />, route: 'project/activity' },
                        { id: 'pages-project-teams', label: t('admin.sidebar.Teams'), icon: <BiCircle size={8} />, route: 'project/teams' },
                        { id: 'pages-project-settings', label: t('admin.sidebar.Settings'), icon: <BiCircle size={8} />, route: 'project/settings' },
                    ],
                },
                { id: 'pages-referrals', label: t('admin.sidebar.Referrals'), icon: <FaCircle size={8} />, route: 'referrals' },
            ],
        },
        {
            id: 'apps',
            label: t('admin.sidebar.Apps'),
            icon: <IoApps />,
            children: [
                { id: 'apps-calendar', label: t('admin.sidebar.Calendar'), icon: <BiCircle size={8} />, route: 'apps/calendar' },
                { id: 'apps-invoice-generator', label: t('admin.sidebar.Invoice Generator'), icon: <BiCircle size={8} />, route: 'apps/invoice-generator' },
                { id: 'apps-file-manager', label: t('admin.sidebar.File Manager'), icon: <BiCircle size={8} />, route: 'apps/file-manager' },
            ],
        },
        {
            id: 'documentation',
            label: t('admin.sidebar.Documentation'),
            icon: <IoBookOutline />,
            route: 'documentation',
        },
        {
            id: 'components',
            label: t('admin.sidebar.Components'),
            icon: <IoIosApps />,
            route: 'components',
        },
    ];

    // Hàm tìm đường dẫn đến route được chọn
    const findPathToRoute = (items: MenuItem[], route: string, parentPath: string = ''): string[] | null => {
        for (const item of items) {
            const currentPath = parentPath ? `${parentPath}/${item.id}` : item.id;
            if (item.route === route) {
                return [currentPath];
            }
            if (item.children) {
                const childPath = findPathToRoute(item.children, route, currentPath);
                if (childPath) {
                    return [currentPath, ...childPath];
                }
            }
        }
        return null;
    };

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
            const currentPath = parentPath ? `${parentPath}/${item.id}` : item.id;
            const isExpanded = expandedSections.has(currentPath);

            const handleToggle = () => {
                setExpandedSections((prev) => {
                    const newSet = new Set(prev);
                    if (isExpanded) {
                        newSet.delete(currentPath);
                    } else {
                        // Đóng tất cả các mục menu cùng cấp
                        items.forEach((i) => {
                            const siblingPath = parentPath ? `${parentPath}/${i.id}` : i.id;
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
                                handleSelectRoute(item.route);
                            }
                        }}
                        selected={selectedPath.includes(currentPath)}
                        style={{
                            minHeight: 52,
                        }}
                    >
                        <ListItemIcon>
                            {item.icon ? (
                                item.icon
                            ) : item.children ? (
                                <FaCircle size={8} />
                            ) : selectedPath.includes(currentPath) ? (
                                <FaCircle size={8} />
                            ) : (
                                <BiCircle size={8} />
                            )}
                        </ListItemIcon>

                        {isOpen && <ListItemText primary={item.label} />}
                        {isOpen && item.children && (isExpanded ? <MdExpandLess /> : <MdExpandMore />)}
                    </ListItemButton>

                    {isOpen && item.children && (
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
                {renderMenuItems(menuItems, '', 2)}
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
