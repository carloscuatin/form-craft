import { render, screen } from '@testing-library/react';

import { Navbar } from '../navbar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

// Mock server action
jest.mock('@/app/actions/auth', () => ({
  signOut: jest.fn(),
}));

// Mock ThemeToggle
jest.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe('Navbar', () => {
  it('should render the brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('FormCraft')).toBeInTheDocument();
  });

  it('should render a link to the dashboard', () => {
    render(<Navbar />);
    const link = screen.getByRole('link', { name: /FormCraft/i });
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('should render the new form button', () => {
    render(<Navbar />);
    expect(screen.getByText('Nuevo formulario')).toBeInTheDocument();
  });

  it('should render a link to create a new form', () => {
    render(<Navbar />);
    const link = screen.getByRole('link', { name: /Nuevo formulario/i });
    expect(link).toHaveAttribute('href', '/builder/new');
  });

  it('should display the user name when provided', () => {
    render(<Navbar userName="Carlos" />);
    expect(screen.getByText('Carlos')).toBeInTheDocument();
  });

  it('should not display a user name when not provided', () => {
    render(<Navbar />);
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument();
  });

  it('should render the theme toggle', () => {
    render(<Navbar />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should render the sign out button', () => {
    render(<Navbar />);
    const buttons = screen.getAllByRole('button');
    const signOutButton = buttons.find(
      (btn) => btn.getAttribute('type') === 'submit',
    );
    expect(signOutButton).toBeInTheDocument();
  });
});
