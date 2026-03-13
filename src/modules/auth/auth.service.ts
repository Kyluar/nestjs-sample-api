import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { CustomPrismaService } from 'nestjs-prisma'
import type { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'
import {
  type LoginDto,
  type LoginReturnDto,
  loginReturnSchema,
} from '@/lib/dtos/auth'

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
