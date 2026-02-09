import { SubmitResponseUseCase } from '../submit-response';
import { FormRepository } from '../../domain/ports/form-repository';
import { ResponseRepository } from '../../domain/ports/response-repository';
import { Form } from '../../domain/entities/form';

const mockFormRepository: jest.Mocked<FormRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findPublishedById: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockResponseRepository: jest.Mocked<ResponseRepository> = {
  create: jest.fn(),
  findByFormId: jest.fn(),
  countByFormId: jest.fn(),
};

const publishedForm: Form = {
  id: 'form-1',
  userId: 'user-1',
  title: 'Survey',
  description: 'Description',
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  fields: [
    {
      id: 'field-1',
      type: 'short_text',
      label: 'Name',
      required: true,
    },
    {
      id: 'field-2',
      type: 'single_select',
      label: 'Favorite color',
      required: false,
      options: [
        { id: 'opt-1', label: 'Red' },
        { id: 'opt-2', label: 'Blue' },
      ],
    },
    {
      id: 'field-3',
      type: 'multi_select',
      label: 'Hobbies',
      required: true,
      options: [
        { id: 'hobby-1', label: 'Reading' },
        { id: 'hobby-2', label: 'Running' },
      ],
    },
  ],
};

describe('SubmitResponseUseCase', () => {
  let useCase: SubmitResponseUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SubmitResponseUseCase(
      mockFormRepository,
      mockResponseRepository,
    );
  });

  it('should submit a valid response', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(publishedForm);
    mockResponseRepository.create.mockResolvedValue(undefined);

    await useCase.execute({
      formId: 'form-1',
      answers: {
        'field-1': 'Carlos',
        'field-2': 'opt-1',
        'field-3': ['hobby-1'],
      },
    });

    expect(mockResponseRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the form does not exist', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        formId: 'non-existent',
        answers: {},
      }),
    ).rejects.toThrow('Formulario no encontrado o no está publicado');
  });

  it('should throw an error if a required field is empty', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(publishedForm);

    await expect(
      useCase.execute({
        formId: 'form-1',
        answers: { 'field-1': '', 'field-3': ['hobby-1'] },
      }),
    ).rejects.toThrow('El campo "Name" es obligatorio');
  });

  it('should throw an error if a required multi_select has an empty array', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(publishedForm);

    await expect(
      useCase.execute({
        formId: 'form-1',
        answers: { 'field-1': 'Carlos', 'field-3': [] },
      }),
    ).rejects.toThrow(
      'El campo "Hobbies" requiere al menos una selección',
    );
  });

  it('should throw an error if a select option is invalid', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(publishedForm);

    await expect(
      useCase.execute({
        formId: 'form-1',
        answers: {
          'field-1': 'Carlos',
          'field-2': 'invalid-option',
          'field-3': ['hobby-1'],
        },
      }),
    ).rejects.toThrow('Opción inválida para el campo "Favorite color"');
  });

  it('should throw an error if a multi_select option is invalid', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(publishedForm);

    await expect(
      useCase.execute({
        formId: 'form-1',
        answers: {
          'field-1': 'Carlos',
          'field-3': ['hobby-1', 'invalid'],
        },
      }),
    ).rejects.toThrow('Opción inválida para el campo "Hobbies"');
  });

  it('should allow optional fields without an answer', async () => {
    mockFormRepository.findPublishedById.mockResolvedValue(publishedForm);
    mockResponseRepository.create.mockResolvedValue(undefined);

    await useCase.execute({
      formId: 'form-1',
      answers: {
        'field-1': 'Carlos',
        'field-3': ['hobby-1'],
      },
    });

    expect(mockResponseRepository.create).toHaveBeenCalledTimes(1);
  });
});
