import { AuthService } from './auth.service'
import { Body, Controller, Post } from '@nestjs/common'
import { LoginDto } from '@/lib/dtos/auth/main.dto'
import { Public } from '@/lib/decorators/public'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
