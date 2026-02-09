import { DeleteFormUseCase } from '../delete-form';
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
  title: 'Form',
  description: 'Desc',
  fields: [],
  published: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('DeleteFormUseCase', () => {
  let useCase: DeleteFormUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteFormUseCase(mockFormRepository);
  });

  it('should delete an existing form', async () => {
    mockFormRepository.findById.mockResolvedValue(existingForm);
    mockFormRepository.delete.mockResolvedValue();

    await useCase.execute('form-1');

    expect(mockFormRepository.findById).toHaveBeenCalledWith('form-1');
    expect(mockFormRepository.delete).toHaveBeenCalledWith('form-1');
  });

  it('should throw an error if the form does not exist', async () => {
    mockFormRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      'Formulario no encontrado',
    );

    expect(mockFormRepository.delete).not.toHaveBeenCalled();
  });
});
