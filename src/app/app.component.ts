import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @Input() offset: number;
  title = 'Notebook App';
  height: number;

  constructor(@Inject('Window') private window: Window,
    private cdRef: ChangeDetectorRef
  ) {
    this.offset = 0;
  }

  ngAfterViewInit() {
    this.height = this.computeHeight(window.innerHeight);
    this.cdRef.detectChanges();
  }

  onResize(event) {
    this.height = this.computeHeight(event.target.innerHeight);
  }

  computeHeight(height: number): number {
    return height + this.offset;
  }
}
