import { Hero, HeroSave } from '../../../../hero/interface/hero';
import { HeroRequest, HeroResponse } from '../interface/hero.interface';

export class HeroAdapter {
  public static mapHeroResponseToHero(heroResponse: HeroResponse): Hero {
    return {
      id: heroResponse.id,
      name: heroResponse.name,
      year: heroResponse.year,
      comicPublishers: heroResponse.comic_publishers,
      heroStatistics: heroResponse.hero_statistics,
      isTophero: heroResponse.is_top_hero,
      isSelected: false,
    };
  }

  public static mapHeroToHeroRequest(hero: Hero): HeroRequest {
    return {
      name: hero.name,
      year: hero.year,
      publisher_id: hero.comicPublishers!.id,
      is_top_hero: hero.isTophero,
    };
  }
}
