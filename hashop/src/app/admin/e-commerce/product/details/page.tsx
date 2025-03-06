'use client';

import { useCurrentRoute } from "@/context/SidebarConext";
import { useEffect } from "react";

function ECommerceProductDetailsPage() {
    const { setCurrentRoute } = useCurrentRoute();
    useEffect(() => {
        setCurrentRoute('e-commerce/product/details');
    }, [setCurrentRoute]);

    return (
        <div>
            <h1>Product Details</h1>
        </div>
    );
}

export default ECommerceProductDetailsPage;