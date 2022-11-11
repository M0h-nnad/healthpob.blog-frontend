import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PostsService } from '../../service/posts/posts.service';
import { validator } from './mime-validation';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  // encapsulation:ViewEncapsulation.None
})
export class PostViewComponent implements OnInit, OnDestroy {
  private user: User;
  postId: string;
  isLoading: boolean = true;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  imageUrl: string;
  mode: string = 'add';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  postForm: FormGroup;
  postSubscription: Subscription;
  addPostSubscription: Subscription;
  updatePostSubscription: Subscription;
  postReq;
  tags = [];
  editorStyle = {
    height: '300px',
    width: '500px',
  };
  postFormData: FormData = new FormData();
  constructor(
    private authService: AuthService,
    private postService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserDoc();
    this.initForm();
    this.checkMode();
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   if ((value || '').trim()) {
  //     this.tags.push(value.trim());
  //   }

  //   if (input) {
  //     input.value = '';
  //   }
  // }

  // remove(fruit) {
  //   const index = this.tags.indexOf(fruit);

  //   if (index >= 0) {
  //     this.tags.splice(index, 1);
  //   }
  // }

  initForm() {
    this.postForm = new FormGroup({
      title: new FormControl(null),
      editor: new FormControl(null),
      tags: new FormControl(null),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [validator],
      }),
      category: new FormControl('', [Validators.required]),
    });
    this.isLoading = false;
  }

  checkMode() {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.mode = 'edit';
      this.postSubscription = this.postService
        .getPost(this.postId, true)
        .subscribe(
          (res: any) => {
            this.tags = res.post.tags;
            this.postForm.patchValue({
              title: res.post.title,
              editor: res.post.content,
              tags: this.tags,
              category: res.post.category,
            });
            this.imageUrl = res.post.imagePath || res.post.ImagePath;
            this.isLoading = false;
          },
          (error) => {
            this._snackBar.open(error.error.message, null, {
              duration: 5000,
            });
            this.isLoading = false;
          }
        );
      return;
    }
  }

  initPostReq() {
    this.postFormData.forEach((val, key, fD) => {
      this.postFormData.delete(key);
    });
    this.postForm.controls['tags'].setValue(this.tags);
    this.postReq = {
      authorId: this.user._id,
      title: this.postForm.controls['title'].value,
      content: this.postForm.controls['editor'].value,
      category: this.postForm.controls['category'].value,
      tags: this.tags,
      date: new Date(),
      photo: this.postForm.controls['image'].value,
    };

    for (let key in this.postReq) {
      if (key !== 'tags') {
        this.postFormData.append(key, this.postReq[key]);
        continue;
      }
      this.postFormData.append('tags', JSON.stringify(this.tags));
    }
  }
  onImagePic(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    this.initPostReq();
    if (this.mode === 'edit') {
      this.updatePostSubscription = this.postService
        .updatePost(this.postId, this.postFormData)
        .subscribe(
          (res: any) => {
            this.router.navigate(['/system/posts']);
            this._snackBar.open(res.message, null, {
              duration: 5000,
            });
          },
          (error) => {
            this._snackBar.open(error.error.message, null, {
              duration: 5000,
            });
          }
        );
      this.postFormData = new FormData();
      return;
    }
    this.addPostSubscription = this.postService
      .addPost(this.postFormData)
      .subscribe(
        (res: any) => {
          this.router.navigate(['/system/posts']);
          this._snackBar.open(res.message, null, {
            duration: 5000,
          });
        },
        (error) => {
          this._snackBar.open(error.error.message, null, {
            duration: 5000,
          });
        }
      );
    this.postFormData = new FormData();
  }
  ngOnDestroy() {
    if (typeof this.postSubscription !== 'undefined') {
      this.postSubscription.unsubscribe();
    }
    if (typeof this.addPostSubscription !== 'undefined') {
      this.addPostSubscription.unsubscribe();
    }
    if (typeof this.updatePostSubscription !== 'undefined') {
      this.updatePostSubscription.unsubscribe();
    }
  }
}
