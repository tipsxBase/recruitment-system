import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthController } from "./auth.controller";
import { PermissionController } from "./controllers/permission.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { ApiPermissionGuard } from "./guards/api-permission.guard";
import { PermissionService } from "./permissions/permission.service";
import { EmailService } from "../common/services/email.service";
import { VerificationCodeService } from "../common/services/verification-code.service";
import { OperationLogService } from "../common/services/operation-log.service";
import { CleanupTask } from "../common/tasks/cleanup.task";

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          "JWT_SECRET",
          "recruitment-secret-key"
        ),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "24h"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, PermissionController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ApiPermissionGuard,
    PermissionService,
    EmailService,
    VerificationCodeService,
    OperationLogService,
    CleanupTask,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    ApiPermissionGuard,
    PermissionService,
    OperationLogService,
  ],
})
export class AuthModule {}
