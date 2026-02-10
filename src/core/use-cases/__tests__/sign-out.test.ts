import { SignOutUseCase } from '../sign-out';
import { AuthRepository } from '../../domain/ports/auth-repository';

const mockAuthRepository: jest.Mocked<AuthRepository> = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getUser: jest.fn(),
};

describe('SignOutUseCase', () => {
  let useCase: SignOutUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SignOutUseCase(mockAuthRepository);
  });

  it('should sign out successfully', async () => {
    mockAuthRepository.signOut.mockResolvedValue();

    await useCase.execute();

    expect(mockAuthRepository.signOut).toHaveBeenCalledTimes(1);
  });

  it('should propagate the error if sign out fails', async () => {
    mockAuthRepository.signOut.mockRejectedValue(new Error('Sign out failed'));

    await expect(useCase.execute()).rejects.toThrow('Sign out failed');
  });
});
