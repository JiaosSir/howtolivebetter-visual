import { render, screen } from '@testing-library/react';
import ReadingProgressBar from './ReadingProgressBar';

describe('ReadingProgressBar', () => {
  it('renders the progress bar', () => {
    render(<ReadingProgressBar />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
  });

  it('starts at 0% width', () => {
    render(<ReadingProgressBar />);
    const bar = screen.getByRole('progressbar');
    const fill = bar.firstChild as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('has correct accessibility attributes', () => {
    render(<ReadingProgressBar />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });
});
