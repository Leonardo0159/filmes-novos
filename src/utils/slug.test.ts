import { createSlug } from './slug';

describe('createSlug', () => {
  it('replaces spaces with hyphens', () => {
    expect(createSlug('hello world')).toBe('hello-world');
  });

  it('lowercases text', () => {
    expect(createSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(createSlug('filme: teste [especial] @2024')).toBe('filme-teste-especial-2024');
  });

  it('trims leading and trailing hyphens', () => {
    expect(createSlug('-hello-')).toBe('hello');
  });

  it('collapses multiple consecutive hyphens', () => {
    expect(createSlug('hello   world')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(createSlug('')).toBe('');
  });

  it('handles text with numbers', () => {
    expect(createSlug('filme 2024')).toBe('filme-2024');
  });

  it('removes URL-unsafe characters', () => {
    expect(createSlug('a?b#c[d]e@f!g$h&i(j)k*l+m,n;o=p')).toBe('abcdefghijklmnop');
  });
});
