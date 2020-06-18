import { Beach, BeachPosition } from '@src/models/beach';
import { ForecastPoint } from '@src/clients/stormGlass';

// meters
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating =
      (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    return Math.round(finalRating);
  }

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

  /**
   * Rate will start from 1 given there will be always some wave period
   */
  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }

    if (period >= 10 && period < 14) {
      return 4;
    }
    if (period >= 14) {
      return 5;
    }

    return 1;
  }

  /**
   * Rate will start from 1 given there will always some wave height
   */
  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    ) {
      return 2;
    }
    if (
      height >= waveHeights.waistHigh.min &&
      height < waveHeights.waistHigh.max
    ) {
      return 3;
    }
    if (height >= waveHeights.headHigh.min) {
      return 5;
    }

    return 1;
  }

  public getPositionFromLocation(coordinates: number): BeachPosition {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return BeachPosition.N;
    }
    if (coordinates >= 50 && coordinates < 120) {
      return BeachPosition.E;
    }
    if (coordinates >= 120 && coordinates < 220) {
      return BeachPosition.S;
    }
    if (coordinates >= 220 && coordinates < 310) {
      return BeachPosition.W;
    }
    return BeachPosition.E;
  }
}
