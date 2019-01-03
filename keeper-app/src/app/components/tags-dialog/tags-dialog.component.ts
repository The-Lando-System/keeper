import { Component, OnInit, Inject } from '@angular/core';
import { Tag } from 'src/app/services/notes.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tags-dialog',
  templateUrl: './tags-dialog.component.html',
  styleUrls: ['./tags-dialog.component.css']
})
export class TagsDialog implements OnInit {

  allTags: TagSelection[] = [];
  filteredTags: TagSelection[] = [];
  selectedTags: Tag[] = [];
  filterTerm: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public tags: Tag[]
  ) {}

  ngOnInit(): void {
    this.allTags = this.tags.map(tag => new TagSelection(tag.Name));
    this.filteredTags = this.allTags;
  }

  filterTags(): void {

    let term = this.filterTerm.trim().toLowerCase();

    if (term === '') {
      this.filteredTags = this.allTags;
      return;
    }

    this.filteredTags = this.allTags.filter(tagSelection => {
      return tagSelection.name.trim().toLowerCase().includes(term);
    });
  }

  tagSelected(event): void {
    let tagSelection = event.option.value as TagSelection;

    for (let tag of this.allTags) {
      if (tag.name === tagSelection.name) {
        tag.selected = event.option.selected;
      }
    }

    if (event.option.selected) {
      
      this.selectedTags.push(new Tag(tagSelection.name));
    
    } else {
    
      let index = -1;
      for (let i=0; i<this.selectedTags.length; i++) {
        if (this.selectedTags[i].Name === tagSelection.name) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      }
    
    }

  }
}

export class TagSelection {
  public name: string;
  public selected: boolean;

  constructor(name:string) {
    this.name = name;
  }
}