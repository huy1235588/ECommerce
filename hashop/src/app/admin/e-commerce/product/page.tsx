'use client';

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import "@/styles/pages/admin/product.css"
import { Button, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function ECommerceProductsPage() {
    const router = useRouter();

    const [rows, setRows] = useState<Product[]>([]);

    // Lấy dữ liệu từ API

    const columns: GridColDef[] = [
        {
            field: 'headerImage',
            headerName: 'IMAGE',
            width: 220,
            align: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <Image
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}\\${params.value}`}
                    className="product-image"
                    width={200}
                    height={110}
                    alt={params.value}
                    style={{
                        padding: '0.005rem 0rem',
                    }}
                />
            )
        },
        {
            field: 'title',
            headerName: 'TITLE',
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link
                        href={`/admin/e-commerce/product/${params.row._id}`}
                        className="product-link"
                    >
                        {params.value}
                    </Link>
                </div>
            )
        },
        { field: 'type', headerName: 'TYPE', width: 70 },
        {
            field: 'price',
            headerName: 'PRICE',
            width: 70,
            renderCell: (params: GridRenderCellParams) => (
                <span>${params.value}</span>
            )
        },
        {
            field: 'discount',
            headerName: 'DISCOUNT',
            width: 90,
            align: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <span>{params.value}%</span>
            )
        },
        {
            field: 'rating',
            headerName: 'RATING',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Rating readOnly value={params.value} />
            )
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Product[]>('/api/product/all');

                if (response.status === 200) {
                    setRows(response.data);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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
                    rows={rows}
                    columns={columns}
                    paginationModel={{ pageSize: 5, page: 0 }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id ?? ''}
                    rowHeight={120}
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
                />
            </div>
        </div>
    );
}

export default ECommerceProductsPage;