import { UpdateFormUseCase } from '../update-form';
import { FormRepository } from '../../domain/ports/form-repository';
import { Form } from '../../domain/entities/form';

const mockFormRepository: jest.Mocked<FormRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findPublishedById: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const existingForm: Form = {
  id: 'form-1',
  userId: 'user-1',
  title: 'Original',
  description: 'Original desc',
  fields: [],
  published: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UpdateFormUseCase', () => {
  let useCase: UpdateFormUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateFormUseCase(mockFormRepository);
  });

  it('should update an existing form', async () => {
    const updated = { ...existingForm, title: 'New title' };
    mockFormRepository.findById.mockResolvedValue(existingForm);
    mockFormRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute('form-1', {
      title: 'New title',
    });

    expect(result.title).toBe('New title');
    expect(mockFormRepository.update).toHaveBeenCalledWith('form-1', {
      title: 'New title',
    });
  });

  it('should trim title and description', async () => {
    mockFormRepository.findById.mockResolvedValue(existingForm);
    mockFormRepository.update.mockResolvedValue(existingForm);

    await useCase.execute('form-1', {
      title: '  Title with spaces  ',
      description: '  Desc with spaces  ',
    });

    expect(mockFormRepository.update).toHaveBeenCalledWith('form-1', {
      title: 'Title with spaces',
      description: 'Desc with spaces',
    });
  });

  it('should throw an error if the form does not exist', async () => {
    mockFormRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent', { title: 'Test' }),
    ).rejects.toThrow('Formulario no encontrado');
  });
});
