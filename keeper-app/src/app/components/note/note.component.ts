import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NotesService, Note, Tag } from '../../services/notes.service';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  user: User;
  note: Note = new Note();
  editMode: boolean = false;
  allTags: Tag[] = [];
  selectedTag: Tag = new Tag('');
  loading: boolean = false;

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
        this.getNoteById(noteId);
      } else {
        this.note = new Note();
        this.editMode = false;
      }
    });

    this.notesService.getAllTags()
    .then((tags:Tag[]) => {
      this.allTags = tags;
    });
  }

  getNoteById(id:string): void {

    this.loading = true;

    this.notesService.getNoteById(id)
    .then((note:Note) => {
      this.note = note;
      this.editMode = true;
      this.loading = false;
    }).catch(() => {
      this.router.navigate(['/']);
    });
  }

  createOrUpdateNote(): void {

    this.loading = true;

    if (this.editMode) {
      this.notesService.editNote(this.note)
      .then((note:Note) => {
        this.router.navigate(['/']);
      }).catch((err) => {
        this.router.navigate(['/']);
      });
    } else {
      this.notesService.createNote(this.note)
      .then((note:Note) => {
        this.router.navigate(['/']);
      }).catch((err) => {
        this.router.navigate(['/']);
      });
    }
  }

  deleteNote(): void {

    if (!confirm("Are you sure you want to delete this note?")){
      return;
    }

    this.loading = true;

    this.notesService.deleteNote(this.note.Id)
    .then(() => {
      this.router.navigate(['/']);
    }).catch((err) => {
      this.router.navigate(['/']);
    });

  }

  addTag(): void {

    let tagName = this.selectedTag.Name.trim();

    if (tagName === '') return;
    
    for (let tag of this.note.Tags) {
      if (tag.Name === tagName) {
        return;
      }
    }

    this.selectedTag.Name = tagName;

    this.note.Tags.push(this.selectedTag);
    this.selectedTag = new Tag('');
  }

  removeTag(i:number): void {
    this.note.Tags.splice(i,1);
  }

  getLastModifiedString(dateString:string): string {
    let date = new Date(dateString); 
    return `${date.toLocaleTimeString('en-US')} - ${date.toLocaleDateString('en-US')}`;
  }

}
