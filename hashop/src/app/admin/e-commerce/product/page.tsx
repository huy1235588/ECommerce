'use client';

// import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import "@/styles/pages/admin/product.css"
import { Button, CardMedia, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

import DataGrid from '@/components/ui/dataGridView';

function ECommerceProductsPage() {
    const router = useRouter();
    // const [rows, setRows] = useState<Product[]>([]);

    const [data, setData] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    // Lấy dữ liệu từ API
    // const columns: GridColDef[] = [
    //     {
    //         field: 'headerImage',
    //         headerName: 'IMAGE',
    //         width: 270,
    //         align: 'center',
    //         renderCell: (params: GridRenderCellParams) => (
    //             <CardMedia
    //                 component="img"
    //                 image={params.value}
    //                 alt="Product image"
    //                 style={{
    //                     width: '100%',
    //                 }}
    //                 loading="lazy"
    //             />
    //         )
    //     },
    //     {
    //         field: 'title',
    //         headerName: 'TITLE',
    //         flex: 1,
    //         minWidth: 200,
    //         renderCell: (params: GridRenderCellParams) => (
    //             <div style={{ display: 'flex', flexDirection: 'column' }}>
    //                 <Link
    //                     href={`/admin/e-commerce/product/${params.row._id}`}
    //                     className="product-link"
    //                 >
    //                     {params.value}
    //                 </Link>
    //             </div>
    //         )
    //     },
    //     { field: 'type', headerName: 'TYPE', width: 70 },
    //     {
    //         field: 'price',
    //         headerName: 'PRICE',
    //         width: 70,
    //         renderCell: (params: GridRenderCellParams) => (
    //             <span>${params.value}</span>
    //         )
    //     },
    //     {
    //         field: 'discount',
    //         headerName: 'DISCOUNT',
    //         width: 90,
    //         align: 'center',
    //         renderCell: (params: GridRenderCellParams) => (
    //             <span>{params.value}%</span>
    //         )
    //     },
    //     {
    //         field: 'rating',
    //         headerName: 'RATING',
    //         width: 140,
    //         renderCell: (params: GridRenderCellParams) => (
    //             <Rating readOnly value={params.value} />
    //         )
    //     },
    // ];

    const columns = [
        {
            key: 'headerImage',
            label: 'IMAGE',
            width: 270,
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
        { key: 'price', label: 'PRICE', width: 70 },
        { key: 'discount', label: 'DISCOUNT', width: 90 },
        { key: 'rating', label: 'RATING', width: 140 }
    ];

    // Hàm lấy dữ liệu từ API
    const fetchData = async (page: number, rowsPerPage: number, sortColumn?: string, sortDirection?: 'asc' | 'desc') => {
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
                            rating
                            headerImage
                        }
                    }
                    
                }`
            });

            if (response.status === 200) {
                // setRows(response.data.data.products);

                setData(response.data.data.paginatedProducts.products);
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage]);

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
                {/* <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 20, 50]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id ?? ''}
                    rowHeight={120}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        }
                    }}
                    slotProps={{
                        cell: {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'width 0.3s ease',
                                textWrap: 'wrap',
                                lineHeight: '1.5',
                            }
                        }
                    }}
                /> */}

                <DataGrid
                    data={data}
                    columns={columns}
                    total={total}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setPage(page)}
                    onRowsPerPageChange={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                />

            </div>
        </div>
    );
}

export default ECommerceProductsPage;