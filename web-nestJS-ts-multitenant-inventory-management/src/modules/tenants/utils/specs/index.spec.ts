import { countryMap } from '../../../../shared/enums/country.enum';
import { currencyMap } from '../../../../shared/enums/currency.enum';
import { languageMap } from '../../../../shared/enums/language.enum';
import { createMapCodeEnum } from '..';

describe('#Tenant.Utils', () => {
  describe('.createMapCodeEnum', () => {
    it('should return an object where each key and value corresponds to country codes', () => {
      const result = createMapCodeEnum(countryMap);

      Object.keys(countryMap).forEach((code) => {
        expect(result[code]).toBe(code);
      });
    });

    it('should return an object where each key and value corresponds to currency codes', () => {
      const result = createMapCodeEnum(currencyMap);

      Object.keys(currencyMap).forEach((code) => {
        expect(result[code]).toBe(code);
      });
    });

    it('should return an object where each key and value corresponds to language codes', () => {
      const result = createMapCodeEnum(languageMap);

      Object.keys(languageMap).forEach((code) => {
        expect(result[code]).toBe(code);
      });
    });
  });
});
