import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerOptions = {
  fileFilter: (req: any, file: any, callback: any) => {
    const ext = extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return callback(
        new HttpException(
          'Only images are allowed (jpg/jpeg/png)',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: './uploads',
    filename: (req: any, file: any, callback: any) => {
      const filename = `${uuidv4()}${extname(file.originalname || "noImageSet")}`;
      callback(null, filename);
    },
  }),
};