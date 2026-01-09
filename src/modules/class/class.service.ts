import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../../entities/user.entity';
import { CreateClassDto } from './create-class.dto';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createClassDto: CreateClassDto) : Promise<Class> {
        const { studentIds, ...classData } = createClassDto;

        const students = await this.userRepository.findBy({
            id: In(studentIds),
        });

        const newClass = this.classRepository.create({
            ...classData,
            students: students,
        });

        return this.classRepository.save(newClass);
    }
}