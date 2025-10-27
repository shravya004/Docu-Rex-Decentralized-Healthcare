import { User, UserRole, Document, BlockchainEntry, AuditLog } from '../types';

// --- Hashing Simulation ---
async function simpleHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// --- MOCK DATABASE (using localStorage for persistence) ---

const initializeData = <T,>(key: string, initialData: T[]): T[] => {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
    }
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
};

const MOCK_USERS_INITIAL: User[] = [
  { id: '1', name: 'Dr. Alice', email: 'alice@docurex.com', role: UserRole.Doctor },
  { id: '2', name: 'Bob Patient', email: 'bob@docurex.com', role: UserRole.Patient },
  { id: '3', name: 'Charlie Admin', email: 'charlie@docurex.com', role: UserRole.Admin },
];

let users: User[] = initializeData('docurex_users', MOCK_USERS_INITIAL);
let documents: Document[] = initializeData('docurex_documents', []);
let blockchain: BlockchainEntry[] = initializeData('docurex_blockchain', []);
let auditLogs: AuditLog[] = initializeData('docurex_auditlogs', []);

const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- API Functions ---

const createAuditLog = (user: User | {id: string, name: string, role: UserRole}, action: string, details: string) => {
    const newLog: AuditLog = {
        id: Date.now().toString(),
        action,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        timestamp: new Date().toISOString(),
        details,
    };
    auditLogs.unshift(newLog);
    saveToLocalStorage('docurex_auditlogs', auditLogs);
};

export const mockLogin = (email: string, pass: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      // NOTE: In a real app, 'pass' would be checked against a hashed password.
      if (user) {
        createAuditLog(user, 'Login', `User ${user.name} logged in.`);
        resolve(user);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const registerUser = (name: string, email: string, role: UserRole, creator: User): Promise<{ success: boolean, message: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (users.some(u => u.email === email)) {
                resolve({ success: false, message: 'User with this email already exists.' });
                return;
            }
            const newUser: User = {
                id: `user_${Date.now()}`,
                name,
                email,
                role,
            };
            users.push(newUser);
            saveToLocalStorage('docurex_users', users);
            createAuditLog(creator, 'User Creation', `Created new user '${name}' with role ${role}.`);
            resolve({ success: true, message: 'User created successfully.' });
        }, 500);
    });
};

export const getDocumentsForUser = (user: User): Promise<Document[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if([UserRole.Admin, UserRole.Doctor, UserRole.Auditor, UserRole.Researcher].includes(user.role)) {
                resolve([...documents]);
            } else { // Patient
                resolve(documents.filter(d => d.patientId === user.id));
            }
        }, 300);
    });
};

export const getBlockchainEntries = (): Promise<BlockchainEntry[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...blockchain]), 100);
    });
};

export const uploadDocument = async (file: File, uploader: User, patientId: string, storageLocation: 'On-Premises' | 'Cloud'): Promise<Document> => {
    const fileContent = await file.text();
    const hash = await simpleHash(file.name + file.size + fileContent);
    
    const newDocument: Document = {
        id: `doc_${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        uploaderId: uploader.id,
        patientId,
        hash,
        storageLocation,
    };

    const newBlockchainEntry: BlockchainEntry = {
        documentHash: hash,
        uploader: uploader.name,
        timestamp: new Date().toISOString(),
        verificationStatus: 'Pending',
    };
    
    documents.push(newDocument);
    blockchain.push(newBlockchainEntry);
    
    saveToLocalStorage('docurex_documents', documents);
    saveToLocalStorage('docurex_blockchain', blockchain);
    
    createAuditLog(uploader, 'Document Upload', `Uploaded '${file.name}' for patient ID ${patientId} to ${storageLocation}. Hash: ${hash.substring(0,8)}...`);

    return newDocument;
};

export const verifyDocumentOnChain = async (file: File): Promise<{ success: boolean; entry: BlockchainEntry | null }> => {
    const fileContent = await file.text();
    const hashToVerify = await simpleHash(file.name + file.size + fileContent);

    const entry = blockchain.find(b => b.documentHash === hashToVerify) || null;
    return { success: !!entry, entry };
};

export const getAuditLogs = (): Promise<AuditLog[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...auditLogs]), 300);
    });
};

export const verifyDocumentById = (docId: string, admin: User): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const doc = documents.find(d => d.id === docId);
            if (!doc) resolve(false);

            const chainEntry = blockchain.find(b => b.documentHash === doc!.hash);
            if (chainEntry) {
                chainEntry.verificationStatus = 'Verified';
                saveToLocalStorage('docurex_blockchain', blockchain);
                createAuditLog(admin, 'Document Verification', `Admin ${admin.name} verified document '${doc!.name}'.`);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
};

export const getPatients = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(users.filter(u => u.role === UserRole.Patient)), 300);
    });
}

export const getAllUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...users]), 300);
    })
}