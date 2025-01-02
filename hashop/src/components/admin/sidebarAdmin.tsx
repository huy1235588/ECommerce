'use client'

import React, { useState } from 'react';
import { Collapse, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Image from 'next/image';
import { BiCircle, BiHome } from 'react-icons/bi';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { FaCircle, FaPager } from 'react-icons/fa';
import { IoApps, IoBookOutline } from "react-icons/io5";
import { IoIosApps, IoMdHelpCircleOutline, IoMdSettings } from 'react-icons/io';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho props của Sidebar
interface SidebarProps {
    isOpen: boolean; // Xác định trạng thái của Sidebar (mở hoặc đóng)
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

// Cấu trúc menu Sidebar
const menuItems: MenuItem[] = [
    // Dashboards
    {
        label: 'Dashboards',
        icon: <BiHome />,
        section: 'dashboards',
        subItems2: [
            { label: 'Default', level: 1, route: 'dashboards' },
            { label: 'Alternative', level: 1, route: 'dashboards/alternative' },
        ],
    },
    // Pages
    {
        label: 'Pages',
        icon: <FaPager />,
        section: 'pages',
        subSections: [
            {
                label: 'User',
                subItems2: [
                    { label: 'Overview', level: 2, route: 'user' },
                    { label: 'Leaderboard', level: 2, route: 'user/leaderboard' },
                    { label: 'Add User', level: 2, route: 'user/add' },
                ],
            },
            {
                label: 'User Profile',
                subItems2: [
                    { label: 'Profile', level: 2, route: 'use-profile' },
                    { label: 'Teams', level: 2, route: 'user-profile/teams' },
                    { label: 'Projects', level: 2, route: 'user-profile/projects' },
                    { label: 'Connections', level: 2, route: 'user-profile/connections' },
                    { label: 'My Profile', level: 2, route: 'user-profile/my-profile' },
                ],
            },
            {
                label: 'Account',
                subItems2: [
                    { label: 'Settings', level: 2, route: 'account/settings' },
                    { label: 'Billing', level: 2, route: 'account/billing' },
                    { label: 'Invoice', level: 2, route: 'account/invoice' },
                    { label: 'Api Keys', level: 2, route: 'account/api-keys' },
                ],
            },
            {
                label: 'E-commerce',
                subItems2: [
                    { label: 'Overview', level: 2, route: 'e-commerce' },
                    {
                        label: 'Product',
                        level: 2,
                        subItems3: [
                            { label: 'Products', level: 3, route: 'e-commerce/products' },
                            { label: 'Product Details', level: 3, route: 'e-commerce/product-details' },
                            { label: 'Add Product', level: 3, route: 'e-commerce/add-product' },
                        ],
                    },
                    {
                        label: 'Orders',
                        level: 2,
                        subItems3: [
                            { label: 'Orders', level: 3, route: 'e-commerce/orders' },
                            { label: 'Order Details', level: 3, route: 'e-commerce/order-details' },
                        ],
                    },
                    {
                        label: 'Customers',
                        level: 2,
                        subItems3: [
                            { label: 'Customers', level: 3, route: 'e-commerce/customers' },
                            { label: 'Customer Details', level: 3, route: 'e-commerce/customer-details' },
                            { label: 'Add Customers', level: 3, route: 'e-commerce/add-customer' },
                        ],
                    },
                    { label: 'Manage Reviews', level: 2, route: 'e-commerce/manage-reviews' },
                    { label: 'Checkout', level: 2, route: 'e-commerce/checkout' },
                ],
            },
            {
                label: 'Projects',
                subItems2: [
                    { label: 'Overview', level: 2, route: 'projects' },
                    { label: 'Timeline', level: 2, route: 'projects/timeline' },
                ],
            },
            {
                label: 'Project',
                subItems2: [
                    { label: 'Overview', level: 2, route: 'project' },
                    { label: 'Files', level: 2, route: 'project/files' },
                    { label: 'Activity', level: 2, route: 'project/activity' },
                    { label: 'Teams', level: 2, route: 'project/teams' },
                    { label: 'Settings', level: 2, route: 'project/settings' },
                ],
            },
            { label: 'Referrals', level: 1, route: 'referrals' },
        ],
    },
    // Apps
    {
        label: 'Apps',
        icon: <IoApps />,
        section: 'Apps',
        subItems2: [
            { label: 'Calendar', level: 1, route: 'apps/calendar' },
            { label: 'Invoice Generator', level: 1, route: 'apps/invoice-generator' },
            { label: 'File Manager', level: 1, route: 'apps/file-manager' },
        ],
    },
    // Documentation
    {
        label: 'Documentation',
        icon: <IoBookOutline />,
        section: 'Documentation',
        route: 'documentation',
    },
    // Components
    {
        label: 'Components',
        icon: <IoIosApps />,
        section: 'Components',
        route: 'components',
    },
];


const SidebarAdmin: React.FC<SidebarProps> = ({ isOpen }) => {
    const router = useRouter(); // Khởi tạo router

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
                <Image
                    src={isOpen ? '/logo/logo.png' : '/logo/logo-mini.png'}
                    width={isOpen ? 100 : 50}
                    height={40}
                    alt="logo"
                />
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
                    <IconButton>
                        <Image
                            src="/icons/flags/1x1/us.svg"
                            width={20}
                            height={20}
                            alt="us"
                        />
                    </IconButton>
                </div>
            )}
        </Drawer >
    );
};

export default SidebarAdmin;
