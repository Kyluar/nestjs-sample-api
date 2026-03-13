import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '@/lib/decorators/public'
import type { LoginDto } from '@/lib/dtos/auth/auth.dto'
import type { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
