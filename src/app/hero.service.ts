import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
                    .pipe(
                      tap(_ => this.log(`feched hero id=${id}`)),
                      catchError(this.handleError<Hero>(`getHero id=${id}`))
                    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero)
                  .pipe(
                    tap((hero: Hero) => this.log(`Added hero ${hero.name}`)),
                    catchError(this.handleError<any>('addHero'))
                  );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
                    .pipe(
                      tap(_ => this.log(`updated hero ${hero.name}`)),
                      catchError(this.handleError<any>('updateHero'))
                    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
                    .pipe(
                      tap(_ => this.log(`deleted hero ${id}`)),
                      catchError(this.handleError<any>('updateHero'))
                    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) return of([]);

    const url = `${this.heroesUrl}/?name=${term}`;

    return this.http.get<Hero[]>(url)
                    .pipe(
                      tap(_ => this.log(`found heroes matching "${term}"`)),
                      catchError(this.handleError<Hero[]>('searchHeroes', []))
                    )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T)
    }
  }

  log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

}
