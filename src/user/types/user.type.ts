import { UserEntity } from '../user.entity';

export type User = Omit<UserEntity, 'hashPassword'>;
