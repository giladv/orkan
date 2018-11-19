import * as firebase from 'firebase-admin';
import 'firebase/firestore';

import Firestore from '../firestore';


const config = {
	credential: firebase.credential.cert({
		"type": "service_account",
		"project_id": "my-proj-5cbb6",
		"private_key_id": "27cc683574e0235bedb361009677f88e243d5f0d",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtn8jl8SdFdwbL\nOB3y0/uYwaA5ttb3o+POx1RaVT+BVJCqg4hZP1+lmkRcZC+bzPgbg6EB4xSKvbw3\nplXSAOICAPg2e3QU3B//HGn+cL7Y0wyxouxwAHOM9DfxWdrMW44W1PpDW+YXkPZq\n8iibAe2AW6hpPZl4nPOc8En9v55Uwcxt/zki+/3kYJJF54oIGwtACMLVJS2YAQ9H\n2o/CZVtvX40M2HZaaOR5eMaW/oE7buLk6Y1OlHk0S/BnW83Jz37J+8ZSfxGKUCLm\n1D314v/qk4Kraxhf9ghPGGvuvrZfu+Csmw1ukZVtBfafWmGGiy6eYYAVXQDCyWge\nBAkbNohxAgMBAAECgf8naJjNaEN+Y1szchRGcaCBYhxFYfgetc99MCxuvY7bkiLS\nLIwNWfGIpjQ1jajB0d1z74f0tqacjM4Sv92B/lv46FMfxKZEnX2jicfahgCW/7Cy\n3nT1wGhOHKYf2uhTJOr7tXyQ2pRkz+g/eExjQuIWQXydi8fs81K86On4XICDNGoO\nbmuljHWSAqrTiyGiSkmpewI9M8jtswdzAmt7bOLgp6ylzzuHsWj9Q2ZafvWIT9lP\n0FuMVTmGc70hXUf7wm0P2zIavMQrv9Lu8hW6FN0lPhwaP9AiRIGRZiagfWfCbXA1\nWrHbh1aWUGeVkBXRoLFaMDcYZbdvz0RrUSfj+GMCgYEA88UaDf7wVrtFfIZ+kqe/\n7UTaTek9Kf8JA0pUOALEj9qmO0rl1IougOjEShISp0RiGuUK1vYQVPjj+5TlLhQC\n7j8UT7J7iXJhM0YLvazYqv4syxSD/FW8sXQMm/82MtmieYsNbTKndCbQFsbn3lVN\nAG7sJLvSuzCO8Vupd70H2RcCgYEAtlXBKLA9kbMm9CmvrlpWdDciFm/hlRrzEyYx\nMm53Wg1lrw1UVFQzAi0O4IaV5nRXG8iljuz/ySDyNlZF97QTeSLEcDo5kl0Ex64v\n11ZoyS6oUWDd9GoKYzwDKpbzQa1ILy3NIBA6pAfSgBpWQjZKvmFsdIPvCbvHVmcj\nj8tuD7cCgYEA8SeyaNomZYcKbPCY0vjE9DNDTARLj/pPrkOgIXELh8yk2s9zotm4\nu6qKVUSf033hF/4yxQnUiltXHxHjz7vYUl1w+I73i7ft1M2c293c0vx0z8rR75Xa\nACtwNfs6YP/QrjET7U1JP60N+xp3VApLDPyu/IAbLzgQkVE+y8fjta0CgYBScmBP\nR7HvafTZPuhDjHG/RxbQ0nJMe80iAYkJZs3tGFW8W+if4RrXhwxNFk490Kl61LWX\n9S6MAavESiqFIRYVFlWA8bMKraj1qZvUYSwsnD5b3dM/K5va104POgZw0ivruWgh\ncXUyqp7SchZDBk2x3FewL+AspI40UZrQ8Imp7QKBgQCcWkKH5OtvQOKnqsE6ycHP\nB+g0iSRa+T5S5SJqnY6TsMqRldZMzvQ/CenoxncL7HfKGXI0XXfIZAYq5g12CC0+\n+H4y+rRvYjIetgGUKPf4upz4+4MLQEPcfq8qv1VKphPvkU39Z0wH8i7oldiLnDJv\nhn7jSReUbmGvVq7SodhsKw==\n-----END PRIVATE KEY-----\n",
		"client_email": "firebase-adminsdk-fa4mb@my-proj-5cbb6.iam.gserviceaccount.com",
		"client_id": "116021766769495290279",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fa4mb%40my-proj-5cbb6.iam.gserviceaccount.com"
	}),
	databaseURL: "https://my-proj-5cbb6.firebaseio.com"
};


const firebaseApp = firebase.initializeApp(config);

const doc1 = {
	title: 'title',
	comments: [{name: 'name'}]
};

const doc2 = {
	background: 'background',
	features: [{link: 'link'}]
};


jest.setTimeout(10000);

const firestoreInst = firebase.firestore(firebaseApp);
firestoreInst.settings({timestampsInSnapshots: true})
const firestore = new Firestore(firestoreInst);

test('loading', async () => {
	expect(await firestore.load('test/doc1')).toBe(undefined);
	expect(await firestore.load('test/doc2')).toBe(undefined);
	await firestoreInst.doc('test/doc1').set(doc1);
	expect(await firestore.load('test/doc1')).toEqual(doc1);
	expect(await firestore.load('test/doc2')).toBe(undefined);
	await firestoreInst.doc('test/doc2').set(doc2);
	expect(await firestore.load('test/doc2')).toEqual(doc2);
	expect(await firestore.load('test/doc1')).toEqual(doc1);
});

test('reading and listening', async () => {
	const kill = firestore.listen('test/doc1');
	expect(firestore.getValue('test/doc1')).toBe(undefined);
	expect(firestore.getValue('test/doc2')).toBe(undefined);
	await firestoreInst.doc('test/doc1').set(doc1);
	await sleep(500);
	expect(firestore.getValue('test/doc1')).toEqual(doc1);
	expect(firestore.getValue('test/doc2')).toBe(undefined);
	await firestoreInst.doc('test/doc1').delete();
	await sleep(500);
	expect(firestore.getValue('test/doc1')).toBe(undefined);
	expect(firestore.getValue('test/doc2')).toBe(undefined);

	kill();
});


test('removing', async () => {
	await firestoreInst.doc('test/doc1').set(doc1);
	await firestoreInst.doc('test/doc2').set(doc2);

	await firestore.remove('test/doc1');
	expect(await firestore.load('test/doc1')).toBe(undefined);
	expect(await firestore.load('test/doc2')).toEqual(doc2);
	await firestore.remove('test/doc2');
	expect(await firestore.load('test/doc1')).toBe(undefined);
	expect(await firestore.load('test/doc2')).toBe(undefined);
});

afterEach(async () => {
	await firestore.remove('test/doc1');
	await firestore.remove('test/doc2');
});

const sleep = msTime => new Promise(resolve => setTimeout(() => resolve(), msTime));