const reactDocs = require('react-docgen');
const fs = require('fs');
const documentation = require('documentation');

const componentsPaths = [
	'src/components/collection/index.js',
	'src/components/value/index.js',
	'src/components/with-value/index.js',
	'src/components/provider/index.js',
	'src/components/list/index.js',
];

const otherPaths = [
	'src/firestore.js',
	'src/inject.js',
];


const sanitizeReactDoc = ({displayName, description, props}, path) => ({
	name: displayName,
	type: 'component',
	description,
	props,
	file: path
});

const sanitizeOtherDoc = ({kind, name, description, context, params, returns, members}) => ({
	name,
	description,
	type: kind,
	params,
	file: context.file.replace(process.cwd() + '/', ''),
	returns,
	methods: members.instance.map(method => sanitizeOtherDoc(method))
});

const componentsApi = componentsPaths.map(path => {
	const file = fs.readFileSync(path, 'utf8');
	const reactDoc = reactDocs.parse(file, undefined, undefined, {legacyDecorators: true});

	return sanitizeReactDoc(reactDoc, path);
});

documentation.build(otherPaths, {})
	.then(output => {
		const sanitized = output
			.filter(api => api.kind !== 'module')
			.map(sanitizeOtherDoc);

		fs.writeFileSync('dist/api.json', JSON.stringify([...componentsApi, ...sanitized]));
	});

