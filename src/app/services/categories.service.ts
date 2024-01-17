import { Injectable } from '@angular/core';
// import the angular fire store to deal with the firebase database
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CategoriesService {
  //create the service as a field 
  constructor(private afs: AngularFirestore,) { }
  // Store categories to the firestore cloud database
  storeCategory(categoriesData: any) {
    // Now create the firestore database collection (and give it a name) using AngularFireStore service and add a document including the created data to be stored
    return this.afs.collection('categories').add(categoriesData.categoryData)
  }
  //
  getData() {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => { // it is a convention to name this param 'actions'// here it is an array of observables (documents)
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, data };
        });
      })
    );
  } // ![1]
  // With any changes ocurred in the firestore database, the snapshotChanges method will see it directly and get it , this real time data loading or syncing is a great feature
  // then the component is reinitialized to store the new data directly to the table, now u don't have to write any code to read that data from the database on the change. //![2] 
  updateData(categoryData: any, id: string) {
    return this.afs.doc('categories/' + id).update(categoryData)
  }

  deleteData(id: string) {
    return this.afs.doc(`categories/${id}`).delete()
  }

}


/* 
* Incase we want to create several subCategories we can do it as coming
 storeCategory(categoriesData : any) {
    
   * Now create the firestore database collection (and give it a name) using AngularFireStore service and add a document including the created data to be stored
    this.afs.collection('categories').add(categoriesData.categoryData).then(documentRef => {
      console.log(documentRef) // see the created document,
      * Create another collection inside this document to store the subCategories
      this.afs.collection('categories').doc(documentRef.id).collection('subCategories').add(categoriesData.subCategoryData)
      .then(subCategoriesDocRef => {
        * in the firebase there is a url or a navigator for the collection and it's documents and subCollections like this one 
        ///categories/n1u90PCLIIg53Szdshsx/subCategories/di02LI3ydW4YsXvAexs2
      * Imagine we want to crate a second Subcategory , Instead of repeating the same code for the existing collections like above we can just use the  collection url like coming 
        this.afs.doc(`categories/${documentRef.id}/subCategories/${subCategoriesDocRef.id}`).collection('thirdLevelCategory')//add the document object here
      }).catch(er => console.log(er))
    }).catch(error => console.log(error))
    * this code this.afs.collection('categories').add(categoryData) is like a post request sent to add a document to the collection 'categories' in the firestore database
    * then this request returns a promise that we can use then on it to fetch the response 

  }

*/

/* 
! 1
This method appears to be written in TypeScript and is part of an Angular service that interacts with Firestore, which is a NoSQL cloud database provided by Firebase.

Here's a detailed explanation of each part:

this.afs.collection('categories').snapshotChanges():

this.afs is presumably an instance of AngularFirestore, which is a service provided by AngularFire for interacting with Firestore.
.collection('categories') selects the Firestore collection named 'categories'.
This part is essentially fetching a snapshot of the 'categories' collection, and snapshotChanges() returns an observable that emits

whenever there are changes in the documents within that collection.

.pipe(...):

The pipe method allows you to combine multiple operators to process the observable stream.
map(actions => {...}):

The map operator is used to transform each emitted value from the observable.
return actions.map(action => {...}):

The actions parameter represents the array of document change actions received from the snapshotChanges() observable.
For each action in the array, it maps it to a new object using the arrow function.
const data = action.payload.doc.data();:

Extracts the data payload from the Firestore document. action.payload.doc represents the document snapshot, and data() retrieves the data stored in that document.
const id = action.payload.doc.id;:

Retrieves the document ID from the Firestore document. This is useful when you need to reference or update specific documents.
return { id, data };:

Returns an object containing both the document ID (id) and the data (data). This structure is common in scenarios where you want to preserve the document ID along with the document data.
The overall result:

The method returns an observable that emits an array of objects, where each object represents a document in the 'categories' collection. Each object contains the document ID and the corresponding data.
*/

/* 
! 2
Real-time-data syncing
once the form is submitted the value is sent to the firestore cloud database, this step makes a change in the firestore database, that change will be recognized directly
without having to write another code to go and get the new set of objects from the firestore database , 
*/