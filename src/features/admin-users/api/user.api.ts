export {
  createAdmin as createAdminUser,
  deleteAdmin as deleteAdminUser,
  resetAdminPassword as resetAdminUserPassword,
  updateAdmin as updateAdminUser,
  useCreateAdmin as useCreateAdminUser,
  useDeleteAdmin as useDeleteAdminUser,
  useResetAdminPassword as useResetAdminUserPassword,
  useUpdateAdmin as useUpdateAdminUser,
} from "@/features/master-admins/api/admin.mutations";
export {
  getAdmins as getAdminUsers,
  useAdminsList as useAdminUsersList,
} from "@/features/master-admins/api/admin.queries";
export type {
  AdminDetail as AdminUserDetail,
  AdminListItem as AdminUserListItem,
  AdminListParams as AdminUserListParams,
  CreateAdminPayload as CreateAdminUserPayload,
  ResetAdminPasswordPayload as ResetAdminUserPasswordPayload,
  UpdateAdminPayload as UpdateAdminUserPayload,
} from "@/features/master-admins/api/admin.types";
