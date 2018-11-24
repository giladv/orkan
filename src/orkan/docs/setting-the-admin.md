Before we begin working with the admin, we need to setup 3 things:

1. ### Authentication providers
	- Enable your favorite providers in the Firebase console:
		1. In the [Firebase console](https://console.firebase.google.com/?authuser=0), open the Authentication section.
		1. On the Sign in method tab, configure the sign-in methods and click Save.
	- Add the authentication providers to the [Provider](docs/Provider) component
		```jsx
		<OrkanProvider firebaseConfig={...} authProviders={['google', ...]}>
			<App/>
		</OrkanProvider>
		```  
	
1. ### Firestore security rules
	Add security rules to your Firestore databse
	1. In the [Firebase console](https://console.firebase.google.com/?authuser=0), open the Database > Cloud Firestore section.
	1. On the Rules tab, paste the following rules definition:
		```
		service cloud.firestore {
		  match /databases/{database}/documents {
			function isAdmin(){
			  return request.auth != null 
				&& request.auth.uid != null 
				&& exists(/databases/$(database)/documents/orkanUsers/$(request.auth.uid))
				&& get(/databases/$(database)/documents/orkanUsers/$(request.auth.uid)).data.active == true
			}
			
			function canEditPermissions(){
			  return isAdmin() && get(/databases/$(database)/documents/orkanUsers/$(request.auth.uid)).data.editPermissions == true
			}
			
			function canEditSchema(){
			  return isAdmin() && get(/databases/$(database)/documents/orkanUsers/$(request.auth.uid)).data.editSchema == true
			}
		  
			function canEditData(){
			  return isAdmin() && get(/databases/$(database)/documents/orkanUsers/$(request.auth.uid)).data.editData == true
			}
			
			function isLegalUserRequest(uid, res){
				return res.data.active == false
				&& res.data.editData == false
				&& res.data.editPermissions == false
				&& res.data.editSchema == false
				&& res.data.uid == uid
				&& request.auth.uid == uid
			}
			match /{collection}/{doc}{
			  allow read: if collection != 'orkanUsers' 
				&& collection != 'orkanObjects'
			  allow write: if canEditData()
				&& collection != 'orkanUsers' 
				&& collection != 'orkanObjects'
			}
			
			match /orkanUsers/{uid} {
			  allow write: if canEditPermissions() || isLegalUserRequest(uid, request.resource)
				allow read: if (isAdmin() && uid == request.auth.uid) || canEditPermissions()
			} 
		
			match /orkanMedia/{mediaId}{
			  allow read, write: if isAdmin()
			}
		
			match /orkanObjects/schema{
			  allow read: if isAdmin()
			  allow write: if canEditSchema()
			}
		
			match /orkanObjects/schemaSettings{
			  allow read: if isAdmin()
			  allow write: if canEditSchema()
			}
		  }
		}
		
		```
	
1. ### Super user
	Now we are ready for the first login, on your app:
	
	__* Note: this is required only in the first setup__
	- Hold the ```o``` key until you see a Sign-in modal appearing. 
	- Sign-in, a message saying __unauthorized__ should appear.
	- In the [Firebase console](https://console.firebase.google.com/?authuser=0), open the Database > Cloud Firestore section.
	- open the ```orkanUsers``` collection and the document representing your user
	- set ```active```, ```editData```, ```editPermissions``` and ```editSchema``` to ```true```
	- All ready! now sign-in like described in the first step and you are in.
	
	
### Next - [Setup the schema](docs/the-schema).