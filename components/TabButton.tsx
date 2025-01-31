import React from "react";

// Define the valid tab types
type Tab = "details" | "payment" | "reviews";

// Define the props for the TabButton component
interface TabButtonProps {
  tab: Tab; // The tab value for this button
  activeTab: Tab; // The currently active tab
  onClick: (tab: Tab) => void; // Function to handle tab changes
  children: React.ReactNode; // Content inside the button (e.g., icon and text)
}

// TabButton component
const TabButton = ({ tab, children, activeTab, onClick }: TabButtonProps) => (
  <button
    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
      activeTab === tab
        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200"
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
    onClick={() => onClick(tab)}
  >
    {children}
  </button>
);

export default TabButton;