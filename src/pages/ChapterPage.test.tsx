import { describe, it, expect, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ChapterPage from './ChapterPage';

function renderChapter(entry: { pathname: string; hash?: string; state?: unknown }) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/chapter/:chapterId" element={<ChapterPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ChapterPage deep link highlight', () => {
  it('flashes the search terms inside the target item', async () => {
    renderChapter({
      pathname: '/chapter/ch01',
      hash: '#item-ch01-1',
      state: { searchTerms: ['安全带'] },
    });

    const target = document.getElementById('item-ch01-1');
    expect(target).not.toBeNull();

    await waitFor(() => {
      expect(target).toHaveClass('ring-2');
    });

    const marks = target!.querySelectorAll('mark.search-keyword-flash');
    expect(marks.length).toBeGreaterThan(0);
    marks.forEach((mark) => expect(mark.textContent).toBe('安全带'));
    await waitFor(() => {
      expect(target!.querySelector('button[aria-expanded="true"]')).not.toBeNull();
    });
  });

  it('does not flash anything without search terms', async () => {
    renderChapter({ pathname: '/chapter/ch01', hash: '#item-ch01-1' });

    const target = document.getElementById('item-ch01-1')!;
    await waitFor(() => {
      expect(target).toHaveClass('ring-2');
    });
    expect(target.querySelectorAll('mark.search-keyword-flash')).toHaveLength(0);
  });

  it('removes the flash and ring after the highlight window', async () => {
    vi.useFakeTimers();
    try {
      renderChapter({
        pathname: '/chapter/ch01',
        hash: '#item-ch01-1',
        state: { searchTerms: ['安全带'] },
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });

      const target = document.getElementById('item-ch01-1')!;
      expect(target).toHaveClass('ring-2');
      expect(target.querySelectorAll('mark.search-keyword-flash').length).toBeGreaterThan(0);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      expect(target).not.toHaveClass('ring-2');
      expect(target.querySelectorAll('mark.search-keyword-flash')).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
