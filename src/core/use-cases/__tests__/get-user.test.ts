import { GetUserUseCase } from '../get-user';
import { AuthRepository } from '../../domain/ports/auth-repository';
import { User } from '../../domain/entities/user';

const mockAuthRepository: jest.Mocked<AuthRepository> = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn(),
};

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Carlos',
};

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUserUseCase(mockAuthRepository);
  });

  it('should return the authenticated user', async () => {
    mockAuthRepository.getUser.mockResolvedValue(mockUser);

    const result = await useCase.execute();

    expect(result).toEqual(mockUser);
    expect(mockAuthRepository.getUser).toHaveBeenCalledTimes(1);
  });

  it('should return null if there is no authenticated user', async () => {
    mockAuthRepository.getUser.mockResolvedValue(null);

    const result = await useCase.execute();

    expect(result).toBeNull();
  });
});
