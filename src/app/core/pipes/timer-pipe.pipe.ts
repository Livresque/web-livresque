import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerPipe',
  standalone: true
})
export class TimerPipePipe implements PipeTransform {
  transform(value: Date | null): string {
    if (!value) {
      return 'Pas encore connecté';
    }

    const seconds = value.getUTCSeconds();
    const minutes = value.getUTCMinutes();
    const hours = value.getUTCHours();

    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
