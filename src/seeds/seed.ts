import { AppDataSource } from '../config/database';
import { User, Role, Permission } from '../entities';
import { UserRole, DEFAULT_ROLE_PERMISSIONS, ROLE_DESCRIPTIONS } from '../constants';
import { PermissionAction, PermissionResource } from '../constants/permissions.constant';

// Seed default roles
const seedRoles = async (): Promise<void> => {
  const roleRepository = AppDataSource.getRepository(Role);
  
  const roles = [
    {
      name: UserRole.ADMIN,
      description: ROLE_DESCRIPTIONS[UserRole.ADMIN],
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.ADMIN],
    },
    {
      name: UserRole.TEACHER,
      description: ROLE_DESCRIPTIONS[UserRole.TEACHER],
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.TEACHER],
    },
    {
      name: UserRole.USER,
      description: ROLE_DESCRIPTIONS[UserRole.USER],
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.USER],
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({ where: { name: roleData.name } });
    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    }
  }
};

// Seed default permissions
const seedPermissions = async (): Promise<void> => {
  const permissionRepository = AppDataSource.getRepository(Permission);
  const actions = Object.values(PermissionAction);
  const resources = Object.values(PermissionResource);

  for (const resource of resources) {
    for (const action of actions) {
      const name = `${action}:${resource}`;
      const existingPermission = await permissionRepository.findOne({ where: { name } });

      if (!existingPermission) {
        const permission = permissionRepository.create({
          name,
          action,
          resource,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
        });
        await permissionRepository.save(permission);
        console.log(`Created permission: ${name}`);
      }
    }
  }
};

// Seed default admin user
const seedAdminUser = async (): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);
  const adminUsername = 'admin';
  const existingAdmin = await userRepository.findOne({ where: { username: adminUsername } });

  if (!existingAdmin) {
    const admin = userRepository.create({
      username: adminUsername,
      fullname: 'System Administrator',
      phone: '0987654321',
      email: 'admin@example.com',
      dateOfBirth: new Date('1990-01-01'),
      password: 'Admin@123',
      role: UserRole.ADMIN,
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.ADMIN],
      isActive: true,
    });
    await userRepository.save(admin);
    console.log('Created default admin user');
    console.log('   Username: admin');
    console.log('   Password: Admin@123');
  }
};

// Main seed function
export const seedDefaultData = async (): Promise<void> => {
  console.log('\nSeeding default data...\n');

  try {
    await seedPermissions();
    await seedRoles();
    await seedAdminUser();
    console.log('\nDefault data seeding completed!\n');
  } catch (error) {
    console.error('Error seeding default data:', error);
  }
};
