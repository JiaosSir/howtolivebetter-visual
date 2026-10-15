import { render, screen, act } from '@testing-library/react';
import AnimatedCounter from './AnimatedCounter';

describe('AnimatedCounter', () => {
  it('renders the counter element', async () => {
    await act(async () => {
      render(<AnimatedCounter end={100} />);
    });
    const counter = screen.getByTestId('animated-counter');
    expect(counter).toBeInTheDocument();
  });

  it('renders with suffix', async () => {
    await act(async () => {
      render(<AnimatedCounter end={100} suffix="%" />);
    });
    const counter = screen.getByTestId('animated-counter');
    expect(counter.textContent).toContain('%');
  });

  it('animates to the end value when visible', async () => {
    await act(async () => {
      render(<AnimatedCounter end={765} duration={50} />);
    });

    const counter = screen.getByTestId('animated-counter');
    expect(counter.textContent).toContain('765');
  });
});
