import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { PostsService } from '../../services/posts/posts.service';
import { object } from '@angular/fire/database';
import { post } from '../../interfaces/post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css'
})

export class AllPostsComponent {
  posts: any = []; // It should be  posts: Array<Object> = []; but didn't work don't know why
  //posts: Array<post>;
  isActionMenuVisible: boolean = false;
  constructor(
    private postsSrvs: PostsService,
    private toster: ToastrService
  ) { }
  ngOnInit() {
    this.postsSrvs.getPosts().subscribe(posts => { this.posts = posts; })
  }

  toggleActionsMenu(e: Event) {
    const target = e.target as HTMLInputElement;
    // e.stopPropagation()
    if (target.classList.contains('action-options-icon')) {
      this.isActionMenuVisible = !this.isActionMenuVisible
    }
  }
  hideActionsMenu(e: Event) {
    const target = e.target as HTMLElement;
    if (!target?.closest('.action-options-icon')) { // exclude this element and it's descendants 
      this.isActionMenuVisible = false
    }
  }
  deletePost(postId: any, postImagePath: string) {
    if (confirm("are you sure you need to delete this post ?") == true) {
      console.log(postImagePath)
      this.postsSrvs.deletePostImage(postImagePath).then(ress => {
        this.postsSrvs.deletePost(postId).then(res => {
          this.toster.success(" Post deleted ")
        })
      })


    }
    else {
      this.toster.error(" Post deletion was cancelled  ")

    }
    console.log(postId)
  }

  updateFeatured(id: any, postData: post) {
    this.postsSrvs.updatePost(id, postData)
  }
}

