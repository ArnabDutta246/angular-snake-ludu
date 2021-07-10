import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-log',
  templateUrl: './current-log.component.html',
  styleUrls: ['./current-log.component.scss'],
})
export class CurrentLogComponent implements OnInit, OnChanges {
  @Input() historyData: History = null;
  history: History;
  constructor() {}

  ngOnInit() {
    this.history = this.historyData;
  }

  ngOnChanges() {
    this.history = this.historyData;

    console.log('on changes', this.history);
  }
}
