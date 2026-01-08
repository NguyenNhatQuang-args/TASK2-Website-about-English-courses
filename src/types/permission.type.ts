// Permission Interface
export interface IPermission {
  _id: string;
  name: string;
  action: string;
  resource: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Permission for creation
export interface IPermissionCreate {
  name: string;
  action: string;
  resource: string;
  description?: string;
}

// Permission for update
export interface IPermissionUpdate {
  name?: string;
  action?: string;
  resource?: string;
  description?: string;
  isActive?: boolean;
}
