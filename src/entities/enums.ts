// Common Status
export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// User Role
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

// Permission Action
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

// Permission Resource
export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  COURSES = 'courses',
  LESSONS = 'lessons',
  CLASSES = 'classes',
  PROFILE = 'profile',
}

// Course Level
export enum CourseLevel {
  S = 'S',
  PRES = 'Pres',
  TC = 'TC',
  MTC = 'MTC',
  FI = 'FI',
  EF = 'EF',
  TE = 'TE',
  ME = 'ME',
}

// Course Kind
export enum CourseKind {
  IELTS = 'IELTS',
  TOEIC = 'TOEIC',
  SKILL_4 = '4SKILL',
}
