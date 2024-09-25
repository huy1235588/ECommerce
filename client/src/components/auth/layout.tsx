import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
    const location = useLocation();
    const urlImg =
        location.pathname.includes('login')
            ? "../../banner/elden-ring-1.jpg"
            : "../../banner/zenless-zone-zero-1g9cs.jpg"

    return (
        <main className="relative flex min-h-screen w-full">
            <div className="flex items-center justify-center bg-neutral-900 text-white w-full md:w-2/5 px-4 py-9 sm:px-6 lg:px-8 z-10">
                <Outlet />
            </div>
            <aside className="hidden md:flex flex-1 items-center justify-center bg-background px-12 no-select">
                <h1 className="text-4xl font-extrabold tracking-tight z-10">
                    Welcome to Ha
                </h1>
                <img
                    className="absolute top-0 bottom-0 left-64 right-0 opacity-50"
                    src={urlImg}
                    alt=""
                />
            </aside>
        </main>
    );
}

export default AuthLayout;