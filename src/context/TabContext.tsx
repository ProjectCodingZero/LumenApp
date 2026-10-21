import { TabContext } from "expo-router/ui";
import React, { useState } from "react";

interface TabContextType<T> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  tabs: T[];
setTabs: (tabs: T[]) => void;
}

function TabProvider<T>({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState<T>(); // Inicializa con un valor predeterminado
    const [tabs, setTabs] = useState<T[]>([]);
    const setAllTabs = (newTabs: T[]) => {
        setTabs(newTabs);
    }
    const setActiveTabHandler = (tab: T) => {
        setActiveTab(tab);
    }
    const tabContext: TabContextType<T> = {
        activeTab: activeTab as T,
        setActiveTab: setActiveTabHandler,
        tabs,
        setTabs: setAllTabs,
    }
    return (
        <TabContext.Provider value={tabContext}>
            {children}
        </TabContext.Provider>
    );
};
export function useTabContext<T>() {
    const TabContext = React.createContext<TabContextType<T>>({} as TabContextType<T>);  
    return React.useContext<TabContextType<T>>(TabContext);
};
