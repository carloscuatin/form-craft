import { GetResponsesUseCase } from '../get-responses';
import { ResponseRepository } from '../../domain/ports/response-repository';
import { FormResponse } from '../../domain/entities/response';

const mockResponseRepository: jest.Mocked<ResponseRepository> = {
  create: jest.fn(),
  findByFormId: jest.fn(),
  countByFormId: jest.fn(),
};

const mockResponses: FormResponse[] = [
  {
    id: 'resp-1',
    formId: 'form-1',
    answers: { 'field-1': 'Answer 1' },
    submittedAt: new Date(),
  },
  {
    id: 'resp-2',
    formId: 'form-1',
    answers: { 'field-1': 'Answer 2' },
    submittedAt: new Date(),
  },
];

describe('GetResponsesUseCase', () => {
  let useCase: GetResponsesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetResponsesUseCase(mockResponseRepository);
  });

  it('should return the responses for a form', async () => {
    mockResponseRepository.findByFormId.mockResolvedValue(mockResponses);

    const result = await useCase.execute('form-1');

    expect(result).toEqual(mockResponses);
    expect(result).toHaveLength(2);
    expect(mockResponseRepository.findByFormId).toHaveBeenCalledWith(
      'form-1',
    );
  });

  it('should return an empty array if there are no responses', async () => {
    mockResponseRepository.findByFormId.mockResolvedValue([]);

    const result = await useCase.execute('form-no-responses');

    expect(result).toEqual([]);
  });
});
