import { Controller, Get, Inject } from '@nestjs/common'
import {
  HealthCheck,
  type HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import type { CustomPrismaService } from 'nestjs-prisma'
import type { ExtendedPrismaClient } from '@/lib/config/prisma/extensions'
import { Public } from '@/lib/decorators/public'

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
