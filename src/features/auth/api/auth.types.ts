export type SessionUser = {
  id: string;
  fullName: string;
  initials: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  requirePasswordReset: boolean;
  company: {
    id: string;
    name: string;
  };
};

export type LoginPayload = {
  identifier: string;
  password: string;
};
