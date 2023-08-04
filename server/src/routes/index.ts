import * as AWS from "aws-sdk";
import Busboy from "busboy";
import asyncErrorWrapper from "../middleware/asyncErrorWrapper";
import endpoints from "../config/endpoints";
import multer from "multer";
import settings from "../config/settings";
import { Router } from "express";
import { PassThrough } from "stream";
import { getAccountDetail } from "./cbaRoute";

type RouteMethods = "get" | "post" | "put" | "delete" | "patch";

AWS.config.update({
  accessKeyId: settings.amazon.s3.accessKey,
  secretAccessKey: settings.amazon.s3.secretCredential,
  region: settings.amazon.s3.region,
});

const s3 = new AWS.S3();

const router = Router();

const upload = multer({ dest: "uploads/" });

endpoints.forEach((value) => {
  const method = value.method as RouteMethods;

  router[method](value.path, asyncErrorWrapper(value.handler));
});

router.post("/account/detail", asyncErrorWrapper(getAccountDetail));

router.post("/upload/file", (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let uploadedUrl: string;
  const uploadStartTime: Date = new Date();
  let busboyFinishTime: Date | null = null;
  let s3UploadFinishTime: Date | null = null;

  let fileKey: any = null;

  busboy.on("file", (name, file, info) => {
    const pass = new PassThrough();
    const params: AWS.S3.PutObjectRequest = {
      Bucket: settings.amazon.s3.bucketName,
      Key: info.filename,
      Body: pass,
      ACL: "public-read",
    };

    const uploadStream = s3.upload(params);

    // Pipe the file stream to the upload stream
    file.pipe(pass);

    // Get the uploaded file URL
    uploadStream.on("httpUploadProgress", (progress) => {
      console.log(
        `Uploaded ${progress.loaded} bytes of ${progress.total} bytes`
      );
    });

    uploadStream.send(function (err, data) {
      uploadedUrl = data.Location;
      fileKey = data.Key;
      s3UploadFinishTime = new Date();

      // return res.status(200).send({
      //   success: true,
      //   file: {
      //     url: uploadedUrl,
      //     name: fileKey,
      //   },
      //   time: {
      //     uploadStartTime: uploadStartTime,
      //     busboyFinishTime: busboyFinishTime,
      //     s3UploadFinishTime: s3UploadFinishTime,
      //   },
      // });

      if (busboyFinishTime && s3UploadFinishTime) {
        return res.status(200).send({
          success: true,
          file: {
            url: uploadedUrl,
            name: fileKey,
          },
          time: {
            uploadStartTime: uploadStartTime,
            busboyFinishTime: busboyFinishTime,
            s3UploadFinishTime: s3UploadFinishTime,
          },
        });
      }
    });
  });

  busboy.on("finish", function () {
    busboyFinishTime = new Date();
    // if (busboyFinishTime && s3UploadFinishTime) {
    //   res.json({
    //     file: {
    //       url: uploadedUrl,
    //       name: fileKey,
    //     },
    //     uploadStartTime: uploadStartTime,
    //     busboyFinishTime: busboyFinishTime,
    //     s3UploadFinishTime: s3UploadFinishTime,
    //   });
    // }
  });

  req.pipe(busboy);
});

export default router;
