import { countries, getEmojiFlag } from "countries-list";

// get sorted by name list of countries with emojies and country codes

const getCounryList = () => {
  const countryCodes = Object.keys(countries);
  const countryNames = countryCodes.map((code) => ({
    code: code,
    name: countries[code as keyof typeof countries].name,
    emoji: getEmojiFlag(code),
  }));
  return countryNames.sort((a, b) => a.name.localeCompare(b.name));
};

export default getCounryList;
