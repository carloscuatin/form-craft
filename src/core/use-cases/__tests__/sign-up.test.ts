import { SignUpUseCase } from '../sign-up';
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

describe('SignUpUseCase', () => {
  let useCase: SignUpUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SignUpUseCase(mockAuthRepository);
  });

  it('should register a user successfully', async () => {
    mockAuthRepository.signUp.mockResolvedValue(mockUser);

    const result = await useCase.execute({
      name: 'Carlos',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockUser);
    expect(mockAuthRepository.signUp).toHaveBeenCalledWith({
      name: 'Carlos',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should trim the name', async () => {
    mockAuthRepository.signUp.mockResolvedValue(mockUser);

    await useCase.execute({
      name: '  Carlos  ',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockAuthRepository.signUp).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Carlos' }),
    );
  });

  it('should throw an error if the name is empty', async () => {
    await expect(
      useCase.execute({
        name: '',
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('El nombre es obligatorio');
  });

  it('should throw an error if the name contains only spaces', async () => {
    await expect(
      useCase.execute({
        name: '   ',
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('El nombre es obligatorio');
  });
});
