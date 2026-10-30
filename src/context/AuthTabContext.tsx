import React, { useContext, useState } from "react";
type AuthRoutes = 'auth/login' | 'auth/register';
interface TabContextType {
  activeTab: AuthRoutes;
  setActiveTab: (tab: AuthRoutes) => void;
}

const AuthTabContext = React.createContext<TabContextType>({} as TabContextType);  
export function AuthTabProvider({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState<AuthRoutes>('auth/login'); // Inicializa con un valor predeterminado
    const [tabs, setTabs] = useState<AuthRoutes[]>([]);
    const setAllTabs = (newTabs: AuthRoutes[]) => {
        setTabs(newTabs);
    }
    const setActiveTabHandler = (tab: AuthRoutes) => {
        setActiveTab(tab);
    }
    const tabContext: TabContextType = {
        activeTab: activeTab,
        setActiveTab: setActiveTabHandler,
    }
    return (
        <AuthTabContext.Provider value={tabContext}>
            {children}
        </AuthTabContext.Provider>
    );
};

export const useAuthTabContext = () => useContext(AuthTabContext);