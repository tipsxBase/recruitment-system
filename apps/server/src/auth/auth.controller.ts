import { Body, Controller, Get, Post, Res, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/lib/pipe/zod-validation.pipe';
import { SignInbDto, signInSchema } from './auth.schema';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from '@/lib/decorator/public.decorator';

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
    res.cookie('token', accessToken);
    return { accessToken };
  }

  @Public()
  @Post('validate-token')
  async validateToken(@Body() params: { token: string }) {
    return this.authService.validateToken(params.token);
  }
}
