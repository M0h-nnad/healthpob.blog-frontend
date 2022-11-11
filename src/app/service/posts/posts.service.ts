import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, first } from 'rxjs/operators';
import { BehaviorSubject, pipe, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private POSTS_URL = '/api/posts';
  private COMMENTS_URL = '/api/post/comments/';
  private postsRouted = [];
  private postSubject = new BehaviorSubject<any[]>(this.postsRouted);
  constructor(private http: HttpClient) {}

  set searchPostsArr(val: any) {
    this.postsRouted = val;
    this.postSubject.next(this.postsRouted);
  }

  get searchPostsArr() {
    return this.postSubject;
  }

  addPost(post) {
    return this.http.post(this.POSTS_URL, post).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getUserPosts(id, pageSize, currentSize) {
    const queryParams = `?pageSize=${pageSize}&page=${currentSize}`;
    return this.http.get(this.POSTS_URL + '/user/' + id + queryParams).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  deletePost(id) {
    return this.http.delete(this.POSTS_URL + '/' + id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updatePost(id, UpdatedPost) {
    return this.http.put(this.POSTS_URL + '/' + id, UpdatedPost).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getPost(id, isReloaded) {
    return this.http
      .get(this.POSTS_URL + '/' + id, { params: { isReloaded } })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  publishPost(id, publishState) {
    return this.http
      .put(`${this.POSTS_URL}/publish/${id}`, { publishState })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getAllPosts(pageSize: number, currentSize: number) {
    const queryParams = `?pagesize=${pageSize}&page=${currentSize}`;
    return this.http.get(this.POSTS_URL + queryParams).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  createComment(CommentReq) {
    return this.http.post(this.COMMENTS_URL, CommentReq).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getPostComments(id) {
    return this.http.get(this.COMMENTS_URL + id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updateComment(id, CommentReq) {
    return this.http.put(this.COMMENTS_URL + id, CommentReq).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  deleteComment(id) {
    return this.http.delete(this.COMMENTS_URL + id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  increaseShare(id) {
    return this.http
      .put(this.POSTS_URL + '/share/' + id, {})
      .pipe(catchError((err) => throwError(err)));
  }

  getDashboard() {
    return this.http
      .get(this.POSTS_URL + '/dashboard')
      .pipe(catchError((err) => throwError(err)));
  }

  searchPosts(s) {
    return this.http
      .get(this.POSTS_URL + '/search/', { params: { search: s } })
      .pipe(
        first(),
        catchError((err) => throwError(err))
      );
  }

  getHeaderPosts() {
    return this.http.get(this.POSTS_URL + '/header').pipe(
      first(),
      catchError((err) => throwError(err))
    );
  }
}
