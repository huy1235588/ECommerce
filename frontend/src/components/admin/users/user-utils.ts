import { User } from "@/types";

/**
 * Export users to CSV file
 */
export function exportUsersToCSV(users: User[]) {
    const csv = [
        ["ID", "Email", "Username", "Name", "Country", "Role", "Verified", "Created At"],
        ...users.map((u) => [
            u.id,
            u.email,
            u.username,
            `${u.firstName} ${u.lastName}`,
            u.country,
            u.roles.join(", "),
            u.emailVerified ? "Yes" : "No",
            new Date(u.createdAt).toLocaleDateString(),
        ]),
    ]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Filter users based on search query, role and status
 */
export function filterUsers(
    users: User[],
    searchQuery: string,
    roleFilter: string,
    statusFilter: string
): User[] {
    let filtered = users;

    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(
            (user) =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Role filter
    if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.roles.includes(roleFilter));
    }

    // Status filter
    if (statusFilter !== "all") {
        filtered = filtered.filter((user) =>
            statusFilter === "verified" ? user.emailVerified : !user.emailVerified
        );
    }

    return filtered;
}
