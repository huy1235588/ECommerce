import { Outlet, useLocation } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
    const location = useLocation();

    // Determine active based on the current path
    const activePath = location.pathname.split("/").pop(); // Lấy phần cuối cùng của đường dẫn, ví dụ: 'account'

    return (
        <div className="flex flex-col h-dvh">
            {/* common header */}
            <ShoppingHeader 
                active={activePath}
            />
            <Outlet />
        </div>
    );
}

export default ShoppingLayout;