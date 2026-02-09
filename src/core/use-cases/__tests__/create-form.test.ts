import { CreateFormUseCase } from '../create-form';
import {
  FormRepository,
  CreateFormDTO,
} from '../../domain/ports/form-repository';
import { Form } from '../../domain/entities/form';

const mockFormRepository: jest.Mocked<FormRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findPublishedById: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const baseDTO: CreateFormDTO = {
  userId: 'user-1',
  title: 'My form',
  description: 'A description',
  fields: [],
};

const mockForm: Form = {
  id: 'form-1',
  userId: 'user-1',
  title: 'My form',
  description: 'A description',
  fields: [],
  published: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateFormUseCase', () => {
  let useCase: CreateFormUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateFormUseCase(mockFormRepository);
  });

  it('should create a form successfully', async () => {
    mockFormRepository.create.mockResolvedValue(mockForm);

    const result = await useCase.execute(baseDTO);

    expect(result).toEqual(mockForm);
    expect(mockFormRepository.create).toHaveBeenCalledWith({
      ...baseDTO,
      title: 'My form',
      description: 'A description',
    });
  });

  it('should trim title and description', async () => {
    mockFormRepository.create.mockResolvedValue(mockForm);

    await useCase.execute({
      ...baseDTO,
      title: '  My form  ',
      description: '  A description  ',
    });

    expect(mockFormRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'My form',
        description: 'A description',
      }),
    );
  });

  it('should throw an error if the title is empty', async () => {
    await expect(useCase.execute({ ...baseDTO, title: '' })).rejects.toThrow(
      'El título del formulario es obligatorio',
    );
  });

  it('should throw an error if the title contains only spaces', async () => {
    await expect(
      useCase.execute({ ...baseDTO, title: '   ' }),
    ).rejects.toThrow('El título del formulario es obligatorio');
  });
});
