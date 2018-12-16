import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NotesService, Note } from '../../services/notes.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  filterTerm: string;
  loading: boolean = false;

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/']);
    } else {
      this.getNotes();
    }
  }

  getNotes(): void {
    this.loading = true;
    this.notesService.getAllNotes().then((notes) => {
      this.notes = this.filteredNotes = notes;
      this.loading = false;
    });
  }

  filterNotes(): void {

    if (this.filterTerm.trim() === ''){
      this.filteredNotes = this.notes;
      return;
    }

    this.filteredNotes = this.notes.filter(note => {

      let term = this.filterTerm.toLowerCase();
      
      let title = note.Title ? note.Title.toLowerCase() : '';
      let content = note.Content ? note.Content.toLowerCase() : '';

      return title.includes(term) || content.includes(term);
    });
  }

  deleteNote(note:Note): void {

    if (!confirm("Are you sure you want to delete this note?")){
      return;
    }

    this.notesService.deleteNote(note.Id)
    .then(() => {
      this.getNotes();
      this.filterTerm = '';
    });

  }

}
