function formatPath(path: any) {
  return String(path).replaceAll(',', '.')
}

function invalidTypeError(iss: any) {
  const path = formatPath(iss.path)
  return iss.input === undefined
    ? `Campo ${path} não enviado`
    : `Campo ${path} deve ser um(a) ${iss.expected}`
}

function sizeError(iss: any) {
  const path = formatPath(iss.path)
  if (iss.input !== '') {
    switch (iss.code) {
      case 'too_small':
        return iss.origin === 'string'
          ? `Campo ${path} deve ter no mínimo ${iss.minimum} caractere(s)`
          : `Campo ${path} deve ser maior que ${iss.minimum}`
      case 'too_big':
        return iss.origin === 'string'
          ? `Campo ${path} deve ter no máximo ${iss.maximum} caractere(s)`
          : `Campo ${path} deve ser menor que ${iss.maximum}`
    }
  }
  return `Campo ${path} não pode ser vazio`
}

function invalidFormatError(iss: any) {
  const path = formatPath(iss.path)
  return `Campo ${path} não é um ${iss.format} válido`
}

function invalidValueError(iss: any) {
  const path = formatPath(iss.path)
  return `Campo ${path} é inválido, precisa ser: ${iss.values.join(', ')}`
}

export function zodCustomErrors(iss: any) {
  let message = `Erro ${iss.code} não tratato no campo ${formatPath(iss.path)}`
  switch (iss.code) {
    case 'invalid_type':
      message = invalidTypeError(iss)
      break
    case 'too_small':
      message = sizeError(iss)
      break
    case 'too_big':
      message = sizeError(iss)
      break
    case 'invalid_format':
      message = invalidFormatError(iss)
      break
    case 'invalid_value':
      message = invalidValueError(iss)
      break
    case 'unrecognized_keys':
      message = `Campos não mapeados foram enviados: ${iss.keys.join(', ')}`
      break
  }
  return message
}
