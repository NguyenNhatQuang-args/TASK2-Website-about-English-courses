// Role Interface
export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Role for creation
export interface IRoleCreate {
  name: string;
  description: string;
  permissions?: string[];
}

// Role for update
export interface IRoleUpdate {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}
