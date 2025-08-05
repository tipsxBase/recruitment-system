import { ROLES_KEY } from "@/auth/guards/roles.guard";
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
