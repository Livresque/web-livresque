import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  @Input() title: string;
  @Input() value: Date | null = null;
  @Input() icon: string;


  constructor() { }

  ngOnInit() {
  }

}
