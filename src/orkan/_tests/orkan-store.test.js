
import {cloneDeep} from 'lodash';
import DocumentSnapshot from 'mock-cloud-firestore/src/firebase/firestore/document-snapshot';
import QuerySnapshot from 'mock-cloud-firestore/src/firebase/firestore/query-snapshot';
import {SCHEMA_KEY, SCHEMA_SETTINGS_KEY, SYSTEM_OBJECTS_KEY, USER_REQUESTS_KEY, USERS_KEY} from '../constants';
import Firestore from '../firestore';
import OrkanStore from '../orkan-store2';
import MockFirebase from 'mock-cloud-firestore';

import 'firebase/firestore';


const firebaseUser = {
	uid: 'u123',
	email: 'a@a.com',
	photoURL: 'bla.jpg'
};

const userRequest = {
	email: 'a@a.com',
	avatarUrl: 'bla.jpg'
};


const orkanUser = {
	uid: 'u123',
	email: 'a@a.com',
	avatarUrl: 'bla.jpg',
	editData: true,
	editSchema: true,
	editPermissions: true
};


const approvedOrkanUser = {
	email: 'a@a.com',
	avatarUrl: 'bla.jpg',
	editData: true,
};

const schema = {
	objects: {
		home: {
			title: true,
			features: [{
				title: true
			}],
			meta: {
				background: true
			}
		}
	},
	docs: [{
		title: true,
		comments: [{
			title: true
		}]
	}]
};


const schemaSettings = {
	objects: {
		home: {
			title: {uiType: 'text'},
			features: [{
				title: {uiType: 'text'}
			}],
			meta: {
				background: {uiType: 'text'}
			}
		}
	},
	docs: [{
		title: {uiType: 'text'},
		comments: [{
			title: {uiType: 'text'}
		}]
	}]
};

const mockData = {
	__collection__: {
		objects: {
			__doc__: {
				home: {
					title: 'title',
					features: [{title: 'title'}],
					meta: {background: 'background'}
				}
			}
		},
		docs: {
			__doc__: {
				'd123': {
					title: 'title',
					comments: [{title: 'title'}]
				}
			}
		},
		[USERS_KEY]: {
			__doc__: {
				u123: {...orkanUser}
			}
		},
		[SYSTEM_OBJECTS_KEY]: {
			__doc__: {
				[SCHEMA_KEY]: schema,
				[SCHEMA_SETTINGS_KEY]: schemaSettings
			}
		}
	}
};

const authMock = {
		onAuthStateChanged: cb => cb(firebaseUser),
		signOut: () => null
};


const firebase = new MockFirebase(mockData);

const firestore = new Firestore(firebase.firestore(), {
	DocumentSnapshot,
	QuerySnapshot
});


const orkanStore = new OrkanStore(firestore, authMock);



test('authentication', async () => {
	await orkanStore.init();
	expect(orkanStore.user).toEqual(orkanUser);
	expect(orkanStore.isInitializing).toBe(false);
	expect(orkanStore.isAdmin()).toBe(true);
	orkanStore.logout();
	expect(orkanStore.isAdmin()).toBe(false);
	expect(orkanStore.user).toBe(null);
	await orkanStore.init();
});

test('schema', () => {
	expect(orkanStore.getSchema()).toEqual(schema);
	expect(orkanStore.getSchema(true)).toEqual(expect.objectContaining(schema));

	expect(orkanStore.getSchemaByPath('./docs')).toEqual(schema.docs);
	expect(orkanStore.getSchemaByPath('./docs/6')).toEqual(schema.docs[0]);
	expect(orkanStore.getSchemaByPath('./objects')).toEqual(schema.objects);
});

test('schema settings', async () => {
	expect(orkanStore.getSchemaSettings()).toEqual(schemaSettings);
	expect(orkanStore.getSchemaSettings(true)).toEqual(expect.objectContaining(schemaSettings));

	expect(() => orkanStore.setSettingsPath('non/absolute/path')).toThrow();

	orkanStore.setSettingsPath('./objects/home/title');
	expect(orkanStore.settingsPath).toBe('./objects/home/title');
	orkanStore.settingsFormStore.set('uiType', 'textarea')
	expect(orkanStore.getSettingsByPath(orkanStore.settingsPath)).toEqual(schemaSettings.objects.home.title);
	expect(orkanStore.getLiveSettingsByPath(orkanStore.settingsPath)).toEqual({...schemaSettings.objects.home.title, uiType: 'textarea'});
	expect(orkanStore.getSettingsByPath('./non/existing/path')).toEqual(undefined);

	orkanStore.setSettingsPath('./docs');
	expect(orkanStore.getSettingsByPath('./docs')).toEqual(undefined);
	orkanStore.settingsFormStore.set('collectionMainLabel', 'title');
	expect(orkanStore.getSettingsByPath('./docs')).toEqual(undefined);
	expect(orkanStore.getLiveSettingsByPath('./docs')).toEqual({collectionMainLabel: 'title'});

	await orkanStore.submitSettings();
	// using timeout to simulate update time from server
	setTimeout(() => {

		const newSchemaSettings = cloneDeep(schemaSettings);
		newSchemaSettings.docs[1] = {collectionMainLabel: 'title'};
		newSchemaSettings.objects.home.title.uiType = 'textarea';

		expect(orkanStore.getSchemaSettings()).toEqual(newSchemaSettings);

		orkanStore.clearSettingsPath();
		expect(orkanStore.settingsPath).toBe(null);
		expect(orkanStore.settingsFormStore.toJS()).toEqual({});

	}, 0);

});



test('utils', () => {
	expect(orkanStore.isPathIterable('./docs')).toEqual(true);
	expect(orkanStore.isPathIterable('./objects')).toEqual(false);
	expect(orkanStore.isPathIterable('./objects/home')).toEqual(false);
	expect(orkanStore.isPathIterable('./objects/home/features')).toEqual(true);
	expect(orkanStore.isPathIterable('./objects/home/features/45343')).toEqual(false);


	expect(orkanStore.isPathCollection('./docs')).toEqual(true);
	expect(orkanStore.isPathCollection('./objects')).toEqual(false);
	expect(orkanStore.isPathCollection('./objects/home/features')).toEqual(false);

	expect(orkanStore.isPathArray('./docs')).toEqual(false);
	expect(orkanStore.isPathArray('./objects')).toEqual(false);
	expect(orkanStore.isPathArray('./objects/home/features')).toEqual(true);

	expect(orkanStore.isPathPrimitive('./docs')).toEqual(false);
	expect(orkanStore.isPathPrimitive('./objects')).toEqual(false);
	expect(orkanStore.isPathPrimitive('./objects/home')).toEqual(false);
	expect(orkanStore.isPathPrimitive('./objects/home/title')).toEqual(true);
	expect(orkanStore.isPathPrimitive('./objects/home/features/3243244/title')).toEqual(true);

	expect(orkanStore.toSchemaPath('./docs/48f3ru39/title')).toEqual('./docs/0/title');
	expect(orkanStore.toSchemaPath('./docs/48f3ru39')).toEqual('./docs/0');
	expect(orkanStore.toSchemaPath('./objects/home')).toEqual('./objects/home');
	expect(orkanStore.toSchemaPath('./objects/home/features/234')).toEqual('./objects/home/features/0');
	expect(orkanStore.toSchemaPath('./non/existing/path')).toEqual(undefined);

	expect(orkanStore.getPrimitiveKeysByPath('./docs/0')).toEqual(['title']);
	expect(orkanStore.getPrimitiveKeysByPath('./docs')).toEqual([]);
	expect(orkanStore.getPrimitiveKeysByPath('./objects/home')).toEqual(['title']);
	expect(orkanStore.getPrimitiveKeysByPath('./objects/home/features')).toEqual([]);
	expect(orkanStore.getPrimitiveKeysByPath('./objects/home/features/34243')).toEqual(['title']);


	expect(orkanStore.getNonPrimitiveKeysByPath('./docs/nonExisting')).toEqual(['comments']);
	expect(orkanStore.getNonPrimitiveKeysByPath('./docs/0')).toEqual(['comments']);
	expect(orkanStore.getNonPrimitiveKeysByPath('./docs')).toEqual([]);
	expect(orkanStore.getNonPrimitiveKeysByPath('./objects/home')).toEqual(['features', 'meta']);
	expect(orkanStore.getNonPrimitiveKeysByPath('./objects/home/features')).toEqual(['0']);
	expect(orkanStore.getNonPrimitiveKeysByPath('./objects/home/features/34243')).toEqual([]);


	expect(orkanStore.getIterableSchemaPaths()).toEqual(['./objects/home/features', './docs', './docs/0/comments']);
});


test('users requests', async () => {

	expect(firestore.getValue(USER_REQUESTS_KEY)).toEqual([]);
	await orkanStore.createUserRequest(firebaseUser);
	expect(await firestore.load(USER_REQUESTS_KEY + '/' + firebaseUser.uid)).toEqual(userRequest);

	// this is first otherwise the users will be contaminated by the approve request part
	await orkanStore.declineUserRequest(firebaseUser.uid);
	expect(await firestore.load(USER_REQUESTS_KEY + '/' + firebaseUser.uid)).toEqual(undefined);
	expect(await firestore.load(USERS_KEY + '/' + firebaseUser.uid)).toEqual(orkanUser);

	// this is second
	await orkanStore.createUserRequest(firebaseUser);
	expect(await firestore.load(USER_REQUESTS_KEY + '/' + firebaseUser.uid)).toEqual(userRequest);
	await orkanStore.approveUserRequest(firebaseUser.uid);
	expect(await firestore.load(USER_REQUESTS_KEY + '/' + firebaseUser.uid)).toEqual(undefined);
	expect(await firestore.load(USERS_KEY + '/' + firebaseUser.uid)).toEqual(approvedOrkanUser);

});


test('active path', async () => {
	await orkanStore.setActivePath('./docs');
	expect(orkanStore.activePath).toBe('./docs');

	await orkanStore.setActivePath('docs');
	expect(orkanStore.activePath).toBe('./docs');
	expect(orkanStore.dataFormStore.toJS()).toEqual({});

	await orkanStore.setActivePath('docs/d123/comments');
	expect(orkanStore.dataFormStore.toJS()).toEqual({});

	await orkanStore.setActivePath('./objects/home');
	expect(orkanStore.dataFormStore.toJS()).toEqual({'/objects/home': {title: 'title'}});

	await orkanStore.setActivePath('./objects/home/features/0');
	expect(orkanStore.dataFormStore.toJS()).toEqual({'/objects/home/features/0': {title: 'title'}});

	await orkanStore.setActivePath('./objects/home/meta');
	expect(orkanStore.dataFormStore.toJS()).toEqual({'/objects/home/meta': {background: 'background'}});

	orkanStore.clearActivePath();
	expect(orkanStore.activePath).toBe(null);
	expect(orkanStore.settingsPath).toBe(null);
	expect(orkanStore.dataFormStore.toJS()).toEqual({});
});