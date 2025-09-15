import { createContext, useContext, useState } from "react";

// Create the context
const DrawerContext = createContext();

// Create the provider
export function DrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

// Create a custom hook for easy use
export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}

export default DrawerContext;
