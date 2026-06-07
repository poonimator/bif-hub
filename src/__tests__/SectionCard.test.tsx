import { render, screen, fireEvent } from '@testing-library/react';
import SectionCard from '@/components/SectionCard';

describe('SectionCard', () => {
  it('renders the label', () => {
    render(
      <SectionCard
        id="vision"
        label="Vision"
        bg="#BB3308"
        textColor="#ffffff"
        onOpen={() => {}}
      />
    );
    expect(screen.getByText('Vision')).toBeInTheDocument();
  });

  it('calls onOpen with the card id when clicked', () => {
    const onOpen = jest.fn();
    render(
      <SectionCard
        id="vision"
        label="Vision"
        bg="#BB3308"
        textColor="#ffffff"
        onOpen={onOpen}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith('vision', expect.any(Object));
  });
});
