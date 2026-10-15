import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EvidenceBadge from './EvidenceBadge';

describe('EvidenceBadge', () => {
  it('renders the evidence level', () => {
    render(<EvidenceBadge level="A" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('applies correct color for level A', () => {
    const { container } = render(<EvidenceBadge level="A" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-emerald');
  });

  it('applies correct color for level B', () => {
    const { container } = render(<EvidenceBadge level="B" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-amber');
  });

  it('applies correct color for level C', () => {
    const { container } = render(<EvidenceBadge level="C" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-slate');
  });

  it('shows tooltip text on hover', () => {
    render(<EvidenceBadge level="A" />);
    const badge = screen.getByTitle(/荟萃分析/);
    expect(badge).toBeInTheDocument();
  });
});
