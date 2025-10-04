'use client';

import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import "@/styles/pages/admin/product.css"
import { Button, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";

import DataGrid from '@/components/ui/dataGridView';
import { useCurrentRoute } from "@/context/SidebarConext";

interface Column {
    key: keyof Product;
    label?: string;
    sortAble?: boolean;
    style?: React.CSSProperties;
    width?: number;
    renderCell?: (value: Product[keyof Product], row: Product) => React.ReactNode;
}


function ECommerceProductsPage() {
    const router = useRouter();
    const { setCurrentRoute } = useCurrentRoute();

    const [data, setData] = useState<Product[]>([]);                            // Dữ liệu bảng
    const [total, setTotal] = useState<number>(0);                              // Tổng số dòng
    const [page, setPage] = useState<number>(1);                                // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);                  // Số dòng mỗi trang
    const [totalLoaded, setTotalLoaded] = useState<number>(0);                  // Số bản ghi đã tải
    const [loading, setLoading] = useState<boolean>(false);                     // Trạng thái đang tải
    const [sortColumn, setSortColumn] = useState<string>('productId');          // Cột sắp xếp
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');  // Hướng sắp xếp
    const [queryString, setQueryString] = useState<string>('');                 // Từ khóa tìm kiếm

    // Các cột của bảng
    const columns: Column[] = [
        {
            key: 'header_image',
            label: '',
            width: 270,
            style: {
                textAlign: 'center',
                padding: 0
            },
            sortAble: false,
            renderCell: (value: Product[keyof Product]) => (
                <CardMedia
                    component="img"
                    image={value?.toString() || '/images/no-image.png'}
                    alt="Product image"
                    style={{
                        width: '100%',
                    }}
                    loading="lazy"
                />
            )
        },
        {
            key: 'name',
            label: 'TITLE',
            width: 200,
            style: {
                fontWeight: 'bold',
                textAlign: 'center'
            },
        },
        { key: 'type', label: 'TYPE', width: 70 },
        {
            key: 'price_overview',
            label: 'PRICE',
            width: 70,
            style: {
                textAlign: 'center'
            },
            renderCell: (value: Product[keyof Product]) => {
                // Nếu = 0 thì hiển thị FREE
                if (value === 0) {
                    return 'FREE';
                } else {
                    return `$${value}`;
                }
            }
        },
        {
            key: 'price_overview',
            label: 'DISCOUNT',
            width: 90,
            style: {
                textAlign: 'center'
            },
            renderCell: (value: Product[keyof Product]) => {
                if (value) {
                    return (
                        <span style={{ color: '#69ad3e' }}>
                            {String(value)}% <br />
                        </span>
                    );
                } else {
                    return '0%';
                }
            }
        },
    ];

    // Hàm lấy dữ liệu từ API
    const fetchData = async (
        page: number,
        rowsPerPage: number,
        sortColumn?: string,
        sortDirection?: 'asc' | 'desc',
        query?: string
    ) => {
        if (loading) return;
        setLoading(true);

        try {
            // Tạo tham số truy vấn
            let queryStr = `page: ${page}, limit: ${rowsPerPage}, sortColumn: "${sortColumn}", sortOrder: "${sortDirection}"`;

            // Nếu có query thì thêm vào
            if (query) {
                queryStr += `, query: "${query}"`;
            }

            // Gọi API
            const response = await axios.post('/graphql', {
                query: `query {
                    paginatedProducts(${queryStr}) {
                        products {
                            productId
                            title
                            type
                            price
                            discount
                            headerImage
                        }
                        totalProducts
                    }
                    
                }`
            });

            // Xử lý kết quả
            if (response.status === 200) {

                const results = response.data.data.paginatedProducts;
                const data = results.products;
                const total = results.totalProducts;

                setData((prev) => [...prev, ...data]);
                setTotalLoaded((prev) => prev + data.length);
                setTotal(total);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm tải dữ liệu
    useEffect(() => {
        fetchData(1, rowsPerPage * 5, 'productId', 'asc');
        setCurrentRoute('e-commerce/product');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Xử lý khi chuyển trang
    const handlePageChange = (newPage: number) => {
        const totalPagesLoaded = Math.ceil(totalLoaded / rowsPerPage); // Số trang đã tải
        if (newPage === totalPagesLoaded && totalLoaded < total) {
            // Tải thêm dữ liệu khi đến trang cuối của dữ liệu đã tải
            fetchData(totalLoaded, rowsPerPage * 5);
        }
        setPage(newPage);
    };

    // Hàm xử lý khi click vào dòng
    const handleRowClick = (id: number) => {
        router.push(`/admin/e-commerce/product/details?id=${id}`);
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-content">
                    {/* Header */}
                    <h1>Products</h1>

                    {/* Add product button */}
                    <Button className="add-product-btn"
                        variant="contained"
                        onClick={() => {
                            router.push('/admin/e-commerce/product/add');
                        }}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* List product */}
            <div>
                <DataGrid
                    data={data}
                    columns={columns}
                    total={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={(newRowsPerPage) => {
                        setData([]);
                        setTotalLoaded(0);
                        setRowsPerPage(newRowsPerPage);
                        setPage(1);
                        fetchData(1, newRowsPerPage * 5, sortColumn, sortDirection);
                    }}
                    onSort={(sortColumn, sortDirection) => {
                        setData([]);
                        setTotalLoaded(0);
                        setSortColumn(sortColumn);
                        setSortDirection(sortDirection);
                        fetchData(page, rowsPerPage, sortColumn, sortDirection, queryString);
                    }}
                    onSearch={(searchText) => {
                        // Nếu searchText rỗng thì tải lại dữ liệu
                        if (!searchText || searchText.trim() === '') {
                            setData([]);
                            setTotalLoaded(0);
                            setQueryString('');
                            fetchData(1, rowsPerPage * 5, sortColumn, sortDirection);
                            return;
                        }

                        // Tạo query
                        const query = {
                            $or: [
                                { title: { $regex: searchText, $options: "i" } },
                                { type: { $regex: searchText, $options: "i" } },
                                { price: { $eq: parseFloat(searchText) } },
                                { discount: { $eq: parseFloat(searchText) } }
                            ]
                        }

                        // Chuyển query sang chuỗi
                        const queryStr = JSON.stringify(query)
                            .replace(/"/g, '\\"') // Thay " thành \"
                            .replace(/\//g, '\\/'); // Thay / thành \/

                        // Lưu query
                        setQueryString(queryStr);

                        // Gọi API
                        setData([]);
                        setTotalLoaded(0);
                        fetchData(1, rowsPerPage * 5, sortColumn, sortDirection, queryStr);
                    }}
                    onRowClick={handleRowClick}
                    isLoading={loading}
                />

            </div>
        </div>
    );
}

export default ECommerceProductsPage;