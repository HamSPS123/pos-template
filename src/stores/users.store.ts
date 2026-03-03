import { create } from "zustand";
import { User, Role, Permission } from "@/types/user.interface";

const mockPermissions: Permission[] = [
    { id: "1", name: "Dashboard", code: "dashboard.view", description: "View dashboard" },
    { id: "2", name: "Sales - View", code: "sales.view", description: "View sales" },
    { id: "3", name: "Sales - Create", code: "sales.create", description: "Create sales" },
    { id: "4", name: "Sales - Edit", code: "sales.edit", description: "Edit sales" },
    { id: "5", name: "Sales - Delete", code: "sales.delete", description: "Delete sales" },
    { id: "6", name: "Inventory - View", code: "inventory.view", description: "View inventory" },
    { id: "7", name: "Inventory - Manage", code: "inventory.manage", description: "Manage inventory" },
    { id: "8", name: "Customers - View", code: "customers.view", description: "View customers" },
    { id: "9", name: "Customers - Manage", code: "customers.manage", description: "Manage customers" },
    { id: "10", name: "Settings - View", code: "settings.view", description: "View settings" },
    { id: "11", name: "Settings - Manage", code: "settings.manage", description: "Manage settings" },
    { id: "12", name: "Users - View", code: "users.view", description: "View users" },
    { id: "13", name: "Users - Manage", code: "users.manage", description: "Manage users" },
];

const mockRoles: Role[] = [
    {
        id: "1",
        name: "Admin",
        isActive: true,
        permissions: mockPermissions,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "2",
        name: "Manager",
        isActive: true,
        permissions: mockPermissions.filter(p =>
            !p.code?.includes("users.manage") && !p.code?.includes("settings.manage")
        ),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "3",
        name: "Cashier",
        isActive: true,
        permissions: mockPermissions.filter(p =>
            p.code?.includes("dashboard") ||
            p.code?.includes("sales.view") ||
            p.code?.includes("sales.create") ||
            p.code?.includes("customers.view")
        ),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
];

const mockUsers: User[] = [
    {
        id: "1",
        firstName: "Admin",
        lastName: "User",
        email: "admin@xaithavi.com",
        phone: "+8562012345678",
        roleId: "1",
        role: mockRoles[0],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: "2",
        firstName: "Manager",
        lastName: "User",
        email: "manager@xaithavi.com",
        phone: "+8562023456789",
        roleId: "2",
        role: mockRoles[1],
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
    },
    {
        id: "3",
        firstName: "Cashier",
        lastName: "User",
        email: "cashier@xaithavi.com",
        phone: "+8562034567890",
        roleId: "3",
        role: mockRoles[2],
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
    },
];

interface UsersStore {
    users: User[];
    roles: Role[];
    permissions: Permission[];
    getUserById: (id: string) => User | undefined;
    getRoleById: (id: string) => Role | undefined;
    getUsersByRole: (roleId: string) => User[];
    addUser: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => void;
    updateUser: (id: string, user: Partial<User>) => void;
    deleteUser: (id: string) => void;
    addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => void;
    updateRole: (id: string, role: Partial<Role>) => void;
    deleteRole: (id: string) => void;
    updateRolePermissions: (roleId: string, permissionIds: string[]) => void;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
    users: mockUsers,
    roles: mockRoles,
    permissions: mockPermissions,

    getUserById: (id: string) => {
        return get().users.find((user) => user.id === id);
    },

    getRoleById: (id: string) => {
        return get().roles.find((role) => role.id === id);
    },

    getUsersByRole: (roleId: string) => {
        return get().users.filter((user) => user.roleId === roleId);
    },

    addUser: (data) => {
        const role = get().roles.find(r => r.id === data.roleId);
        const newUser: User = {
            ...data,
            id: `user-${Date.now()}`,
            role: role,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        set({ users: [newUser, ...get().users] });
    },

    updateUser: (id, data) => {
        set({
            users: get().users.map((user) => {
                if (user.id === id) {
                    const role = data.roleId ? get().roles.find(r => r.id === data.roleId) : user.role;
                    return { ...user, ...data, role, updatedAt: new Date() };
                }
                return user;
            }),
        });
    },

    deleteUser: (id) => {
        set({ users: get().users.filter((user) => user.id !== id) });
    },

    addRole: (data) => {
        const newRole: Role = {
            ...data,
            id: `role-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        set({ roles: [newRole, ...get().roles] });
    },

    updateRole: (id, data) => {
        set({
            roles: get().roles.map((role) =>
                role.id === id ? { ...role, ...data, updatedAt: new Date() } : role
            ),
        });
    },

    deleteRole: (id) => {
        set({ roles: get().roles.filter((role) => role.id !== id) });
    },

    updateRolePermissions: (roleId, permissionIds) => {
        const permissions = get().permissions.filter(p => permissionIds.includes(p.id || ""));
        set({
            roles: get().roles.map((role) =>
                role.id === roleId ? { ...role, permissions, updatedAt: new Date() } : role
            ),
        });

        set({
            users: get().users.map((user) => {
                if (user.roleId === roleId) {
                    const updatedRole = get().roles.find(r => r.id === roleId);
                    return { ...user, role: updatedRole };
                }
                return user;
            }),
        });
    },
}));
