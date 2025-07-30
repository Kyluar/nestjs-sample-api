import { Controller, Get } from '@nestjs/common'
import {
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus'

import { PrismaService } from '../prisma/prisma.service'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService
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
      () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ])
  }
}
