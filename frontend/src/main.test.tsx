import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const MockApp = () => null;

describe('main entrypoint', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.resetModules();
  });

  it('creates a React root and renders App inside StrictMode', async () => {
    const render = vi.fn();
    const createRoot = vi.fn(() => ({ render }));

    vi.doMock('react-dom/client', () => ({
      createRoot,
    }));
    vi.doMock('./App.tsx', () => ({
      default: MockApp,
    }));

    await import('./main');

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(render).toHaveBeenCalledTimes(1);

    const renderedTree = render.mock.calls[0][0];
    expect(renderedTree.type).toBe(StrictMode);
    expect(renderedTree.props.children.type).toBe(MockApp);
  });
});
