import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { JwtService } from '@nestjs/jwt'
import { LoginDto, LoginReturnDto, loginReturnSchema } from '@/lib/dtos/auth'
import { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'

@Injectable()
export class AuthService {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
    private jwtService: JwtService
  ) {}

  async login({ password, email }: LoginDto): Promise<LoginReturnDto> {
    const { userUuid, isAuth } = await this.prisma.client.user.authenticate(
      email,
      password
    )

    if (!isAuth) {
      throw new UnauthorizedException('Invalid password')
    }

    const payload = { sub: userUuid }

    return loginReturnSchema.parse({
      accessToken: this.jwtService.sign(payload),
      userUuid,
    })
  }
}
