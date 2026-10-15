import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrefacePage from './PrefacePage';

function renderPage() {
  return render(
    <BrowserRouter>
      <PrefacePage />
    </BrowserRouter>,
  );
}

describe('PrefacePage', () => {
  it('renders the main title', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: /高性价比人生指南/ }),
    ).toBeInTheDocument();
  });

  it('renders the evidence grading section', () => {
    renderPage();
    expect(screen.getByText(/证据分级/)).toBeInTheDocument();
  });

  it('renders all three evidence levels in the table', () => {
    renderPage();
    expect(screen.getAllByText(/荟萃分析/).length).toBeGreaterThan(0);
    expect(screen.getByText(/小样本/)).toBeInTheDocument();
    expect(screen.getByText(/作者自己的经验/)).toBeInTheDocument();
  });

  it('renders the glossary section', () => {
    renderPage();
    expect(screen.getByText(/读懂数字/)).toBeInTheDocument();
  });

  it('renders key glossary terms', () => {
    renderPage();
    expect(screen.getByText('总死亡率')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
    expect(screen.getByText('RCT')).toBeInTheDocument();
  });

  it('renders the four resources section', () => {
    renderPage();
    expect(screen.getByText(/四种资源/)).toBeInTheDocument();
  });

  it('renders chapter links in the question table', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const chapterLinks = links.filter((l) =>
      l.getAttribute('href')?.startsWith('/chapter/'),
    );
    expect(chapterLinks.length).toBeGreaterThan(0);
  });
});
