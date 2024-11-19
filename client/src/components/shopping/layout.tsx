import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
    return (
        <div className="flex flex-col h-dvh">
            {/* common header */}
            <ShoppingHeader />
            <Outlet />
        </div>
    );
}

export default ShoppingLayout;