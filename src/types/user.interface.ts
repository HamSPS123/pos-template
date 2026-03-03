export interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    passwordHash?: string;
    roleId?: string;
    role?: Role;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Role {
    id?: string;
    name?: string;
    isActive?: boolean;
    permissions?: Permission[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Permission {
    id?: string;
    name?: string;
    code?: string;
    description?: string;
}

export interface RolePermission {
    id?: string;
    roleId?: string;
    permissionId?: string;
    role?: Role;
    permission?: Permission;
}
