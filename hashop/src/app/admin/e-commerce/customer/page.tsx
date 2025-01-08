'use client';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';

const columns: GridColDef[] = [
    { field: 'email', headerName: 'E-MAIL', width: 200 },
    { field: 'phone', headerName: 'PHONE', width: 150 },
    { field: 'country', headerName: 'COUNTRY', width: 150 },
    { field: 'accountStatus', headerName: 'ACCOUNT STATUS', width: 150 },
    { field: 'orders', headerName: 'ORDERS', width: 100 },
    { field: 'totalSpent', headerName: 'TOTAL SPENT', width: 150 },
    { field: 'lastActivity', headerName: 'LAST ACTIVITY', width: 200 },
];

const rows = [
    {
        id: 1,
        email: 'yorker@example.com',
        phone: '+1-954-236-3235',
        country: 'Norway',
        accountStatus: 'Active',
        orders: 3,
        totalSpent: '$882.00',
        lastActivity: 'Aug 16, 2020, 1:15 (ET)',
    },
    {
        id: 2,
        email: 'timothy@example.com',
        phone: '+1-083-642-4673',
        country: 'Italy',
        accountStatus: 'Active',
        orders: 9,
        totalSpent: '$2,238.29',
        lastActivity: 'Aug 16, 2020, 1:15 (ET)',
    },
    {
        id: 3,
        email: 'sam@example.com',
        phone: '+1-457-745-7555',
        country: 'Canada',
        accountStatus: 'Active',
        orders: '62 (+9 today)',
        totalSpent: '$9,281.58',
        lastActivity: 'Aug 16, 2020, 2:48 (ET)',
    },
    {
        id: 4,
        email: 'rachel@example.com',
        phone: '+1-232-643-3643',
        country: 'United States',
        accountStatus: 'Active',
        orders: 21,
        totalSpent: '$5,219.18',
        lastActivity: 'Aug 17, 2020, 12:41 (ET)',
    },
];

function CustomersPage() {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Customers
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2,
                }}
            >
                <Button variant="contained">Add Customers</Button>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    pageSizeOptions={[5]}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                />
            </div>
        </Box>
    );
}

export default CustomersPage;
