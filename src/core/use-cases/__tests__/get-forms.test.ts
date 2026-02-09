import { GetFormsUseCase } from '../get-forms';
import { FormRepository } from '../../domain/ports/form-repository';
import { FormWithResponseCount } from '../../domain/entities/form';

const mockFormRepository: jest.Mocked<FormRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findPublishedById: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockForms: FormWithResponseCount[] = [
  {
    id: 'form-1',
    userId: 'user-1',
    title: 'Form 1',
    description: 'Desc 1',
    fields: [],
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    responseCount: 5,
  },
  {
    id: 'form-2',
    userId: 'user-1',
    title: 'Form 2',
    description: 'Desc 2',
    fields: [],
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    responseCount: 0,
  },
];

describe('GetFormsUseCase', () => {
  let useCase: GetFormsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetFormsUseCase(mockFormRepository);
  });

  it('should return the user forms with response counts', async () => {
    mockFormRepository.findAllByUserId.mockResolvedValue(mockForms);

    const result = await useCase.execute('user-1');

    expect(result).toEqual(mockForms);
    expect(result).toHaveLength(2);
    expect(mockFormRepository.findAllByUserId).toHaveBeenCalledWith('user-1');
  });

  it('should return an empty array if the user has no forms', async () => {
    mockFormRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute('user-no-forms');

    expect(result).toEqual([]);
  });
});
