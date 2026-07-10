import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StackedTooltip } from '../StackedTooltip';

describe('StackedTooltip', () => {
  const mockPayload = [
    { name: 'TCP', value: 1200, color: '#312E81' },
    { name: 'UDP', value: 800, color: '#6366F1' },
  ];

  it('renders null when not active', () => {
    const { container } = render(<StackedTooltip active={false} payload={mockPayload} label="TestApp" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders null when payload is empty', () => {
    const { container } = render(<StackedTooltip active={true} payload={[]} label="TestApp" />);
    expect(container.innerHTML).toBe('');
  });

  it('displays the app label', () => {
    render(<StackedTooltip active={true} payload={mockPayload} label="YouTube" />);
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  it('displays protocol names', () => {
    render(<StackedTooltip active={true} payload={mockPayload} label="YouTube" />);
    expect(screen.getByText('TCP')).toBeInTheDocument();
    expect(screen.getByText('UDP')).toBeInTheDocument();
  });

  it('displays protocol values as formatted numbers', () => {
    render(<StackedTooltip active={true} payload={mockPayload} label="YouTube" />);
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });

  it('displays the Total label', () => {
    render(<StackedTooltip active={true} payload={mockPayload} label="YouTube" />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('displays total sum as formatted number', () => {
    render(<StackedTooltip active={true} payload={mockPayload} label="YouTube" />);
    const totalElements = screen.getAllByText('2000');
    expect(totalElements.length).toBe(1);
  });

  it('handles a single protocol entry', () => {
    render(<StackedTooltip active={true} payload={[{ name: 'TCP', value: 500, color: '#312E81' }]} label="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('TCP')).toBeInTheDocument();
  });

  it('formats large numbers with toLocaleString', () => {
    render(<StackedTooltip active={true} payload={[{ name: 'TCP', value: 1234567, color: '#312E81' }]} label="App" />);
    const all = screen.getAllByText((content) => content.replace(/\D/g, '') === '1234567');
    expect(all.length).toBe(2);
  });
});
