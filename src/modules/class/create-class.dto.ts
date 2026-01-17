import { IsString, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { CourseLevel, CourseKind }  from './enums';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    className: string;

    @IsString()
    @IsNotEmpty()
    classCode: string;

    @IsEnum(CourseLevel)
    @IsNotEmpty()
    level: CourseLevel;

    @IsEnum(CourseKind)
    @IsNotEmpty()
    kindOfCourse: CourseKind;

    @IsArray()
    @IsString({ each: true })
    studentIds: string[];
}