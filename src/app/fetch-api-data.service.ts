import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflixdb-0sx9.onrender.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * User registration
   * @service POST to the user endpoint
   * @param userDetails {Username: "", Password: "", Email: ""}
   * @returns A JSON object holding data about the added user
   * @function userRegistration
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * User login
   * @service POST to the login endpoint
   * @param userDetails {Username: "", Password: "", Email: ""}
   * @returns A JSON object holding data about the logged-in user
   * @function userLogin
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all movies
   * @service GET all movies from movies endpoint
   * @returns A JSON abject holding data about all movies
   * @function getAllMovies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get one movie
   * @service GET a single movie from the movies/:title endpoint
   * @param title
   * @returns A JSON object holding data about one movie
   * @function getMovie
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get director
   * @service GET data about a director by name from the movies/director/:directorName endpoint
   * @param directorName
   * @returns A JSON object holding data about the specified director
   * @function getOneDirector
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('username');
    return this.http
      .get(apiUrl + 'movies/director/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get genre
   * @service GET data about a genre by name from the movies/genre/:genreName endpoint
   * @param genreName
   * @returns A JSON object holding the name, description and movies of a genre
   * @function getOneGenre
   */
  getOneGener(generName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/gener/' + generName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get user
   * @service GET the user data by name from the user/:username endpoint
   * @returns A JSON object holding data about the user
   * @function getOneUser
   */
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  /**
   * Edit user
   * @service PUT request to update user at endpoint users/:username
   * @param updatedUser
   * @returns A JSON object holding the updated user data
   * @function editUser
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.Username, updatedUser, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Delete user
   * @service DELETE the user at endpoint /users/:username
   * @returns a message on delete
   * @function deleteUser
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user.Username, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  /**
   * Get a movie from the favorite movies
   * @service GET favorite movie at endpoint /users/:username/movies/:movieId
   * @returns A JSON object holding the updated user data
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavMovies),
        catchError(this.handleError)
      );
  }

  /**
   * Add a movie to favorite movies
   * @service POST a movie to user's favorite movies list at endpoint /users/:username/movies/:movieId
   * @param movieId
   * @returns A JSON object holding the updated user data
   * @function addFavoriteMovies
   */
  addFavoriteMovies(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .post(
        apiUrl + 'users/' + user.Username + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
          responseType: 'text',
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavMovies.indexOf(movieId) >= 0;
  }

  /**
   * Delete a movie from the favorite movies
   * @service DELETE favorite movie at endpoint /users/:username/movies/:movieId
   * @param movieId
   * @returns A JSON object holding the updated user data
   * @function deleteFavoriteMovies
   */
  deleteFavoriteMovies(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      // only splice array when item is found
      user.FavMovies.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Extract the response data from the HTTP response
   * @param response
   * @returns the response body or an empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
  /**
   * Handle API call errors
   * @param error
   * @returns error message
   * @function handleError
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
