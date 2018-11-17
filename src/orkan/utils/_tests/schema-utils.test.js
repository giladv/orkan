import {schemaWalk, toSchemaPath, getSchemaIterablePaths, schemaGet} from '../schema-utils';


const schema = {
	objects: {
		home: {
			title: true,
			features: [{title: true, body: true}]
		}
	},
	docs: [{
		title: true, body: true
	}]
};

test('schemaWalk', () => {
	const cb = jest.fn();
	schemaWalk(schema, cb);

	expect(cb).toHaveBeenCalledTimes(11);
	expect(cb).toHaveBeenCalledWith(schema.objects, ['.', 'objects']);
	expect(cb).toHaveBeenCalledWith(schema.objects.home, ['.', 'objects', 'home']);
	expect(cb).toHaveBeenCalledWith(schema.objects.home.title, ['.', 'objects', 'home', 'title']);
	expect(cb).toHaveBeenCalledWith(schema.objects.home.features, ['.', 'objects', 'home', 'features']);
	expect(cb).toHaveBeenCalledWith(schema.objects.home.features[0], ['.', 'objects', 'home', 'features', 0]);
	expect(cb).toHaveBeenCalledWith(schema.docs, ['.', 'docs']);
	expect(cb).toHaveBeenCalledWith(schema.docs[0], ['.', 'docs', 0]);
});



test('toSchemaPath', () => {
	expect(toSchemaPath(schema, './objects/none/existing/path')).toBe(undefined);
	expect(toSchemaPath(schema, './objects/home/features/4/title')).toBe('./objects/home/features/0/title');
	expect(toSchemaPath(schema, './objects/home/features')).toBe('./objects/home/features');
	expect(toSchemaPath(schema, './docs/1234632')).toBe('./docs/0');
});


test('getSchemaIterablePaths', () => {
	expect(getSchemaIterablePaths(schema)).toContain('./objects/home/features');
	expect(getSchemaIterablePaths(schema)).toContain('./docs');
	expect(getSchemaIterablePaths(schema)).toHaveLength(2);
});

test('schemaGet', () => {
	expect(schemaGet(schema, './objects/none/existing/path')).toBe(undefined);
	expect(schemaGet(schema, '.')).toBe(schema);
	expect(schemaGet(schema, './objects/home/features')).toBe(schema.objects.home.features);
	expect(schemaGet(schema, './objects/home/features/4')).toBe(schema.objects.home.features[0]);
	expect(schemaGet(schema, './docs/1234632')).toBe(schema.docs[0]);
});



