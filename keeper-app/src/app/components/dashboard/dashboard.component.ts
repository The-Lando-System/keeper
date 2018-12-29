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
  filterTags: Tag[] = [];
  loading: boolean = false;
  error: string = '';

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
      this.getTags();
    }
  }

  getTags(): void {
    this.notesService.getAllTags()
    .then((tags:Tag[]) => {
      this.allTags = tags;
      this.allTags.unshift(new Tag(""));
    }).catch(() => {
      this.loading = false;
      this.error = 'Encountered error retrieving tags...';
    });
  }

  getNotes(): void {
    this.loading = true;
    this.notesService.getAllNotes().then((notes) => {
      this.notes = this.filteredNotes = notes;
      this.filterNotes();
      this.loading = false;
    }).catch(() => {
      this.loading = false;
      this.error = 'Encountered error retrieving notes...';
    });
  }

  filterNotes(): void {

    let filterTerm = this.filterTerm.toLowerCase().trim();

    if (filterTerm === '' && this.filterTags.length === 0){
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

      if (this.filterTags.length > 0) {
        
        let noteContainsAllFilterTags = true;

        for (let filterTag of this.filterTags) {
          noteContainsAllFilterTags = 
            noteContainsAllFilterTags && note.Tags.map(tag => tag.Name).includes(filterTag.Name);
        }

        filterOnTag = noteContainsAllFilterTags;
      }

      if (filterTerm === '') {
        return filterOnTag;
      }

      if (this.filterTags.length === 0) {
        return filterOnText;
      }

      return filterOnText && filterOnTag;
    });
  }

  deleteNote(note:Note): void {

    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this note?")){
      return;
    }

    this.notesService.deleteNote(note.Id)
    .then(() => {
      this.getNotes();
    }).catch(() => {
      this.error = 'Encountered error deleting note...';
    });

  }

  getLastModifiedString(dateString:string): string {
    let date = new Date(dateString); 
    return `${date.toLocaleTimeString('en-US')} - ${date.toLocaleDateString('en-US')}`;
  }

  addTagFilter(tag:Tag): void {
    let tagName = tag.Name.trim();
    
    this.selectedTag.Name = '';

    if (tagName !== '') {
      this.filterTags.push(new Tag(tagName));
      this.filterNotes();
    }
  }

  removeFilterTag(i:number): void {
    this.filterTags.splice(i,1);
    this.filterNotes();
  }

}
