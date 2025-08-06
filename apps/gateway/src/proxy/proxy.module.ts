import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProxyController } from "./proxy.controller";
import { ProxyService } from "./proxy.service";
import { PermissionService } from "../auth/permissions/permission.service";
import { ApiPermissionGuard } from "../auth/guards/api-permission.guard";

@Module({
  imports: [ConfigModule],
  controllers: [ProxyController],
  providers: [ProxyService, PermissionService, ApiPermissionGuard],
})
export class ProxyModule {}
