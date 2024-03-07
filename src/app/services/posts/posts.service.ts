import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
// Import the service to deal with the Angular fire storage to store media
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { }

  // store the file
  uploadFile(selectedFile: string, filePath: string) {
    // create the uploading query, 
    return this.storage.upload(filePath, selectedFile)
  }

  // create a method that gets the url of the image by receiving this image's path
  getFileURL(filePath: string) {
    return this.storage.ref(filePath).getDownloadURL()
  }

  // Store post document
  storePost(post: object) {
    return this.afs.collection("posts").add(post)
  }


  // Get posts
  getPosts() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const postId = action.payload.doc.id;
          const postData = action.payload.doc.data();
          return { postId: postId, postData: postData }
        })
      })
    )
  }

  getSinglePost(id: string) {
    //this.afs.collection("posts").doc(id).valueChanges();
    return this.afs.doc(`posts/${id}`).valueChanges(); // returns observable also
  }

  updatePost(id: string, post: any) {
    return this.afs.doc(`posts/${id}`).update(post)
  }

  deletePostImage(imagePath: string) {
    // return this.storage.storage.refFromURL(imageUrlHere).delete() // accepts image's url 
    return this.storage.storage.ref(imagePath).delete() // accepts image path
  }
  deletePost(postId: any) {
    return this.afs.doc('posts/' + postId).delete()
  }
}
