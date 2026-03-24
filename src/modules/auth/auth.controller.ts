import { Body, Controller, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { Public } from '@/lib/decorators/public'
import { LoginDto, LoginReturnDto } from '@/lib/dtos/auth/auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ZodResponse({
    status: 200,
    type: LoginReturnDto,
  })
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
