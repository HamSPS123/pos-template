import { useAuthStore } from "@/stores/auth.store";
import { useUsersStore } from "@/stores/users.store";
import { useMemo } from "react";

export const usePermissions = () => {
    const { user } = useAuthStore();
    const { roles } = useUsersStore();

    const userRole = useMemo(() => {
        if (!user?.roleId) return null;
        return roles.find(role => role.id === user.roleId);
    }, [user, roles]);

    const userPermissions = useMemo(() => {
        return userRole?.permissions || [];
    }, [userRole]);

    const hasPermission = (permissionCode: string): boolean => {
        if (!user || !userRole) return true;
        return userPermissions.some(p => p.code === permissionCode);
    };

    const hasAnyPermission = (permissionCodes: string[]): boolean => {
        if (!user || !userRole) return true;
        return permissionCodes.some(code => hasPermission(code));
    };

    const hasAllPermissions = (permissionCodes: string[]): boolean => {
        if (!user || !userRole) return true;
        return permissionCodes.every(code => hasPermission(code));
    };

    const canAccess = (module: string, action: string = "view"): boolean => {
        return hasPermission(`${module}.${action}`);
    };

    const canManage = (module: string): boolean => {
        return hasPermission(`${module}.manage`);
    };

    return {
        user,
        userRole,
        userPermissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccess,
        canManage,
    };
};
