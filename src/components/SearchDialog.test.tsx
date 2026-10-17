import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import SearchDialog from './SearchDialog';

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.hash}
    </div>
  );
}

function renderDialog() {
  return render(
    <MemoryRouter>
      <SearchDialog />
      <Routes>
        <Route path="*" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function openSearch() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: '搜索内容' }));
  const input = await screen.findByPlaceholderText('搜索建议、章节或附录文档…');
  return { user, input };
}

describe('SearchDialog', () => {
  it('opens the overlay from the header trigger', async () => {
    renderDialog();
    await openSearch();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens with the keyboard shortcut', async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.keyboard('{Control>}k{/Control}');
    expect(await screen.findByPlaceholderText('搜索建议、章节或附录文档…')).toBeInTheDocument();
  });

  it('shows results with highlighted keywords', async () => {
    renderDialog();
    const { user, input } = await openSearch();

    await user.type(input, '安全带');

    const options = await screen.findAllByRole('option');
    expect(options.length).toBeGreaterThan(0);

    const firstResult = within(options[0]).getByRole('button');
    expect(firstResult.textContent).toContain('系安全带，前排后排都系');
    expect(within(firstResult).getAllByText('安全带').some((el) => el.tagName === 'MARK')).toBe(true);
  });

  it('jumps to the matched paragraph when a result is clicked', async () => {
    renderDialog();
    const { user, input } = await openSearch();

    await user.type(input, '安全带');
    const options = await screen.findAllByRole('option');
    await user.click(within(options[0]).getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/chapter/ch01#item-ch01-1');
    });
  });

  it('shows an empty state when nothing matches', async () => {
    renderDialog();
    const { user, input } = await openSearch();

    await user.type(input, '不存在的关键词xyz');
    expect(await screen.findByText(/没有找到与「不存在的关键词xyz」相关的内容/)).toBeInTheDocument();
  });
});
