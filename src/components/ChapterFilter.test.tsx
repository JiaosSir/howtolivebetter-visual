import { render, screen, fireEvent } from '@testing-library/react';
import ChapterFilter from './ChapterFilter';

describe('ChapterFilter', () => {
  const evidenceCounts = { A: 31, B: 13, C: 4 };

  it('renders all filter buttons', () => {
    render(
      <ChapterFilter
        activeFilter="all"
        onFilterChange={() => {}}
        evidenceCounts={evidenceCounts}
      />
    );
    expect(screen.getByText('全部')).toBeInTheDocument();
    expect(screen.getByText('A 级')).toBeInTheDocument();
    expect(screen.getByText('B 级')).toBeInTheDocument();
    expect(screen.getByText('C 级')).toBeInTheDocument();
  });

  it('shows counts next to each level', () => {
    render(
      <ChapterFilter
        activeFilter="all"
        onFilterChange={() => {}}
        evidenceCounts={evidenceCounts}
      />
    );
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('highlights the active filter', () => {
    render(
      <ChapterFilter
        activeFilter="A"
        onFilterChange={() => {}}
        evidenceCounts={evidenceCounts}
      />
    );
    const activeButton = screen.getByText('A 级').closest('button');
    expect(activeButton).toHaveClass('bg-[#32adfe]/20');
  });

  it('calls onFilterChange when a button is clicked', () => {
    const onFilterChange = vi.fn();
    render(
      <ChapterFilter
        activeFilter="all"
        onFilterChange={onFilterChange}
        evidenceCounts={evidenceCounts}
      />
    );
    fireEvent.click(screen.getByText('A 级'));
    expect(onFilterChange).toHaveBeenCalledWith('A');
  });

  it('hides levels with zero count', () => {
    render(
      <ChapterFilter
        activeFilter="all"
        onFilterChange={() => {}}
        evidenceCounts={{ A: 10, B: 0, C: 5 }}
      />
    );
    expect(screen.queryByText('B 级')).not.toBeInTheDocument();
  });
});
