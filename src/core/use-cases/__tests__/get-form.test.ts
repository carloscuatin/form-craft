import { GetFormUseCase } from '../get-form';
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

const mockForm: Form = {
  id: 'form-1',
  userId: 'user-1',
  title: 'Form',
  description: 'Desc',
  fields: [],
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GetFormUseCase', () => {
  let useCase: GetFormUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetFormUseCase(mockFormRepository);
  });

  describe('execute (authenticated)', () => {
    it('should return the form if it exists', async () => {
      mockFormRepository.findById.mockResolvedValue(mockForm);

      const result = await useCase.execute('form-1');

      expect(result).toEqual(mockForm);
      expect(mockFormRepository.findById).toHaveBeenCalledWith('form-1');
    });

    it('should throw an error if the form does not exist', async () => {
      mockFormRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Formulario no encontrado',
      );
    });
  });

  describe('executePublic (public access)', () => {
    it('should return the published form', async () => {
      mockFormRepository.findPublishedById.mockResolvedValue(mockForm);

      const result = await useCase.executePublic('form-1');

      expect(result).toEqual(mockForm);
      expect(mockFormRepository.findPublishedById).toHaveBeenCalledWith(
        'form-1',
      );
    });

    it('should throw an error if the form is not published', async () => {
      mockFormRepository.findPublishedById.mockResolvedValue(null);

      await expect(useCase.executePublic('form-1')).rejects.toThrow(
        'Formulario no encontrado o no está publicado',
      );
    });
  });
});
