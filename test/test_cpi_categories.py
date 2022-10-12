import json
import pprint
from cpi_categories import load_categories, calc_category_indexes

def test_load_categories():
    location: str = 'us'
    with open(
            f'test/categories-{location}.json', encoding='utf-8'
    ) as catf:
        catlist = load_categories(json.load(catf))
    with open(
            f'test/test-data-{location}.json', encoding='utf-8'
    ) as dataf:
        x = calc_category_indexes(json.load(dataf), catlist)
        pprint.pprint(x)
