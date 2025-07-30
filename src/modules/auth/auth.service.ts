import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from '@/lib/dtos/auth/main.dto'
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login({ password, email }: LoginDto): Promise<{ accessToken: string }> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({
      where: { email: email as string },
    })

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`)
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = user.password === password

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userUuid: user.uuid }),
    }
  }
}
