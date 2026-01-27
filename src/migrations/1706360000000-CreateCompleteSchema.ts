import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompleteSchema1706360000000 implements MigrationInterface {
    name = 'CreateCompleteSchema1706360000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Drop existing tables if any (reset)
        await queryRunner.query(`DROP TABLE IF EXISTS lesson_details CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS lessons CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS class_students CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS classes CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS courses CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE`);

        // Drop existing types
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS users_role_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_status_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS permission_action_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS permission_resource_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_level_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_kind_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS status_enum CASCADE`);

        // Create ENUM types
        await queryRunner.query(`CREATE TYPE status_enum AS ENUM ('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'TEACHER', 'STUDENT')`);
        await queryRunner.query(`CREATE TYPE permission_action_enum AS ENUM ('create', 'read', 'update', 'delete', 'manage')`);
        await queryRunner.query(`CREATE TYPE permission_resource_enum AS ENUM ('users', 'roles', 'permissions', 'courses', 'lessons', 'classes', 'profile')`);
        await queryRunner.query(`CREATE TYPE course_level_enum AS ENUM ('S', 'Pres', 'TC', 'MTC', 'FI', 'EF', 'TE', 'ME')`);
        await queryRunner.query(`CREATE TYPE course_kind_enum AS ENUM ('IELTS', 'TOEIC', '4SKILL')`);

        // 1. PERMISSIONS TABLE
        await queryRunner.query(`
            CREATE TABLE permissions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) UNIQUE NOT NULL,
                action permission_action_enum,
                resource permission_resource_enum,
                description TEXT DEFAULT '',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. ROLES TABLE
        await queryRunner.query(`
            CREATE TABLE roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(50) UNIQUE NOT NULL,
                description TEXT DEFAULT '',
                permissions TEXT DEFAULT '',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. USERS TABLE
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                fullname VARCHAR(100),
                phone VARCHAR(20),
                date_of_birth DATE,
                role user_role_enum DEFAULT 'STUDENT',
                status status_enum DEFAULT 'ACTIVE',
                permissions TEXT DEFAULT '',
                avatar_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. COURSES TABLE
        await queryRunner.query(`
            CREATE TABLE courses (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                thumbnail_url TEXT,
                level course_level_enum,
                kind course_kind_enum,
                status status_enum DEFAULT 'ACTIVE',
                created_by UUID REFERENCES users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. CLASSES TABLE
        await queryRunner.query(`
            CREATE TABLE classes (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                class_code VARCHAR(50) UNIQUE,
                description TEXT,
                course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
                teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
                level course_level_enum,
                kind course_kind_enum,
                max_students INTEGER DEFAULT 30,
                start_date DATE,
                end_date DATE,
                status status_enum DEFAULT 'ACTIVE',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. CLASS_STUDENTS TABLE
        await queryRunner.query(`
            CREATE TABLE class_students (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                status status_enum DEFAULT 'ACTIVE',
                UNIQUE(class_id, student_id)
            )
        `);

        // 7. LESSONS TABLE
        await queryRunner.query(`
            CREATE TABLE lessons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
                order_index INTEGER DEFAULT 0,
                duration_minutes INTEGER,
                status status_enum DEFAULT 'ACTIVE',
                created_by UUID REFERENCES users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 8. LESSON_DETAILS TABLE
        await queryRunner.query(`
            CREATE TABLE lesson_details (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                content_type VARCHAR(50) NOT NULL,
                title VARCHAR(255),
                content TEXT,
                video_url TEXT,
                audio_url TEXT,
                document_url TEXT,
                order_index INTEGER DEFAULT 0,
                duration_seconds INTEGER,
                is_required BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // CREATE INDEXES
        // Users
        await queryRunner.query(`CREATE INDEX idx_users_username ON users(username)`);
        await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
        await queryRunner.query(`CREATE INDEX idx_users_role ON users(role)`);
        await queryRunner.query(`CREATE INDEX idx_users_status ON users(status)`);

        // Permissions
        await queryRunner.query(`CREATE INDEX idx_permissions_name ON permissions(name)`);
        await queryRunner.query(`CREATE INDEX idx_permissions_action ON permissions(action)`);
        await queryRunner.query(`CREATE INDEX idx_permissions_resource ON permissions(resource)`);

        // Roles
        await queryRunner.query(`CREATE INDEX idx_roles_name ON roles(name)`);

        // Courses
        await queryRunner.query(`CREATE INDEX idx_courses_title ON courses(title)`);
        await queryRunner.query(`CREATE INDEX idx_courses_level ON courses(level)`);
        await queryRunner.query(`CREATE INDEX idx_courses_kind ON courses(kind)`);
        await queryRunner.query(`CREATE INDEX idx_courses_status ON courses(status)`);

        // Classes
        await queryRunner.query(`CREATE INDEX idx_classes_name ON classes(name)`);
        await queryRunner.query(`CREATE INDEX idx_classes_code ON classes(class_code)`);
        await queryRunner.query(`CREATE INDEX idx_classes_course ON classes(course_id)`);
        await queryRunner.query(`CREATE INDEX idx_classes_teacher ON classes(teacher_id)`);
        await queryRunner.query(`CREATE INDEX idx_classes_status ON classes(status)`);

        // Class Students
        await queryRunner.query(`CREATE INDEX idx_class_students_class ON class_students(class_id)`);
        await queryRunner.query(`CREATE INDEX idx_class_students_student ON class_students(student_id)`);

        // Lessons
        await queryRunner.query(`CREATE INDEX idx_lessons_title ON lessons(title)`);
        await queryRunner.query(`CREATE INDEX idx_lessons_course ON lessons(course_id)`);
        await queryRunner.query(`CREATE INDEX idx_lessons_class ON lessons(class_id)`);
        await queryRunner.query(`CREATE INDEX idx_lessons_status ON lessons(status)`);

        // Lesson Details
        await queryRunner.query(`CREATE INDEX idx_lesson_details_lesson ON lesson_details(lesson_id)`);
        await queryRunner.query(`CREATE INDEX idx_lesson_details_type ON lesson_details(content_type)`);

        // Update timestamp trigger function
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);

        // Apply triggers
        await queryRunner.query(`CREATE TRIGGER update_permissions_timestamp BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
        await queryRunner.query(`CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
        await queryRunner.query(`CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
        await queryRunner.query(`CREATE TRIGGER update_courses_timestamp BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
        await queryRunner.query(`CREATE TRIGGER update_classes_timestamp BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
        await queryRunner.query(`CREATE TRIGGER update_lessons_timestamp BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
        await queryRunner.query(`CREATE TRIGGER update_lesson_details_timestamp BEFORE UPDATE ON lesson_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop triggers
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_lesson_details_timestamp ON lesson_details`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_lessons_timestamp ON lessons`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_classes_timestamp ON classes`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_courses_timestamp ON courses`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_timestamp ON users`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_roles_timestamp ON roles`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_permissions_timestamp ON permissions`);

        // Drop function
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS lesson_details CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS lessons CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS class_students CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS classes CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS courses CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE`);

        // Drop types
        await queryRunner.query(`DROP TYPE IF EXISTS course_kind_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS course_level_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS permission_resource_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS permission_action_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS status_enum CASCADE`);
    }
}
