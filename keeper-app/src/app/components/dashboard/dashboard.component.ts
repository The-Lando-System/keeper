import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NotesService, Note, Tag } from '../../services/notes.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  filterTerm: string = '';
  allTags: Tag[] = [];
  selectedTag: Tag = new Tag('');
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
      this.notesService.getAllTags()
      .then((tags:Tag[]) => {
        this.allTags = tags;
        this.allTags.unshift(new Tag(""));
      });
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

    let filterTerm = this.filterTerm.toLowerCase().trim();
    let filterTag = this.selectedTag.Name.trim();

    if (filterTerm === '' && filterTag === ''){
      this.filteredNotes = this.notes;
      return;
    }

    this.filteredNotes = this.notes.filter(note => {

      let filterOnText = false;

      if (filterTerm !== '') {
        let title = note.Title ? note.Title.toLowerCase() : '';
        let content = note.Content ? note.Content.toLowerCase() : '';
        let tags = '';
        if (note.Tags && note.Tags.length > 0){
          tags = note.Tags.map(tag => tag.Name).reduce(tagName => tagName.toLowerCase() + ' ');
        }
        filterOnText = title.includes(filterTerm) || content.includes(filterTerm) || tags.includes(filterTerm);
      }
      
      let filterOnTag = false;

      if (filterTag !== '') {
        for (let tag of note.Tags) {
          if (tag.Name === filterTag) {
            filterOnTag = true;
            break;
          }
        }
      }

      if (filterTerm === '') {
        return filterOnTag;
      }

      if (filterTag === '') {
        return filterOnText;
      }

      return filterOnText && filterOnTag;
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
