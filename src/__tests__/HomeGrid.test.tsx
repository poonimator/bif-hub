import { render, screen } from '@testing-library/react';
import HomeGrid from '@/components/HomeGrid';

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(0); return 0; };

describe('HomeGrid', () => {
  it('renders all four section cards', () => {
    render(<HomeGrid />);
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('shows index view with BIF title', () => {
    render(<HomeGrid />);
    expect(screen.getByText(/Bhutan Innovation Festival/i)).toBeInTheDocument();
  });
});
