#!/usr/bin/env python3
"""Routines for calculating cpi categories"""

import os
import copy
import json
from typing import Dict, List

def safe_div(a, b):
    """no divide by zero"""
    if b == 0.0:
        return float("NaN")
    return a / b

def flatten(arr: Dict) -> List:
    """Flatten dict structure"""
    ret = []
    for a in arr:
        ret.extend(a)
    return ret


def load_categories(cats: Dict) -> List:
    """Flatten top level categories"""
    newcats = []
    for c in cats:
        sources = [[q['id'] for q in x['sources']]
                        for x in c['subcategories']]
        sources = flatten(sources)
        c['sources'] = list(dict.fromkeys(sources))
        del c['type']
        newcats.append(c)
        for subc in c['subcategories']:
            sources = [q['id'] for q in subc['sources']]
            subc['sources'] = list(dict.fromkeys(sources))
            newcats.append(subc)
        del c['subcategories']
    return newcats

def calc_category_indexes(data: Dict, categories: Dict) -> Dict:
    """Calculate category indexes"""
    newdict = copy.deepcopy(data)
    del newdict['derivations']
    newdict['categories'] = {}
    for c in categories:
        c = dict(c)
        sources = c['sources']
        del c['sources']
        od = data
        der = od['derivations']
        current = der['current']
        year_ago = der['yearAgo']
        cs = [x for x in current if x['source_id'] in sources]
        ys = [x for x in year_ago if x['source_id'] in sources]
        za1 = [float(z['adjustedInflationIndex']) for z in cs]
        za2 = [float(z['relativeImportance']) for z in cs]
        zb1 = [float(z['adjustedInflationIndex']) for z in ys]
        zb2 = [float(z['relativeImportance']) for z in ys]
        current: float = safe_div(sum(za1), sum(za2))
        year_ago: float = safe_div(sum(zb1), sum(zb2))
        value: float = safe_div(current,  year_ago) * 100 - 100
        newdict['categories'][c['name']] = {
            'currentInflationIndex': current,
            'yearAgoInflationIndex': year_ago,
            'yearOverYearInflation': value
        }
    return newdict

def postprocess_categories(location: str, data: Dict):
    """postprocess category indexes"""
    fname =  os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        f'categories-{location}.json'
    )
    with open(fname, encoding='utf-8') as catf:
        catlist = load_categories(json.load(catf))
        return calc_category_indexes(data, catlist)

if __name__ == '__main__':
    import pprint
    location: str = 'uk'
    with open(
            f'categories-{location}.json', encoding='utf-8'
    ) as catf:
        catlist = load_categories(json.load(catf))
    with open(
            f'test/test-data-{location}.json', encoding='utf-8'
    ) as dataf:
        x = calc_category_indexes(json.load(dataf), catlist)
        pprint.pprint(x)
