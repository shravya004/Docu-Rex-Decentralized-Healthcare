
export enum UserRole {
  Admin = 'Admin',
  Doctor = 'Doctor',
  Patient = 'Patient',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploaderId: string;
  patientId: string;
  hash: string;
}

export interface BlockchainEntry {
  documentHash: string;
  uploader: string;
  timestamp: string;
  verificationStatus: 'Verified' | 'Pending';
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
  details: string;
}
