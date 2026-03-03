import { useMemo } from "react";
import { usePermissions } from "./use-permissions";
import { menuConfig, type MenuSection } from "@/constants/menu-items";

export const useFilteredMenu = (): MenuSection[] => {
    const { hasPermission, hasAnyPermission } = usePermissions();

    const filteredMenu = useMemo(() => {
        return menuConfig.map((section) => {
            const filteredItems = section.items.filter((item) => {
                if (!item.permission) return true;

                if (typeof item.permission === "string") {
                    return hasPermission(item.permission);
                }

                if (Array.isArray(item.permission)) {
                    return hasAnyPermission(item.permission);
                }

                return false;
            }).map((item) => {
                if (item.submenu && item.submenu.length > 0) {
                    const filteredSubmenu = item.submenu.filter((subItem) => {
                        if (!subItem.permission) return true;

                        if (typeof subItem.permission === "string") {
                            return hasPermission(subItem.permission);
                        }

                        if (Array.isArray(subItem.permission)) {
                            return hasAnyPermission(subItem.permission);
                        }

                        return false;
                    });

                    return {
                        ...item,
                        submenu: filteredSubmenu,
                    };
                }

                return item;
            });

            return {
                ...section,
                items: filteredItems,
            };
        }).filter((section) => section.items.length > 0);
    }, [hasPermission, hasAnyPermission]);

    return filteredMenu;
};
