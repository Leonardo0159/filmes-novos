import { renderHook, waitFor } from '@testing-library/react';
import useScript from './useScript';

describe('useScript', () => {
  it('creates a script element with correct src and async=true', () => {
    renderHook(() => useScript('https://example.com/script.js'));

    const script = document.body.querySelector('script');
    expect(script).not.toBeNull();
    expect(script!.src).toBe('https://example.com/script.js');
    expect(script!.async).toBe(true);
  });

  it('appends script to document body', () => {
    renderHook(() => useScript('https://example.com/script.js'));

    expect(document.body.querySelector('script')).toBeInTheDocument();
  });

  it('removes script from body on cleanup', () => {
    const { unmount } = renderHook(() => useScript('https://example.com/script.js'));
    expect(document.body.querySelector('script')).toBeInTheDocument();

    unmount();

    expect(document.body.querySelector('script')).toBeNull();
  });

  it('updates script element when url changes', async () => {
    const { rerender } = renderHook((url: string) => useScript(url), {
      initialProps: 'https://example.com/script-a.js',
    });

    const script = document.body.querySelector('script');
    expect(script?.src).toBe('https://example.com/script-a.js');

    rerender('https://example.com/script-b.js');

    await waitFor(() => {
      const scripts = document.body.querySelectorAll('script');
      expect(scripts.length).toBe(1);
      expect(scripts[0].src).toBe('https://example.com/script-b.js');
    });
  });
});
