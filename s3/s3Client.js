const {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");

const region = "us-east-1";
const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
// Reminder: Currently using keys of IAM user that was created specifically
// just for accessing the bucket

const s3Client = new S3Client({ credentials, region });

function uploadProfImg(filePath) {
	const fileReadStream = fs.createReadStream(filePath);

	const uploadParams = {
		Bucket: "socio-us-east-1",
		Key: `public/profile-pics/${file.filename}`,
		Body: fileReadStream,
	};

	return s3Client.send(new PutObjectCommand(uploadParams));
}

function uploadFile(filePath) {
	const fileReadStream = fs.createReadStream(filePath);

	const uploadParams = {
        Bucket: "socio-us-east-1",
		Key: `public/post-images/${file.filename}`,
		Body: fileReadStream,
	};

	return s3Client.send(new PutObjectCommand(uploadParams));
}

function getS3Obj(Key) {
	const getParams = {
        Bucket: "socio-us-east-1",
		Key,
	};

	return s3Client.send(new GetObjectCommand(getParams));
}

module.exports = {
	s3Client,
	GetObjectCommand,
	uploadFile,
	uploadProfImg,
	getS3Obj,
};
