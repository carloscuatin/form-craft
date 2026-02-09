import { SignInUseCase } from '../sign-in';
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

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SignInUseCase(mockAuthRepository);
  });

  it('should authenticate a user with valid credentials', async () => {
    mockAuthRepository.signIn.mockResolvedValue(mockUser);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockUser);
    expect(mockAuthRepository.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should propagate the repository error if credentials are invalid', async () => {
    mockAuthRepository.signIn.mockRejectedValue(
      new Error('Invalid credentials'),
    );

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'wrong',
      }),
    ).rejects.toThrow('Invalid credentials');
  });
});
