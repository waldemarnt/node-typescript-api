import { Beach, BeachPosition } from '@src/models/beach';

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingBasedOnWindAndWavePositions(
    wavePoint: BeachPosition,
    windPoint: BeachPosition
  ): number {
    // if wind is onshore, low rating
    if (wavePoint === windPoint) {
      return 1;
    } else if (this.isWindOffShore(wavePoint, windPoint)) {
      return 5;
    }
    // cross winds gets 3
    return 3;
  }

  private isWindOffShore(wavePoint: string, windPoint: string): boolean {
    return (
      (wavePoint === BeachPosition.N &&
        windPoint === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      (wavePoint === BeachPosition.S &&
        windPoint === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      (wavePoint === BeachPosition.E &&
        windPoint === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      (wavePoint === BeachPosition.W &&
        windPoint === BeachPosition.E &&
        this.beach.position === BeachPosition.W)
    );
  }
}
