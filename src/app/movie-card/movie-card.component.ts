import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * fetch movies from FetchApiDataService service getAllMovies()
   * @returns an array of all movies
   * @function getMovies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * opens the MovieGenreComponent dialog
   * @param name
   * @param description
   * @function openGenre
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description,
      },
      //width: '280px'
    });
  }

  /**
   * opens the MovieDirectorComponent dialog
   * @param name
   * @param bio
   * @function openDirector
   */
  openDirector(name: string, bio: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: bio,
      },
      //width: '280px'
    });
  }

  /**
   * opens the MovieSummaryComponent dialog
   * @param description
   * @function openSynopsis
   */
  openSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Synopsis',
        content: description,
      },
      //width: '280px'
    });
  }

  /**
   * add favorite movies from FetchApiDataService service addFavorite()
   * @returns the added movie from the favorite movies array
   * @function addFavorite
   * @param id
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovies(id).subscribe((result) => {
      this.snackBar.open('Movie added to favorites.', 'OK', {
        duration: 2000,
      });
    });
  }

  /**
   * runs a boolean if selected movie is the favorite movie
   * @returns true or false
   * @function isMovieFavorite
   * @param id
   */
  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }
  /**
   * remove favorite movies from FetchApiDataService service removeFavorite()
   * @returns an updated favoriteMovies array
   * @function removeFavorite
   * @param id
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites.', 'OK', {
        duration: 2000,
      });
    });
  }
}
