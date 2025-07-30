import { HttpStatus } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

type PrismaExceptionResponse = {
  statusCode: HttpStatus | null
  message: string
}
export function getPrismaExceptionResponse(
  exception: PrismaClientKnownRequestError
) {
  const info: PrismaExceptionResponse = {
    statusCode: null,
    message: '',
  }

  switch (exception.code) {
    case 'P2002': {
      info.statusCode = HttpStatus.CONFLICT
      const field = exception.meta!.target
      info.message = `Já existe um registro com o valor informado no campo: ${field as string}`
      break
    }
    case 'P2025': {
      info.statusCode = HttpStatus.NOT_FOUND
      info.message = 'Registro não encontrado'
      break
    }
    case 'P2001': {
      info.statusCode = HttpStatus.NOT_FOUND
      info.message = 'O registro não existe na condição especificada'
      break
    }
    case 'P2003': {
      info.statusCode = HttpStatus.BAD_REQUEST
      info.message = 'Violação de integridade referencial (chave estrangeira)'
      break
    }
    case 'P2000': {
      info.statusCode = HttpStatus.BAD_REQUEST
      info.message = 'O valor fornecido excede o tamanho máximo permitido'
      break
    }
    case 'P2004': {
      info.statusCode = HttpStatus.BAD_REQUEST
      info.message = 'Restrição violada no banco de dados'
      break
    }
    case 'P2005': {
      info.statusCode = HttpStatus.BAD_REQUEST
      info.message = 'Valor inválido para o tipo de campo'
      break
    }
    case 'P2006': {
      info.statusCode = HttpStatus.BAD_REQUEST
      info.message = 'Valor inválido fornecido'
      break
    }
  }

  return info
}
