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

    async all(): Promise<any>{
        return this.repository.find();
    }

    async update(id:number, data:any): Promise<any> {
        return this.repository.update(id, data);
    } 

    async delete(id: number): Promise<any> {
        return this.repository.delete(id);
    }
}
