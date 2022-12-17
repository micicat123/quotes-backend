import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class CommonService {

    protected constructor(
        protected readonly repository: Repository<any>
    ){} 

    async create(data:any): Promise<any> {
        return this.repository.save(data);
    }

    async findBy(data: any): Promise<any>{
        console.log(data);
        return this.repository.findOneBy(data);
    }
}
