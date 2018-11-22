
1. ### Setup suthentication providers
	
	open authentication panel on firebase console
	
1. ### Update security rules

	Paste this snippet in yor Firestore rules panel

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

1. ### Creating the first super user
