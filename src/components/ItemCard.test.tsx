import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemCard from './ItemCard';
import type { BookItem } from '../types';

const mockItem: BookItem = {
  id: 'ch01-1',
  chapterId: 'ch01',
  number: 1,
  title: '系安全带，前排后排都系',
  cost: '不花钱。每次上车多花 2 秒。',
  plainLanguage: '坐轿车前排系上安全带，出车祸时被撞死的概率降四成多。',
  benefit: '系安全带能让轿车前排乘员受致命伤的风险下降 45%。',
  evidenceLevel: 'A',
  source: 'NHTSA (2024)',
  note: '后排也要系。',
  costCategory: '换寿命',
  valueTier: '极高',
  timeCost: '少',
  moneyCost: '不花钱',
  effortRequired: false,
};

describe('ItemCard', () => {
  it('renders the item title', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText(/系安全带/)).toBeInTheDocument();
  });

  it('renders the item number', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders the plain language summary', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText(/概率降四成多/)).toBeInTheDocument();
  });

  it('renders the evidence badge', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders the cost section', () => {
    render(<ItemCard item={mockItem} />);
    expect(screen.getByText(/不花钱/)).toBeInTheDocument();
  });

  it('shows note when expanded', async () => {
    const user = userEvent.setup();
    render(<ItemCard item={mockItem} />);
    await user.click(screen.getByText('查看详情'));
    expect(screen.getByText(/后排也要系/)).toBeInTheDocument();
  });

  it('does not show note section when note is empty', () => {
    const itemWithoutNote = { ...mockItem, note: '' };
    const { container } = render(<ItemCard item={itemWithoutNote} />);
    expect(container.textContent).not.toContain('备注');
  });
});
