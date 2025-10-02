import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
    currentRoute: string;
    setCurrentRoute: (value: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [currentRoute, setCurrentRoute] = useState('');

    return (
        < SidebarContext.Provider value={{ currentRoute, setCurrentRoute }}>
            {children}
        </ SidebarContext.Provider>
    );
};

export const useCurrentRoute = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useLoading must be used within a SidebarProvider");
    }
    return context;
};
