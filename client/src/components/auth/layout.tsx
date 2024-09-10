import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <main className="flex min-h-screen w-full">
            <div className="flex items-center justify-center bg-background w-2/6 px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
            <aside className="flex-1 hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
                <div className="max-w-md space-y-6 text-center text-primary-foreground">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome
                    </h1>
                </div>
            </aside>
        </main>
    );
}

export default AuthLayout;