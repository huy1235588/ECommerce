'use client';

import { DataGrid } from "@mui/x-data-grid";
import axios from "@/config/axios";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import "@/styles/pages/admin/product.css"
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function ECommerceProductsPage() {
    const router = useRouter();

    const [rows, setRows] = useState<Product[]>([]);

    // Lấy dữ liệu từ API
    const columns = [
        { field: '_id', headerName: 'ID', width: 50 },
        { field: 'title', headerName: 'TITLE', width: 100 },
        { field: 'type', headerName: 'TYPE', width: 80 },
        { field: 'price', headerName: 'PRICE', width: 150 },
        { field: 'developer', headerName: 'DEVELOPER', width: 150 },
        { field: 'publisher', headerName: 'PUBLISHER', width: 150 },
        { field: 'rating', headerName: 'RATING', width: 150 },
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
                />
            </div>
        </div>
    );
}

export default ECommerceProductsPage;