import { render, screen, fireEvent } from '@testing-library/react';
import AgentToggle from '@/components/AgentToggle';

describe('AgentToggle', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-view-mode', 'human');
  });

  it('renders a toggle button', () => {
    render(<AgentToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('switches html[data-view-mode] to agent on click', () => {
    render(<AgentToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-view-mode')).toBe('agent');
  });

  it('toggles back to human on second click', () => {
    render(<AgentToggle />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-view-mode')).toBe('human');
  });
});
