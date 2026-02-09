import { render, screen, fireEvent } from '@testing-library/react';

import { FormField } from '@/core/domain/entities/form';

import { FieldRenderer } from '../field-renderer';

// Mock Radix UI Select (uses portals that don't work in jsdom)
jest.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    onValueChange: (v: string) => void;
    value: string;
  }) => (
    <div data-testid="select-root" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="select-trigger">{children}</button>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`select-item-${value}`}>{children}</div>,
}));

const shortTextField: FormField = {
  id: 'field-1',
  type: 'short_text',
  label: 'Full name',
  placeholder: 'Enter your name',
  required: true,
};

const longTextField: FormField = {
  id: 'field-2',
  type: 'long_text',
  label: 'Comments',
  placeholder: 'Write here...',
  required: false,
};

const numberField: FormField = {
  id: 'field-3',
  type: 'number',
  label: 'Age',
  required: true,
};

const dateField: FormField = {
  id: 'field-4',
  type: 'date',
  label: 'Birth date',
  required: false,
};

const singleSelectField: FormField = {
  id: 'field-5',
  type: 'single_select',
  label: 'Favorite color',
  required: true,
  options: [
    { id: 'opt-1', label: 'Red' },
    { id: 'opt-2', label: 'Blue' },
  ],
};

const multiSelectField: FormField = {
  id: 'field-6',
  type: 'multi_select',
  label: 'Hobbies',
  required: true,
  options: [
    { id: 'hobby-1', label: 'Reading' },
    { id: 'hobby-2', label: 'Running' },
  ],
};

describe('FieldRenderer', () => {
  describe('label rendering', () => {
    it('should render the field label', () => {
      render(<FieldRenderer field={shortTextField} />);
      expect(screen.getByText('Full name')).toBeInTheDocument();
    });

    it('should show a required indicator for required fields', () => {
      render(<FieldRenderer field={shortTextField} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should not show a required indicator for optional fields', () => {
      render(<FieldRenderer field={longTextField} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('should show a fallback label when label is empty', () => {
      const noLabel = { ...shortTextField, label: '' };
      render(<FieldRenderer field={noLabel} />);
      expect(screen.getByText('Campo sin nombre')).toBeInTheDocument();
    });
  });

  describe('error display', () => {
    it('should render the error message when provided', () => {
      render(
        <FieldRenderer field={shortTextField} error="This field is required" />,
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not render an error element when no error is provided', () => {
      const { container } = render(<FieldRenderer field={shortTextField} />);
      const errorParagraphs = container.querySelectorAll('p.text-red-500');
      expect(errorParagraphs).toHaveLength(0);
    });
  });

  describe('short_text field', () => {
    it('should render a text input with placeholder', () => {
      render(<FieldRenderer field={shortTextField} />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should call onChange when typing', () => {
      const onChange = jest.fn();
      render(
        <FieldRenderer field={shortTextField} value="" onChange={onChange} />,
      );
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
        target: { value: 'Carlos' },
      });
      expect(onChange).toHaveBeenCalledWith('Carlos');
    });

    it('should display the current value', () => {
      render(<FieldRenderer field={shortTextField} value="Carlos" />);
      expect(screen.getByPlaceholderText('Enter your name')).toHaveValue(
        'Carlos',
      );
    });
  });

  describe('long_text field', () => {
    it('should render a textarea with placeholder', () => {
      render(<FieldRenderer field={longTextField} />);
      const textarea = screen.getByPlaceholderText('Write here...');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('number field', () => {
    it('should render a number input', () => {
      render(<FieldRenderer field={numberField} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should call onChange with a number value', () => {
      const onChange = jest.fn();
      render(
        <FieldRenderer field={numberField} value={null} onChange={onChange} />,
      );
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '25' },
      });
      expect(onChange).toHaveBeenCalledWith(25);
    });

    it('should call onChange with null when input is cleared', () => {
      const onChange = jest.fn();
      render(
        <FieldRenderer field={numberField} value={25} onChange={onChange} />,
      );
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '' },
      });
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  describe('date field', () => {
    it('should render a date input', () => {
      render(<FieldRenderer field={dateField} />);
      const input = document.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('single_select field', () => {
    it('should render the select options', () => {
      render(<FieldRenderer field={singleSelectField} />);
      expect(screen.getByTestId('select-item-opt-1')).toHaveTextContent('Red');
      expect(screen.getByTestId('select-item-opt-2')).toHaveTextContent('Blue');
    });
  });

  describe('multi_select field', () => {
    it('should render all checkbox options', () => {
      render(<FieldRenderer field={multiSelectField} value={[]} />);
      expect(screen.getByText('Reading')).toBeInTheDocument();
      expect(screen.getByText('Running')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should disable the input when disabled prop is true', () => {
      render(<FieldRenderer field={shortTextField} disabled />);
      expect(screen.getByPlaceholderText('Enter your name')).toBeDisabled();
    });
  });
});
