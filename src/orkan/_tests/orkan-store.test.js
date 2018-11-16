import OrkanStore from '../orkan-store2';

test('toAbsolutePath', () => {
	expect(toAbsolutePath('home/hero')).toBe('./home/hero');
	expect(toAbsolutePath('./home/hero')).toBe('./home/hero');
	expect(toAbsolutePath('')).toBe('.');
});