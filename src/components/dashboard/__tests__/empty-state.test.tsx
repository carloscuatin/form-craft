import { render, screen } from '@testing-library/react';

import { EmptyState } from '../empty-state';

describe('EmptyState', () => {
  it('should render the heading', () => {
    render(<EmptyState />);
    expect(screen.getByText('No tienes formularios aún')).toBeInTheDocument();
  });

  it('should render the description', () => {
    render(<EmptyState />);
    expect(screen.getByText(/Crea tu primer formulario/)).toBeInTheDocument();
  });

  it('should render a link to create a new form', () => {
    render(<EmptyState />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/builder/new');
  });

  it('should render the create button text', () => {
    render(<EmptyState />);
    expect(screen.getByText('Crear mi primer formulario')).toBeInTheDocument();
  });
});
