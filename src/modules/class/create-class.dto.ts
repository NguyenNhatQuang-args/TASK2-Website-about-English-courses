import { IsString, IsNotEmpty, IsEnum, IsArray, IsInt } from 'class-validator';
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
    @IsInt({ each: true })
    studentIds: number[];
}