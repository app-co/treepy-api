import AWS from "aws-sdk";
import crypto from "node:crypto";
import path from "node:path";

const region = process.env.AWS_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
const bucket = process.env.AWS_BUCKET as string;

const s3 = new AWS.S3({
	region,
	accessKeyId,
	secretAccessKey,
});

/**
 * Faz upload de um Buffer para o S3 e retorna a URL pública do arquivo.
 *
 * @param buffer   - Conteúdo do arquivo em Buffer
 * @param mimeType - Tipo MIME do arquivo (ex: "image/jpeg")
 * @param originalName - Nome original do arquivo (usado para obter a extensão)
 * @param folder   - Pasta dentro do bucket (ex: "parceiros")
 */
export async function uploadToS3(
	buffer: Buffer,
	mimeType: string,
	originalName: string,
	folder = "uploads",
): Promise<string> {
	const ext = path.extname(originalName) || ".jpg";
	const hash = crypto.randomBytes(8).toString("hex");
	const key = `${folder}/${hash}${ext}`;

	const result = await s3
		.upload({
			Bucket: bucket,
			Key: key,
			Body: buffer,
			ContentType: mimeType,
			// ACL: "public-read",
		})
		.promise();

	return result.Location;
}

/**
 * Remove um arquivo do S3 pela URL pública.
 *
 * @param fileUrl - URL pública do arquivo no S3
 */
export async function deleteFromS3(fileUrl: string): Promise<void> {
	const url = new URL(fileUrl);
	// Remove a barra inicial do pathname para obter o Key
	const key = url.pathname.replace(/^\//, "");

	await s3
		.deleteObject({
			Bucket: bucket as string,
			Key: key,
		})
		.promise();
}
