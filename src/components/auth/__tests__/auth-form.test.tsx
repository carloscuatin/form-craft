import { render, screen } from '@testing-library/react';

import { AuthForm } from '../auth-form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

// Mock server actions
jest.mock('@/app/actions/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
}));

describe('AuthForm', () => {
  describe('login mode', () => {
    it('should render the login heading', () => {
      render(<AuthForm mode="login" />);
      expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();
    });

    it('should render email and password fields', () => {
      render(<AuthForm mode="login" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });

    it('should not render the name field', () => {
      render(<AuthForm mode="login" />);
      expect(
        screen.queryByLabelText('Nombre completo'),
      ).not.toBeInTheDocument();
    });

    it('should render the submit button with login text', () => {
      render(<AuthForm mode="login" />);
      expect(
        screen.getByRole('button', { name: 'Iniciar sesión' }),
      ).toBeInTheDocument();
    });

    it('should render a link to the register page', () => {
      render(<AuthForm mode="login" />);
      const link = screen.getByRole('link', { name: 'Regístrate' });
      expect(link).toHaveAttribute('href', '/register');
    });

    it('should render the FormCraft brand link', () => {
      render(<AuthForm mode="login" />);
      const brandLink = screen.getByRole('link', { name: /FormCraft/i });
      expect(brandLink).toHaveAttribute('href', '/');
    });
  });

  describe('register mode', () => {
    it('should render the register heading', () => {
      render(<AuthForm mode="register" />);
      expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument();
    });

    it('should render name, email and password fields', () => {
      render(<AuthForm mode="register" />);
      expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });

    it('should render the submit button with register text', () => {
      render(<AuthForm mode="register" />);
      expect(
        screen.getByRole('button', { name: 'Crear cuenta' }),
      ).toBeInTheDocument();
    });

    it('should render a link to the login page', () => {
      render(<AuthForm mode="register" />);
      const link = screen.getByRole('link', { name: 'Inicia sesión' });
      expect(link).toHaveAttribute('href', '/login');
    });
  });
});
