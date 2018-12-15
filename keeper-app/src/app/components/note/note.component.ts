import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NotesService, Note } from '../../services/notes.service';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  private user: User;
  private note: Note = new Note();
  private editMode: boolean = false;

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/']);
    }

    this.activatedRoute.params.forEach((params: Params) => {
      let noteId = params['id'];
      if (noteId !== 'new') {
        this.notesService.getNoteById(noteId)
        .then((note:Note) => {
          this.note = note;
          this.editMode = true;
        }).catch(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.note = new Note();
        this.editMode = false;
      }
    });
  }

  createOrUpdateNote(): void {

    if (this.editMode) {
      this.notesService.editNote(this.note)
      .then((note:Note) => {
        this.router.navigate(['/']);
      });
    } else {
      this.notesService.createNote(this.note)
      .then((note:Note) => {
        this.router.navigate(['/']);
      });
    }

  }

  cancelOrDeleteNote(): void {

    if (this.editMode) {
      if (!confirm("Are you sure you want to delete this note?")){
        return;
      }
      this.notesService.deleteNote(this.note.Id)
      .then(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.router.navigate(['/']);
    }

  }

}