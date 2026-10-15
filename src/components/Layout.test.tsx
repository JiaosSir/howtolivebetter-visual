import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <Layout><div>Page content</div></Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders the site title', () => {
    render(
      <MemoryRouter>
        <Layout><div>Content</div></Layout>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /高性价比人生指南/ })).toBeInTheDocument();
  });
});
