import { Component, OnInit, Inject } from '@angular/core';
import { Tag } from 'src/app/services/notes.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tags-dialog',
  templateUrl: './tags-dialog.component.html',
  styleUrls: ['./tags-dialog.component.css']
})
export class TagsDialog implements OnInit {

  selectedTags: Tag[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public allTags: Tag[]
  ) {}

  ngOnInit(): void {
  }

}