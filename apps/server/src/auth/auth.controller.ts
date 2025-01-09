import { Body, Controller, Get, Post, Res, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/lib/pipe/zod-validation.pipe';
import { SignInbDto, signInSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from '@/lib/decorator/public.decorator';
import { AuthUser } from '@/lib/decorator/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(
    @Body() params: SignInbDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.signIn(params);
    return { accessToken };
  }

  @Get('current')
  async getCurrentUser(@AuthUser('userId') userId: number) {
    return this.authService.getCurrentAuthUser(userId);
  }

  @Post('validate-token')
  async validateToken(@Body() params: any) {
    console.log('validate-token', params);
  }
}
