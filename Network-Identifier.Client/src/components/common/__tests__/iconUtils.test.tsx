import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from '../Icon';

describe('getAppIcon', () => {
  it('renders an icon for a known app name', () => {
    const { container } = render(Icon('YouTube'));
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('is case-insensitive for app name matching', () => {
    const { container: upper } = render(Icon('YOUTUBE'));
    const { container: lower } = render(Icon('youtube'));
    expect(upper.querySelector('svg')).toBeInTheDocument();
    expect(lower.querySelector('svg')).toBeInTheDocument();
  });

  it('trims whitespace from app name', () => {
    const { container } = render(Icon('  YouTube  '));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders fallback icon for unknown app name', () => {
    const { container } = render(Icon('NonExistentApp'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies default className when no override is given', () => {
    const { container } = render(Icon('YouTube'));
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('class', 'w-5 h-5 flex-shrink-0 text-gray-700');
  });

  it('applies classNameOverride when provided', () => {
    const { container } = render(Icon('YouTube', 'w-6 h-6 text-indigo-600'));
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('class', 'w-6 h-6 text-indigo-600');
  });

  it('handles multi-word app names like Google Maps', () => {
    const { container } = render(Icon('Google Maps'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
