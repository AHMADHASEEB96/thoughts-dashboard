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
  constructor(
    private postsSrvs: PostsService
  ) { }
  ngOnInit() {
    this.postsSrvs.getPosts().subscribe(posts => { this.posts = posts; console.log(posts) })

  }
}
