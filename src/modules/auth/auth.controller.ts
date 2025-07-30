import { AuthService } from './auth.service'
import { Body, Controller, Post } from '@nestjs/common'
import { LoginDto } from '@/lib/dtos/auth/main.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
