import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import util from 'node:util';
import { pipeline } from 'node:stream';

const pump = util.promisify(pipeline);

export class UploadController {
  async upload(req: FastifyRequest, res: FastifyReply) {
    const data = await req.file();

    if (!data) {
      return res.status(400).send({ error: 'Nenhum arquivo enviado' });
    }

    const fileHash = crypto.randomBytes(16).toString('hex');
    const fileName = `${fileHash}-${data.filename}`;
    
    // Diretório base para os uploads (configurado no fastifyStatic)
    const uploadDir = path.resolve(__dirname, '../../../../uploads');
    
    // Certifique-se de que o diretório existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // Salva o arquivo no disco
    await pump(data.file, fs.createWriteStream(filePath));

    // Gera a URL completa usando o host da requisição e o prefixo definido no fastifyStatic (/uploads/)
    const fullUrl = `${req.protocol}://${req.hostname}/uploads/${fileName}`;

    return res.status(201).send({
      message: 'Upload concluído com sucesso',
      url: fullUrl,
      fileName,
    });
  }
}
