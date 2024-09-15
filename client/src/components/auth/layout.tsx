import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
    const location = useLocation();
    const urlImg =
        location.pathname.includes('login')
            ? "../../banner/elden-ring-1.jpg"
            : "../../banner/zenless-zone-zero-1g9cs.jpg"

    return (
        <main className="relative flex min-h-screen w-full">
            <div className="flex items-center justify-center bg-neutral-900 text-white w-2/5 px-4 py-12 sm:px-6 lg:px-8 z-10">
                <Outlet />
            </div>
            <aside className="flex-1 hidden lg:flex items-center justify-center bg-background w-1/2 px-12 no-select">
                <h1 className="text-4xl font-extrabold tracking-tight z-10">
                    Welcome to Ha
                </h1>
                <img
                    className="absolute top-0 right-0 bottom-0 left-0 opacity-50 ml-72"
                    src={urlImg}
                    alt=""
                />
            </aside>
        </main>
    );
}

export default AuthLayout;