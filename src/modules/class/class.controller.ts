import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ClassService  } from './class.service';
import { CreateClassDto } from './create-class.dto';

@Controller('classes')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createClassDto: CreateClassDto) {
        const result = await this.classService.create(createClassDto);
        return {
            success: true,
            message: 'Tạo lớp học thành công',
            data: result,
        };
    }
}