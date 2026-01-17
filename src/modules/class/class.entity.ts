import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CourseLevel, CourseKind } from './enums';

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    className: string;

    @Column() 
    classCode: string;

    @Column({
         type: 'enum',
        enum: CourseLevel,
    }) 
    level: CourseLevel;

    @Column({
         type: 'enum',
        enum: CourseKind,
    })
    kindOfCourse: CourseKind;

    @ManyToMany(() => User)
    @JoinTable()
    students: User[];
}