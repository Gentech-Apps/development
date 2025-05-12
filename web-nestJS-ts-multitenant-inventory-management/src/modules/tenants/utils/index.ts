import { countryMap } from '../../../shared/enums/country.enum';
import { languageMap } from '../../../shared/enums/language.enum';
import { currencyMap } from '../../../shared/enums/currency.enum';

export function createMapCodeEnum(data: unknown) {
  return Object.keys(data).reduce(
    (acc, code) => {
      acc[code] = code;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export const CountryCodeEnum = createMapCodeEnum(countryMap);
export const LanguageCodeEnum = createMapCodeEnum(languageMap);
export const CurrencyCodeEnum = createMapCodeEnum(currencyMap);
