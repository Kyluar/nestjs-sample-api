export const dbUrlValidation = {
  regex: /^mysql:\/\/([^:]+):(.+)@([^@:]+):(\d+)\/(\w+)$/,
  message: 'O format do DATABASE_URL é inválido',
}
