
export const validFirestoreKey = (error = 'Invalid Key.') => {
	return {
		validate: value => !/^\.$|^\.\.$|\/|__.*__/g.test(value),
		error
	};
}