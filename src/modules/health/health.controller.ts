import { Controller, Get, Inject } from '@nestjs/common'
import {
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus'
import { Public } from '@/lib/decorators/public'
import { CustomPrismaService } from 'nestjs-prisma'
import { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => Promise.resolve({ server: { status: 'up' } }),
    ])
  }

  @Get('services')
  @HealthCheck()
  checkServices() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ])
  }
  @Get('database')
  @HealthCheck()
  checkPrisma() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('prisma', this.prisma.client),
    ])
  }
}
