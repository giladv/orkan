The schema explains the admin how the data is structured. 


__To set the schema - in the admin go to: /orkanObjects > /schema __

### Structure
At the root evel, the schema consists of collections and objects. 
Although Firestore supports only collections at the root level, Orkan.js augment a special ```objects``` collection for non repetitive data.

It is strongly recommended to read the [data model section](https://firebase.google.com/docs/firestore/data-model) 
on Firestore docs. Also it is important to note that nested collections are not supported at the moment.

At the document level the schema can represent objects, arrays and non specific primitives.
By 'non specific' we mean that there is no need to define primitive types, we just treat them as primitives.
 