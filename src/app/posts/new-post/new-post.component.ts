// Never forget importing any class or service or interface you use ( Usually auto imported ) 
import { Component } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { category } from '../../interfaces/category';
// REactive forms 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { post } from '../../interfaces/post';
import { PostsService } from '../../services/posts/posts.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // to navigate between routers
import { ActivatedRoute } from '@angular/router'

// import { ChangeEvent } from '@angular/forms';
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {

  dashedTitle: string = 'Dashed Title'; // no need to use a default value here, used below
  // store a default image to show in the form 
  defaultImg: string = "https://cdn.dribbble.com/users/6912937/screenshots/15070157/media/b90a2dbb03527b39c14515aedabde82a.png?resize=1000x750&vertical=center";
  postImageSrc: any = this.defaultImg;
  // get the selected image form the form
  selectedImage: string;
  selectedImageName: string;
  categoriesList: category[];
  htmlContent: any;
  // selected option
  selectedCategoryId: string
  selectedCategoryName: string
  currentPostId: string;
  currentPost: any;
  currentPostCategoryId: string;
  postFromStatus: string = "Add New"

  // reactive forms
  postForm: FormGroup;
  constructor(
    private categorySrvs: CategoriesService,
    fb: FormBuilder,
    private postSrvs: PostsService,
    private toastr: ToastrService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
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

    // get the received post id  from the active route, get the observable query params from the active route
    this.activateRoute.queryParams.subscribe(paramsObj => { //🟢
      this.currentPostId = paramsObj['id']
      this.postSrvs.getSinglePost(this.currentPostId).subscribe((post: any) => {
        console.log(post) // if there is no id in the query parameters this post variable evaluates to undefined
        // Set the img src and then by property binding the src changes automatically;
        if (post) { // !5
          this.postImageSrc = post.postImageURL;
          this.currentPost = post;
          this.selectedCategoryId = post.postCategory.categoryId;
          this.selectedCategoryName = post.postCategory.category;
          // and then assign the values of the chosen post as default values to the form controls
          this.postForm = fb.group({ // we can use a form group for each formGroup element, but in our case each form group is holding only one control so it is not necessary
            postTitle: [this.currentPost.postTitle, [Validators.required, Validators.minLength(10)]],
            postPermalink: ['l',], // ! 3
            postExcerpt: [this.currentPost.postExcerpt, [Validators.required, Validators.minLength(50)]],
            postCategory: [this.currentPost.postCategory.categoryId, Validators.required], // assigns the id of the chosen option as a value to hte select element
            postImage: ['', Validators.required],
            postContent: [this.currentPost.postContent, Validators.required],
          })
          // change the form status
          this.postFromStatus = "Edit Chosen"
        }



      })
    })

  }



  ngOnInit() {

    /* const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }; */

    // get all posts 
    this.categorySrvs.getData().subscribe((res: category[]) => {
      this.categoriesList = res;
      console.log(this.categoriesList)
      console.log(this.postForm.controls)
    })

    // get one post 

  }
  // get the form controls 
  get formControls() {
    return this.postForm.controls;
  }
  onTitleInput(e: Event) {
    // use regEx to replace the multiple spaces with -
    let target = e.target as HTMLInputElement
    // let target = <HTMLInputElement>e.target //🟢

    this.dashedTitle = target.value.replace(/\s+/g, "-")// replace all spaces in between with only one dash
    // this.dashedTitle = e.target.value.replaceAll(" ", "-")// replaces each one space with a dash, commented to not override
  }
  getPostImage(event: any) {
    // read the image
    const reader = new FileReader();
    reader.onload = e => {
      this.postImageSrc = e.target?.result; // to be viewed
    }
    // get the loaded file and read it as data url;
    reader.readAsDataURL(event.target.files[0])
    // store the file object inside a variable to later upload it to the storage
    this.selectedImage = event.target.files[0]; // to be uploaded 
    this.selectedImageName = event.target.files[0].name;
    console.log(typeof event.target.files[0], event.target.files[0].name)
  } // ! [1]

  // Get the value (category id ) and text from inside the selected option
  getOptionData(e: Event): void {
    const target = e.target as HTMLSelectElement; //🟢

    this.selectedCategoryId = target.value;
    this.selectedCategoryName = target.options[target.selectedIndex].text
    console.log(e)
  } // !4'

  // once the form is submitted
  submitPostForm() {
    // first upload the image to the storage following these steps
    // create a path in which the file will be stored inside the firebase storage 
    let filePath = `postImage/${this.selectedImageName}`; // if the image's name is not encoded in the right way  that will cause error


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
        console.log(url, "this is the returned image url")
        // Then after I ensured that the image is uploaded and the url is returned only then we can modify the post Object and call the storing method from the service.
        postData.postImageURL = url;
        // Now store the post to the firestore database
        if (this.postFromStatus == 'Add New') {
          this.postSrvs.storePost(postData).then(
            docRef => {
              console.log(docRef)
              this.toastr.success("post Created")
            }).catch(er => this.toastr.error(er));
        } else {
          console.log(postData)

          this.postSrvs.updatePost(this.currentPostId, postData).then(_ => {
            this.toastr.success(" Post Updated successfully")
            this.router.navigate(['/posts'])

          })
        }



        // reset the form
        this.postForm.reset();
        // also the image to default;
        this.postImageSrc = this.defaultImg
        // and navigate to the all posts component
        this.router.navigate(['/posts'])
        // even if the postData object is defined later it still can be read by this scoop, I think this is a feature of the framework or may because we are using typescript class
      })
    })


    // get the  object that holds the controls values,
    let postValues = this.postForm.value;
    console.log(this.postForm.value)   // can receive the value from the form submit event too

    // get the current date formatted in a short date format
    //const currentDate = new Date().toLocaleString('en-US')
    // but because we are using the method toMillis() then we cant send a string date because it works on timestamp so we will use new Date() with the pipe instead

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
      postImagePath: filePath,
      postContent: postValues.postContent,
      isFeatured: false,
      status: 'New',
      views: 20,
      createdAt: new Date(),
    }





  } // end submit method



  // send the image's path to the post service to upload it to the storage

  log(target: any) {
    console.log(target.value)
  }

  // this.postSrvs.uploadImage()
}


/*
 ! [1]
Explanation:

const reader = new FileReader();: This line creates a new instance of the FileReader class. The FileReader object allows web applications to asynchronously
read the contents of files (or raw data buffers) stored on the user's computer.
reader.onload = (e: any) => { ... }: This line sets up an event handler for the onload event of the FileReader. The onload event is triggered when the reading
operation is successfully completed. The event handler, in this case, is an arrow function that takes an event parameter (e).
this.postImageSrc = e.target?.result;: Inside the event handler, the result property of the FileReader contains the data that was read.
In this specific case, it's likely reading a file as a data URL (using readAsDataURL), and the result will be a base64-encoded representation of the file's contents.
This data URL is then assigned to the postImageSrc property of the class or component.
reader.readAsDataURL(e.target.files[0]);: This line initiates the reading of the contents of the file. It uses the readAsDataURL method, which reads the file as a data URL.
The file to be read is specified using e.target.files[0], assuming that e is an event object related to a file input change.

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
With reactive forms we can add a built-in validations using the validators class or just create ours,
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

!5
another approach to prevent the from from loading before the data is returned is to wrap all the form inside a div with using *ngIF
<div *ngIf = "postForm">  form here </div>
this way the form loads only when the postForm object is not null
*/

// * Can't use the keyword this as a class member (needs to be used inside a method)

