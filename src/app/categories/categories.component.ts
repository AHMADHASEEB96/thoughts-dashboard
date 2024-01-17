
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
// now go and inject this service in the constructor to use it inside the class
// Toastr service 
import { ToastrService } from 'ngx-toastr';
import { category } from '../interfaces/category';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  // Create the array of type category which is an interface that represents an object of two properties id, data.
  categoriesArray: category[]; // I have created an interface for this array for more strict type checking to make it accept only objects of two properties id, data
  categoryControlValue: string; // for two-way binding


  categoryId: string;
  // Declare a variable to determine the form status 
  formStatus: string = "Add"
  constructor(private categorySer: CategoriesService, private toastr: ToastrService) { }
  ngOnInit(): void {

    this.categorySer.getData().subscribe((res: category[]) => {
      console.log(res);
      // store the returned data into an array 
      this.categoriesArray = res;

    })
    /* This code subscribes to the observable returned by getData() and logs the array of categories when the data changes in the 'categories' collection. */
  }

  submitCategoriesForm(e: Event, categoriesForm: any, categoryInput: any): void {
    e.preventDefault()

    // Display the value object inside the form that holds the values of all the inputs 



    /*Working with firestore database requires a key value pair data because firestore saves the data as a collection of documents each one is a group
    of key-value pair fields , So create an object with the data to send it */
    let categoryData = { // this object represents a document inside the database collection
      //save  key-value pairs each one represents a field inside this document
      // Save the value of the input with the name categoryText
      category: categoriesForm.value.categoryText,
    } // You could create an interface for this object to make sure the object always is of a particular structure
    // Add a subcategory if you want, For that we create a subCollection inside the main collection 'categories', We might want to create a separate form for this subcategory
    let subCategoryData = {
      subCategory: categoriesForm.value.categoryText // here we are targeting the same input's value but we better create a separate input field inside the form to store the subcategory
    }

    // Now send these documents objects to the service to be handled there, for that create an object to hold the two objects so we can send only one argument not many
    let categoryObjects = {
      categoryData,
      subCategoryData
    }

    // now pass the object to the desired method inside the service, the service returns a promise, handle it
    if (this.formStatus == 'Add') {
      this.categorySer.storeCategory(categoryObjects).then(documentRef => {



        // show the success message using the toastr
        this.toastr.success(` category stored successfully`)
      }).catch(error => this.toastr.error(error))
      // this code this.afs.collection('categories').add(categoryData) is like a post request sent to add a document to the collection 'categories' in the firestore database
      // then this request returns a promise that we can use then on it to fetch the response
    } else if (this.formStatus == 'Update') {

      this.categorySer.updateData(categoryData, this.categoryId).then(docRef => { // to update a category send an object ( of document fields ) not a only a category name; 
        this.toastr.success("Category updated successfully.")
        // Reset the form status
        this.formStatus = "Add"

      })
    }


    // finally reset the form 
    categoriesForm.reset()
  } // end form submit function

  /*   categoryEntered(e:Event , categoriesForm:any, categoryInput:any) {
  e.preventDefault();
   this.submitCategoriesForm(e, categoriesForm, categoryInput);
    }
   */

  updateCategory(categoryName: string, catId: string) {
    this.categoryControlValue = categoryName;
    this.categoryId = catId;
    // change the status 
    this.formStatus = "Update";
  }



  deleteCategory(id: string) {
    this.categorySer.deleteData(id).then(res => {
      console.log(res)
      this.toastr.success("Deleted successfully.")
    })
  }

  // send the update request to the firestore could database


}

/* Activating the firestore database is working as coming
First we imported the needed classes like AngularFireStoreModule there in the module and then initialized the app using the configurations we got from the firebase
console when we registered the app AngularFireModule.initializeApp(environment.firebaseConfig)
these configurations link the database we created with the service AngularFireStore, Now any data we add to the service will be read by the firestore database
  */

/*  Category Updating logic.
once the update button is clicked call a method and pass the category name and id to it, create a global variable to assign the category name to it, using two-way binding
make the variable changes it's value depending on the value of the input and the same way back,
create a global variable to determine the current status of the from, adding or updating, once the update button is clicked change the formStatus variable to later depend on it
to determine what job should the submitting method would do, add or update.
*/

/* Note that, When you update or delete a category from the firestore database the table is updated directly without having to reload the page like in case of using js*/