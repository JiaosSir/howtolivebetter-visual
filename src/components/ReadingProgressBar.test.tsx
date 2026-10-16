import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ReadingProgressBar from './ReadingProgressBar';

function NavAway() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/other')}>go</button>;
}

function renderBar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ReadingProgressBar />
      <NavAway />
    </MemoryRouter>
  );
}

describe('ReadingProgressBar', () => {
  it('renders the progress bar', () => {
    renderBar();
    const bar = screen.getByRole('progressbar');
    expect(bar).toBeInTheDocument();
  });

  it('starts at 0% width', () => {
    renderBar();
    const bar = screen.getByRole('progressbar');
    const fill = bar.firstChild as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('has correct accessibility attributes', () => {
    renderBar();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('resets progress and scrolls to top when route changes', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });

    renderBar();
    fireEvent.scroll(window);

    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('50%');

    fireEvent.click(screen.getByText('go'));

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(fill.style.width).toBe('0%');
  });
});
