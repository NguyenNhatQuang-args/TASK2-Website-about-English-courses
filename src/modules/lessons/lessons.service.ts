import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson, Class, Status } from '../../entities';
import { LessonsDto } from './lessons.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(dto: LessonsDto) {
    // Kiểm tra tên bài học trùng lặp
    const existLesson = await this.lessonRepository.findOne({ where: { title: dto.title } });
    if (existLesson) {
      throw new BadRequestException(`Bài học '${dto.title}' đã tồn tại!`);
    }

    // Kiểm tra ID lớp học hợp lệ nếu có
    if (dto.classId) {
      const classroom = await this.classRepository.findOne({ where: { id: dto.classId } });
      if (!classroom) {
        throw new NotFoundException(`Lớp học với ID ${dto.classId} không tồn tại!`);
      }
    }

    const newLesson = this.lessonRepository.create({
      title: dto.title,
      description: dto.description,
      classId: dto.classId,
      courseId: dto.courseId,
      orderIndex: dto.orderIndex || 0,
      status: Status.ACTIVE,
    });

    return await this.lessonRepository.save(newLesson);
  }

  async findAllByClass(classId: string) {
    return await this.lessonRepository.find({
      where: { classId },
      relations: ['class', 'course'],
      order: { orderIndex: 'ASC' }
    });
  }

  async findAll() {
    return await this.lessonRepository.find({
      relations: ['class', 'course'],
      order: { orderIndex: 'ASC' }
    });
  }

  async findOne(id: string) {
    return await this.lessonRepository.findOne({
      where: { id },
      relations: ['class', 'course'],
    });
  }
}