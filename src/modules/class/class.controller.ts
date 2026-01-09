import { Controller, Post, Body } from '@nestjs/common';
import { ClassService  } from './class.service';
import { CreateClassDto } from './create-class.dto';

@Controller('classes')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post()
    create(@Body() createClassDto: CreateClassDto) {
        return this.classService.create(createClassDto);
    }
}