import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class, ClassStudent, User, Status } from '../../entities';
import { CreateClassDto } from './create-class.dto';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,

        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createClassDto: CreateClassDto): Promise<Class> {
        const { studentIds, ...classData } = createClassDto;

        // Create the class first
        const newClass = this.classRepository.create(classData);
        const savedClass = await this.classRepository.save(newClass);

        // Add students through ClassStudent join table
        if (studentIds && studentIds.length > 0) {
            const students = await this.userRepository.findBy({
                id: In(studentIds),
            });

            for (const student of students) {
                const classStudent = this.classStudentRepository.create({
                    classId: savedClass.id,
                    studentId: student.id,
                    status: Status.ACTIVE,
                });
                await this.classStudentRepository.save(classStudent);
            }
        }

        return savedClass;
    }

    async findAll(): Promise<Class[]> {
        return this.classRepository.find({
            relations: ['course', 'teacher'],
        });
    }

    async findOne(id: string): Promise<Class | null> {
        return this.classRepository.findOne({
            where: { id },
            relations: ['course', 'teacher'],
        });
    }
}