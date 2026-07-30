import {
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import type { AdminListItem } from "@/features/master-admins/api/admin.types";
import {
  adminUserInitials,
  adminUserLabel,
  formatAdminUserDate,
} from "@/features/admin-users/user.presentation";

import { UserActionsMenu } from "./user-actions-menu";

type UsersTableProps = {
  users: AdminListItem[];
  onView: (user: AdminListItem) => void;
  onEdit: (user: AdminListItem) => void;
};

export function UsersTable({ users, onView, onEdit }: UsersTableProps) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <EntityAvatar
                    initials={adminUserInitials(user)}
                    imageUrl={user.avatarUrl ?? undefined}
                    className="size-9"
                    fallbackClassName="text-xs"
                  />
                  <p className="font-medium text-foreground">{user.fullName}</p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.username}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-muted-foreground">{user.phone}</TableCell>
              <TableCell>{adminUserLabel(user.role)}</TableCell>
              <TableCell>
                <StatusBadge status={adminUserLabel(user.status)} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatAdminUserDate(user.joinedOn)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatAdminUserDate(user.lastLoginAt)}
              </TableCell>
              <TableCell className="text-right">
                <UserActionsMenu user={user} onView={onView} onEdit={onEdit} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
