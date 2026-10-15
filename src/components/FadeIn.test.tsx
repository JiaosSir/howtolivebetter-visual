import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FadeIn from './FadeIn';

describe('FadeIn', () => {
  it('renders children', () => {
    render(<FadeIn><div>Test content</div></FadeIn>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<FadeIn className="custom-class"><div>Test</div></FadeIn>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom delay', () => {
    const { container } = render(<FadeIn delay={200}><div>Test</div></FadeIn>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.transition).toContain('200ms');
  });
});
