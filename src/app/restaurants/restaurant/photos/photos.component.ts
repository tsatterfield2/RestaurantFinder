import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
})
export class PhotosComponent {
  @Input() photos: any[];
  currentPhotoIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  get currentPhoto() {
    return this.photos[this.currentPhotoIndex];
  }

  OnPhotoClick(photo: any) {
    window.open(photo.getUrl({ maxWidth: 800 }), '_blank');
  }

  OnShowPreviousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
      this.cdr.detectChanges();
    }
  }

  OnShowNextPhoto() {
    if (this.currentPhotoIndex < this.photos.length - 1) {
      this.currentPhotoIndex++;
      this.cdr.detectChanges();
    }
  }
}
