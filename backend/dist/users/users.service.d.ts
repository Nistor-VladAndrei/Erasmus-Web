import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(userData: {
        username: string;
        passwordHash: string;
        role: string;
        isValidated?: boolean;
    }): Promise<User>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    findPendingUsers(): Promise<User[]>;
    findAll(): Promise<User[]>;
    delete(id: string): Promise<void>;
}
