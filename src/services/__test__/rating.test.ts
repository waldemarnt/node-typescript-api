import { Rating } from '@src/services/rating';
import { Beach, BeachPosition } from '@src/models/beach';

describe('Rating Service', () => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.E,
    user: 'some-user',
  };
  const defaultRating = new Rating(defaultBeach);
  describe('Calculate rating for a given point', () => {
    //TODO
  });

  describe('Get rating based on wind and wave positions', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.E
      );
      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.S
      );
      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.W
      );
      expect(rating).toBe(5);
    });
  });
});
