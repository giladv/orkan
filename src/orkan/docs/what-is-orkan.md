## What is Orkan.js
Orkan.js is a toolkit and an admin interface for building and managing dynamic react applications with ease.
We use Firebase services such as Firestore, Authentication and Storage as a secure and scalable turn key back-end solution.

Orkan.js differ from other CMS solutions by the fact that it integrates into your app and not the other way around. Why it's a plus?
- Truely painless integration into existing React projects. 
- No platform limitations - you can use any third party packages and any setup you like.

### The Toolkit
The toolkit consists of a Mobx powered data store 
and Components which enables the flow of the data into the application components.

### The Admin UI
The admin UI is a completely optional but extrmely powerful tool, which enables to authorized users to manage the data in a CMS like fashion. It loads asyncronousely only when it's needed so it wont your app's load time at all.

### The Back-End
Orkan.js will interface with Firebase automatically for you, all you need is to provide the configuration object supplied by firebase and it takes care for the rest.
__* Some configartions can only be set manually on Firebase's console/cli.__