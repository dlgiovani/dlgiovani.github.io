from geonamescache import GeonamesCache

_gc = GeonamesCache()
_city_map: dict[str, str] = {
    c['name'].lower(): c['countrycode']
    for c in _gc.get_cities().values()
}

def city_to_country(city: str) -> str | None:
    return _city_map.get(city.lower().strip())
