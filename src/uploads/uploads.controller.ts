import { BadRequestException, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { multerOptions } from './multer-options';
import { extname, join } from 'path';
import { createReadStream } from 'fs';

@Controller('uploads')
export class UploadsController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ){ }

    @Post('/:email')
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Param('email') email: number, 
    ) {

        if(file){
            const user = await this.userService.findBy({email: email});
            return await this.userService.create({
                user_id: parseInt(user.user_id), 
                picture: file.filename
             });
        }
        return file.filename;
    }

    @Get('picture/:id')
    async getProfilePicture(
        @Param('id') id: number, 
        @Res() res: Response
    ) {
        const user = await this.userService.findBy({user_id: id});
  
      if (!user || !user.picture) {
        throw new BadRequestException("Profile picture not found");
      }
  
      const contentType = getContentType(user.picture);
      res.set('Content-Type', contentType);
      const stream = createReadStream(`./uploads/${user.picture}`);
      stream.pipe(res);
    }
  }
  
  function getContentType(fileName: string): string {
    const ext = extname(fileName).toLowerCase();
    switch (ext) {
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
}
