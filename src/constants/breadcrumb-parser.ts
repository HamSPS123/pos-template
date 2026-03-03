import { BreadcrumbItem } from "@/lib/interface/breadcrumb.interface";
import { menuConfig, MenuItem, MenuSection } from "./menu-items";

const findSectionByHref = (href: string): MenuSection | null => {
    for (const section of menuConfig) {
        const item = section.items.find((item) => item.href === href);
        if (item) {
            return section;
        }
    }
    return null;
};

const findMenuItemByHref = (href: string): MenuItem | null => {
    for (const section of menuConfig) {
        const item = section.items.find((item) => item.href === href);
        if (item) {
            return item;
        }
    }
    return null;
};

export const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    // Root path — just show Dashboard
    if (pathname === "/") {
        return [{ label: "Dashboard", href: "/" }];
    }

    const items: BreadcrumbItem[] = [];
    const segments = pathname.split('/').filter(segment => segment);
    let currentPath = "";

    for (const segment of segments) {
        const previousPath = currentPath;
        currentPath = `${currentPath}/${segment}`;

        const menuItem = findMenuItemByHref(currentPath);

        if (menuItem) {
            const menuSection = findSectionByHref(menuItem.href!);

            if (items.length === 0) {
                items.push({ label: "Dashboard", href: "/" });
            }

            if (menuSection && !items.some(item => item.label === menuSection.section)) {
                const parentMenuItem = findMenuItemByHref(previousPath);
                const sectionHref = parentMenuItem ? parentMenuItem.href : previousPath;
                items.push({
                    label: menuSection.section,
                    href: sectionHref || "/",
                });
            }

            items.push({
                label: menuItem.title,
                href: currentPath,
            });

        } else {
            if (items.length === 0) {
                items.push({ label: "Dashboard", href: "/" });
            }

            items.push({
                label: segment.charAt(0).toUpperCase() + segment.slice(1),
                href: currentPath,
            });
        }
    }

    // Remove leading Dashboard when a section label follows
    if (items.length > 1 && items[0].label === "Dashboard") {
        const firstSectionItem = items.find(item => findSectionByHref(item.href) !== null);
        if (firstSectionItem) {
            items.shift();
        }
    }

    return items;
};
