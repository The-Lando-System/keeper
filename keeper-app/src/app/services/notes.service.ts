import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { RequestService } from './request.service';
import { Globals } from '../globals';

@Injectable()
export class NotesService implements OnInit {

  private notesEndpoint: string = `${Globals.ServiceDomain}/notes`;

  constructor(
    private authService: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {}

  getNoteById(id:string): Promise<Note> {
    return this.requestService.get(`${this.notesEndpoint}/${id}`, this.authService.createAuthHeaders());
  }

  getAllNotes(): Promise<Note[]> {
    return this.requestService.get(this.notesEndpoint, this.authService.createAuthHeaders());
  }

  createNote(newNote:Note): Promise<Note> {
    return this.requestService.post(this.notesEndpoint, newNote, this.authService.createAuthHeaders());
  }

  editNote(editedNote:Note): Promise<Note> {
    return this.requestService.put(this.notesEndpoint, editedNote, this.authService.createAuthHeaders());
  }

  deleteNote(id:string): Promise<void> {
    return this.requestService.delete(`${this.notesEndpoint}/${id}`, this.authService.createAuthHeaders());
  }

}

export class Note {

  public Id: string;
  public LastModified: Date;

  public Title: string;
  public Content: string;

}