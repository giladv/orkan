import {toAbsolutePath, stripRootFromPath, getParentPath, validAbsolutePathInvariant} from '../path-utils';

test('toAbsolutePath', () => {
	expect(toAbsolutePath('home/hero')).toBe('./home/hero');
	expect(toAbsolutePath('./home/hero')).toBe('./home/hero');
	expect(toAbsolutePath('')).toBe('.');
});

test('stripRootFromPath', () => {
	expect(stripRootFromPath('home/hero')).toBe('home/hero');
	expect(stripRootFromPath('./home/hero')).toBe('home/hero');
	expect(stripRootFromPath('.')).toBe('');
});


test('getParentPath', () => {
	expect(getParentPath('home')).toBe('');
	expect(getParentPath('./home')).toBe('.');
	expect(getParentPath('home/hero')).toBe('home');
	expect(getParentPath('./home/hero')).toBe('./home');
	expect(getParentPath('')).toBe('');
});


test('validAbsolutePathInvariant', () => {
	expect(() => validAbsolutePathInvariant('home/hero')).toThrow();
	expect(() => validAbsolutePathInvariant('./home/hero')).not.toThrow();
	expect(() => validAbsolutePathInvariant('')).toThrow();
	expect(() => validAbsolutePathInvariant('.')).not.toThrow();
});