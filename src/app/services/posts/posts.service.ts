import { Injectable } from '@angular/core';
// Import the service to deal with the Angular fire storage to store media
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage) { }

  // store the file
  uploadFile(selectedFile: string, filePath: string) {
    // create the uploading query, 
    return this.storage.upload(filePath, selectedFile)
  }

  // create a method that gets the url of the image by receiving this image's path
  getFileURL(filePath: string) {
    return this.storage.ref(filePath).getDownloadURL()
  }
}
