export type Role = "user" | "manager" | "admin";
export type TodoStatus = "draft" | "in_progress" | "completed";

export const canViewTodo = (userRole: Role, isOwner: boolean) => {
    if (userRole === "admin" || userRole === "manager") return true;
    return isOwner; // Regular users can only see their own
};

export const canCreateTodo = (userRole: Role) => {
    return userRole === "user"; // Only regular users can create
};

export const canUpdateTodo = (userRole: Role, isOwner: boolean) => {
    return userRole === "user" && isOwner; // Only owner (user) can update
};

export const canDeleteTodo = (userRole: Role, isOwner: boolean, status: TodoStatus) => {
    if (userRole === "admin") return true; // Admin can delete anything
    if (userRole === "user" && isOwner && status === "draft") return true; // User can delete own draft
    return false;
};