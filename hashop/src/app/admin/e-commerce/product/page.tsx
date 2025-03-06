'use client';

import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import "@/styles/pages/admin/product.css"
import { Button, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

import DataGrid from '@/components/ui/dataGridView';

interface Column {
    key: keyof Product;
    label?: string;
    sortAble?: boolean;
    style?: React.CSSProperties;
    width?: number;
    renderCell?: (value: any, row: any) => React.ReactNode;
}


function ECommerceProductsPage() {
    const router = useRouter();

    const [data, setData] = useState<Product[]>([]);            // Dữ liệu bảng
    const [total, setTotal] = useState<number>(0);              // Tổng số dòng
    const [page, setPage] = useState<number>(1);                // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);  // Số dòng mỗi trang
    const [totalLoaded, setTotalLoaded] = useState<number>(0);          // Số bản ghi đã tải
    const [loading, setLoading] = useState(false);              // Trạng thái đang tải

    // Các cột của bảng
    const columns: Column[] = [
        {
            key: 'headerImage',
            label: 'IMAGE',
            width: 270,
            style: {
                textAlign: 'center',
                padding: 0
            },
            renderCell: (value: string) => (
                <CardMedia
                    component="img"
                    image={value}
                    alt="Product image"
                    style={{
                        width: '100%',
                    }}
                    loading="lazy"
                />
            )
        },
        { key: 'title', label: 'TITLE', width: 200 },
        { key: 'type', label: 'TYPE', width: 70 },
        {
            key: 'price',
            label: 'PRICE',
            width: 70,
            style: {
                textAlign: 'center'
            },
            renderCell: (value: number) => {
                // Nếu = 0 thì hiển thị FREE
                if (value === 0) {
                    return 'FREE';
                } else {
                    return `$${value}`;
                }
            }
        },
        {
            key: 'discount',
            label: 'DISCOUNT',
            width: 90,
            style: {
                textAlign: 'center'
            },
        },
    ];

    // Hàm lấy dữ liệu từ API
    const fetchData = async (
        page: number,
        rowsPerPage: number,
        sortColumn?: string,
        sortDirection?: 'asc' | 'desc'
    ) => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axios.post('/graphql', {
                query: `query {
                    paginatedProducts(page: ${page}, limit: ${rowsPerPage}) {
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
        fetchData(1, rowsPerPage * 5);
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
                        setRowsPerPage(newRowsPerPage);
                        setPage(1);
                    }}
                    onSort={(sortColumn, sortDirection) =>
                        fetchData(page, rowsPerPage, sortColumn, sortDirection)
                    }
                />

            </div>
        </div>
    );
}

export default ECommerceProductsPage;