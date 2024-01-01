

// Never forget importing any class or service or interface you use ( Usually auto imported ) 
import { Component } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { category } from '../../interfaces/category';
// REactive forms 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { post } from '../../interfaces/post';
import { PostsService } from '../../services/posts/posts.service';
// import { ChangeEvent } from '@angular/forms';
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {

  dashedTitle: string = 'Dashed Title'; // no need to use a default value here, used below
  // store a default image to show in the form 
  postImageSrc: any = "https://cdn.dribbble.com/users/6912937/screenshots/15070157/media/b90a2dbb03527b39c14515aedabde82a.png?resize=1000x750&vertical=center";
  // get the selected image form the form
  selectedImage: string;
  selectedImageName: string;
  categoriesList: category[];
  htmlContent: any;
  // selected option
  selectedCategoryId: string
  selectedCategoryName: string

  // reactive forms
  postForm: FormGroup;
  constructor(private categorySrvs: CategoriesService, fb: FormBuilder, private postSrvs: PostsService) {
    this.postForm = fb.group({ // we can use a form group for each formGroup element, but in our case each form group is holding only one control so it is not necessary
      postTitle: ['', [Validators.required, Validators.minLength(10)]],
      postPermalink: ['l',], // ! 3
      postExcerpt: ['', [Validators.required, Validators.minLength(50)]],
      postCategory: ['', Validators.required],
      postImage: ['', Validators.required],
      postContent: ['', Validators.required],
    }) // !2
    // The other way 

    // this.postForm.get('postPermalink')?.disable();
    /* this.postForm = new FormGroup({
      postTitle: new FormControl("", [Validators.required, Validators.minLength(10)]),
    }) */
  }



  ngOnInit() {

    this.categorySrvs.getData().subscribe((res: category[]) => {
      this.categoriesList = res;
      console.log(this.categoriesList)
      console.log(this.postForm.controls)
    })
  }
  // get the form controls 
  get formControls() {
    return this.postForm.controls;
  }
  onTitleInput(e: any) {
    // use regEx to replace the multiple spaces with -
    this.dashedTitle = e.target.value.replace(/\s+/g, "-")
    // this.dashedTitle = e.target.value.replaceAll(" ", "-")// replaces each one space with a dash, commented to not override
  }
  getPostImage(event: any) {
    // read the image
    const reader = new FileReader();
    reader.onload = e => {
      this.postImageSrc = e.target?.result;
      console.log(e.target?.result)
      console.log(e.target)
      console.log(event)
    }

    // read the data
    reader.readAsDataURL(event.target.files[0])
    // store the file object inside a variable to later upload it to the storage
    this.selectedImage = event.target.files[0];
    this.selectedImageName = event.target.files[0].name;
    console.log(typeof event.target.files[0], event.target.files[0].name)
  } // ! [1]

  // Get the value (category id ) and text from inside the selected option
  getOptionData(e: Event): void {
    const target = e.target as HTMLSelectElement;
    this.selectedCategoryId = target.value;
    this.selectedCategoryName = target.options[target.selectedIndex].text
    console.log(e)
  } // !4'

  // once the form is submitted
  submitPostFrom() {
    // first upload the image to the storage following these steps
    // crate a path in which the file will be stored inside the firebase storage 
    let filePath = `postImage/${this.selectedImageName}`; // if the image's name is not in the right way encoded that will cause error
    // for that generate a random big number instead and make sure it is unique.
    //let randomNumber = new Date().getTime()
    // let filePath = `postImage/${randomNumber}`;

    // First Create a default image's path incase something went wrong with getting the uploaded Post's image
    let defaultPostImage = 'https://cdn.dribbble.com/users/595088/screenshots/15478669/media/d280f800b25aa1a0acf855b4d0524a22.jpg?resize=1000x750&vertical=center'

    // Upload the image to the storage
    this.postSrvs.uploadFile(this.selectedImage, filePath).then(res => {
      // once the file is uploaded to the server the response is returned, at that moment you can get the images url and not before,
      // thats why do not use this getFileURL method outside
      // Get the image's URL
      this.postSrvs.getFileURL(filePath).subscribe(url => {
        postData.postImageURL = url;
        // even if the postData object is defined later it still can be read by this scoop, I think this is a feature of the framework or may because we are using typescript class
      })
    })


    // get the  object that holds the controls values,
    let postValues = this.postForm.value;
    console.log(this.postForm.value) // can receive the value from the form submit event too

    // Create the object holds the info of the post
    let postData: post = {
      // From inside post values object  get the value of each control
      postTitle: postValues.postTitle,
      postPermalink: postValues.postPermalink,
      postExcerpt: postValues.postExcerpt,
      postCategory: {
        categoryId: this.selectedCategoryId,
        category: this.selectedCategoryName
      },
      postImageURL: defaultPostImage,
      postContent: postValues.postContent,
      isFeatured: false,
      status: 'New',
      views: 20,
      createdAt: new Date,
    }







  }



  // send the image's path to the post service to upload it to the storage

  log(target: any) {
    console.log(target.value)
  }

  // this.postSrvs.uploadImage()
}


/*
 ! [1]
Explanation:

const reader = new FileReader();: This line creates a new instance of the FileReader class. The FileReader object allows web applications to asynchronously read the contents of files (or raw data buffers) stored on the user's computer.

reader.onload = (e: any) => { ... }: This line sets up an event handler for the onload event of the FileReader. The onload event is triggered when the reading operation is successfully completed. The event handler, in this case, is an arrow function that takes an event parameter (e).

this.postImageSrc = e.target?.result;: Inside the event handler, the result property of the FileReader contains the data that was read. In this specific case, it's likely reading a file as a data URL (using readAsDataURL), and the result will be a base64-encoded representation of the file's contents. This data URL is then assigned to the postImageSrc property of the class or component.

reader.readAsDataURL(e.target.files[0]);: This line initiates the reading of the contents of the file. It uses the readAsDataURL method, which reads the file as a data URL. The file to be read is specified using e.target.files[0], assuming that e is an event object related to a file input change.

So, overall, this method is used to handle the selection of a file using a file input, read its contents as a data URL, and assign that data URL to a property (postImageSrc) for further use, perhaps to display an image preview.
* important to know,
using the console.log() I could discover that the line  reader.readAsDataURL(event.target.files[0]) and the lines after it are read first then the reader.onload event is
fired after that, that explains how the event of the reader loading will contain the result as a base64 even if the line that converted the file to base 64 is coming after the
line of the object loading event, because it is executed first
the event parameters used in the getImage method and the onload are two different ones.
the FileReader; class is instantiated as an object, inside the object ( we named it reader ) there is a method called readAsDataUrl that takes the file object and returns
the base64 format from it and then assigns it the the result property inside the onload method inside the reader object
* the event.target.files[0]; is the file object that is uploaded and it holds info about the file including the name

*/

/*
! 2
With reactive forms we can add a build-in validations using the validators class or just create ours,
using the fb service inside the constructor itself avoided us declaring it as a field and using the keyword 'this',
the first parameter string refers to the default value
*/


/*
! 3
 it is disabled and filled automatically so no validation needed
 in the html input element using disabled attribute with the value attribute or the ngModel directive is not working, so I have initiated the default value and used the disabled attribute in here
*/

/*
! 4
From inside the change event console.log(e) you can find many properties, we can focus on the coming
* target
the element itself
* target.options
an array of options, each option has many properties, we need the text property, text and not textContent cause textContent considers the spaces
but first to get this option from the array we need to get it's index, and that is using the selectedIndex property from inside the target property in the event

*/

// * Can't use the keyword this as a class member (needs to be used inside a method)