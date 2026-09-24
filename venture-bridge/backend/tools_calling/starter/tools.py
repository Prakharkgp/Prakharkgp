import json
import os
import re
from base64 import b64encode
from html import unescape
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote_plus, urlencode
from urllib.request import Request, urlopen
from xml.etree import ElementTree


TOOLS = [
    {
        'type': 'function',
        'name': 'calculate',
        'description': 'Perform an arithmetic calculation with two numbers.',
        'parameters': {
            'type': 'object',
            'properties': {
                'operation': {
                    'type': 'string',
                    'enum': ['add', 'subtract', 'multiply', 'divide'],
                },
                'first': {'type': 'number'},
                'second': {'type': 'number'},
            },
            'required': ['operation', 'first', 'second'],
            'additionalProperties': False,
        },
        'strict': True,
    },
    {
        'type': 'function',
        'name': 'search_google_business_events',
        'description': (
            'Search Google or Google News for recent business events about a company. '
            'Use it for general news signals: partnerships, acquisitions, launches, '
            'fundraising, leadership changes, expansion, restructuring, or awards.'
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'company_name': {
                    'type': 'string',
                    'description': 'Company name to research.',
                },
                'max_results': {
                    'type': 'integer',
                    'description': 'Number of results to return, from 1 to 10.',
                    'minimum': 1,
                    'maximum': 10,
                },
            },
            'required': ['company_name', 'max_results'],
            'additionalProperties': False,
        },
        'strict': True,
    },
    {
        'type': 'function',
        'name': 'search_pappers_company',
        'description': (
            'Search Pappers for official French company identity information. Use it '
            'to retrieve SIREN/SIRET, legal name, legal form, headquarters, officers, '
            'and registry-level information when available.'
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'query': {
                    'type': 'string',
                    'description': 'Company name, SIREN, SIRET, or search query.',
                },
                'max_results': {
                    'type': 'integer',
                    'description': 'Number of company results to return, from 1 to 20.',
                    'minimum': 1,
                    'maximum': 20,
                },
            },
            'required': ['query', 'max_results'],
            'additionalProperties': False,
        },
        'strict': True,
    },
    {
        'type': 'function',
        'name': 'search_bodacc_announcements',
        'description': (
            'Search BODACC commercial announcements for a French company. Use it for '
            'official events such as creations, modifications, collective procedures, '
            'sales/transfers, radiations, and accounts filings.'
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'query': {
                    'type': 'string',
                    'description': 'Company name, SIREN, SIRET, or BODACC search query.',
                },
                'max_results': {
                    'type': 'integer',
                    'description': 'Number of BODACC announcements to return, from 1 to 20.',
                    'minimum': 1,
                    'maximum': 20,
                },
            },
            'required': ['query', 'max_results'],
            'additionalProperties': False,
        },
        'strict': True,
    },
    {
        'type': 'function',
        'name': 'search_companies_house_company',
        'description': (
            'Search Companies House for official UK company registry information. '
            'Use it for UK companies to retrieve company number, status, legal type, '
            'registered address snippet, incorporation date, and registry profile links.'
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'query': {
                    'type': 'string',
                    'description': 'UK company name or company number search query.',
                },
                'max_results': {
                    'type': 'integer',
                    'description': 'Number of company results to return, from 1 to 20.',
                    'minimum': 1,
                    'maximum': 20,
                },
            },
            'required': ['query', 'max_results'],
            'additionalProperties': False,
        },
        'strict': True,
    },
]


def calculate(operation: str, first: float, second: float) -> float:
    if operation == 'add':
        return first + second
    if operation == 'subtract':
        return first - second
    if operation == 'multiply':
        return first * second
    if operation == 'divide':
        if second == 0:
            raise ValueError('Cannot divide by zero')
        return first / second

    raise ValueError(f'Unknown operation: {operation}')


def _get_env(name: str) -> str | None:
    value = os.getenv(name)
    return value.strip() if value else None


def _strip_html(value: str) -> str:
    return re.sub(r'<[^>]+>', '', unescape(value)).strip()


def _truncate(value: Any, max_length: int = 600) -> Any:
    if value is None:
        return None
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)
    return text if len(text) <= max_length else f'{text[:max_length]}...'


def _load_json_url(url: str) -> dict[str, Any]:
    try:
        with urlopen(url, timeout=20) as response:
            return json.load(response)
    except HTTPError as error:
        detail = error.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'HTTP request failed ({error.code}): {detail}') from error
    except URLError as error:
        raise RuntimeError(f'Unable to reach provider: {error.reason}') from error


def _load_json_request(request: Request) -> dict[str, Any]:
    try:
        with urlopen(request, timeout=20) as response:
            return json.load(response)
    except HTTPError as error:
        detail = error.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'HTTP request failed ({error.code}): {detail}') from error
    except URLError as error:
        raise RuntimeError(f'Unable to reach provider: {error.reason}') from error


def _business_event_query(company_name: str) -> str:
    return (
        f'"{company_name.strip()}" (funding OR acquisition OR partnership OR launch '
        'OR expansion OR leadership OR restructuring OR award OR results OR contract)'
    )


def search_google_business_events(company_name: str, max_results: int = 5) -> str:
    if not company_name.strip():
        raise ValueError('company_name cannot be empty')
    if not 1 <= max_results <= 10:
        raise ValueError('max_results must be between 1 and 10')
    max_results = min(max_results, 5)

    provider = os.getenv('GOOGLE_SEARCH_PROVIDER', 'google_news').strip().lower()
    query = _business_event_query(company_name)
    print(f'Google provider: {provider}')

    if provider in {'google_news', 'google_news_rss', 'news'}:
        url = (
            'https://news.google.com/rss/search?'
            f'q={quote_plus(query)}&hl=fr&gl=FR&ceid=FR:fr'
        )
        try:
            with urlopen(url, timeout=20) as response:
                root = ElementTree.fromstring(response.read())
        except URLError as error:
            raise RuntimeError(f'Unable to reach Google News: {error.reason}') from error

        results = [
            {
                'title': item.findtext('title', default=''),
                'url': item.findtext('link', default=''),
                'summary': _strip_html(item.findtext('description', default='')),
                'published_at': item.findtext('pubDate', default=''),
                'provider': 'google_news_rss',
            }
            for item in root.findall('./channel/item')[:max_results]
        ]
        return json.dumps({'company_name': company_name, 'results': results}, ensure_ascii=False)

    if provider in {'custom_search', 'google_custom_search'}:
        api_key = _get_env('GOOGLE_SEARCH_API_KEY')
        search_engine_id = _get_env('GOOGLE_SEARCH_ENGINE_ID')
        if not api_key or not search_engine_id:
            raise RuntimeError(
                'Google Custom Search requires GOOGLE_SEARCH_API_KEY and '
                'GOOGLE_SEARCH_ENGINE_ID.'
            )
        parameters = urlencode({
            'key': api_key,
            'cx': search_engine_id,
            'q': query,
            'num': max_results,
            'dateRestrict': 'y1',
        })
        payload = _load_json_url(f'https://www.googleapis.com/customsearch/v1?{parameters}')
        results = [
            {
                'title': item.get('title', ''),
                'url': item.get('link', ''),
                'summary': item.get('snippet', ''),
                'published_at': item.get('pagemap', {}).get('metatags', [{}])[0].get(
                    'article:published_time',
                    item.get('pagemap', {}).get('metatags', [{}])[0].get('date', ''),
                ),
                'provider': 'google_custom_search',
            }
            for item in payload.get('items', [])
        ]
        return json.dumps({'company_name': company_name, 'results': results}, ensure_ascii=False)

    raise ValueError('Unknown GOOGLE_SEARCH_PROVIDER. Expected google_news or custom_search.')


def search_pappers_company(query: str, max_results: int = 5) -> str:
    if not query.strip():
        raise ValueError('query cannot be empty')
    if not 1 <= max_results <= 20:
        raise ValueError('max_results must be between 1 and 20')
    max_results = min(max_results, 5)

    api_token = _get_env('PAPPERS_API_TOKEN')
    if not api_token:
        raise RuntimeError('Pappers requires PAPPERS_API_TOKEN in the environment.')

    parameters = urlencode({
        'api_token': api_token,
        'q': query.strip(),
        'par_page': max_results,
    })
    payload = _load_json_url(f'https://api.pappers.fr/v2/recherche?{parameters}')
    entreprises = payload.get('resultats', [])[:max_results]
    results = [
        {
            'nom_entreprise': item.get('nom_entreprise'),
            'denomination': item.get('denomination'),
            'siren': item.get('siren'),
            'siret_siege': item.get('siege', {}).get('siret') if item.get('siege') else None,
            'forme_juridique': item.get('forme_juridique'),
            'date_creation': item.get('date_creation'),
            'ville': item.get('siege', {}).get('ville') if item.get('siege') else None,
            'code_postal': item.get('siege', {}).get('code_postal') if item.get('siege') else None,
            'code_naf': item.get('code_naf'),
            'libelle_code_naf': item.get('libelle_code_naf'),
            'dirigeants': item.get('dirigeants', [])[:5],
            'provider': 'pappers',
        }
        for item in entreprises
    ]
    return json.dumps({'query': query, 'results': results}, ensure_ascii=False)


def search_bodacc_announcements(query: str, max_results: int = 5) -> str:
    if not query.strip():
        raise ValueError('query cannot be empty')
    if not 1 <= max_results <= 20:
        raise ValueError('max_results must be between 1 and 20')
    max_results = min(max_results, 5)

    selected_fields = ','.join([
        'id',
        'dateparution',
        'familleavis_lib',
        'typeavis_lib',
        'commercant',
        'ville',
        'registre',
        'tribunal',
        'jugement',
        'acte',
        'modificationsgenerales',
        'radiationaurcs',
        'depot',
        'url_complete',
    ])
    parameters = urlencode({
        'select': selected_fields,
        'where': f'search("{query.strip()}")',
        'order_by': 'dateparution desc',
        'limit': max_results,
    })
    url = (
        'https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/'
        f'datasets/annonces-commerciales/records?{parameters}'
    )
    payload = _load_json_url(url)
    results = []
    for item in payload.get('results', []):
        results.append({
            'id': item.get('id'),
            'dateparution': item.get('dateparution'),
            'familleavis': item.get('familleavis_lib'),
            'typeavis': item.get('typeavis_lib'),
            'commercant': item.get('commercant'),
            'ville': item.get('ville'),
            'registre': item.get('registre'),
            'tribunal': item.get('tribunal'),
            'details': _truncate(item.get('jugement') or item.get('acte')
            or item.get('modificationsgenerales') or item.get('radiationaurcs')
            or item.get('depot')),
            'url': item.get('url_complete'),
            'provider': 'bodacc',
        })

    return json.dumps({'query': query, 'results': results}, ensure_ascii=False)


def search_companies_house_company(query: str, max_results: int = 5) -> str:
    if not query.strip():
        raise ValueError('query cannot be empty')
    if not 1 <= max_results <= 20:
        raise ValueError('max_results must be between 1 and 20')
    max_results = min(max_results, 5)

    api_key = _get_env('COMPANIES_HOUSE_API_KEY')
    if not api_key:
        raise RuntimeError(
            'Companies House requires COMPANIES_HOUSE_API_KEY in the environment.'
        )

    token = b64encode(f'{api_key}:'.encode('utf-8')).decode('ascii')
    parameters = urlencode({
        'q': query.strip(),
        'items_per_page': max_results,
    })
    request = Request(
        f'https://api.company-information.service.gov.uk/search/companies?{parameters}',
        headers={'Authorization': f'Basic {token}'},
    )
    payload = _load_json_request(request)
    results = []
    for item in payload.get('items', [])[:max_results]:
        company_number = item.get('company_number')
        results.append({
            'title': item.get('title'),
            'company_number': company_number,
            'company_status': item.get('company_status'),
            'company_type': item.get('company_type'),
            'date_of_creation': item.get('date_of_creation'),
            'address_snippet': item.get('address_snippet'),
            'description': item.get('description'),
            'description_identifier': item.get('description_identifier'),
            'profile_url': (
                f'https://find-and-update.company-information.service.gov.uk/company/{company_number}'
                if company_number else None
            ),
            'provider': 'companies_house',
        })

    return json.dumps({'query': query, 'results': results}, ensure_ascii=False)


def execute_tool(name: str, arguments: str) -> str:
    parsed_arguments = json.loads(arguments)
    if name == 'calculate':
        result = calculate(**parsed_arguments)
        return str(result)
    if name == 'search_google_business_events':
        return search_google_business_events(**parsed_arguments)
    if name == 'search_pappers_company':
        return search_pappers_company(**parsed_arguments)
    if name == 'search_bodacc_announcements':
        return search_bodacc_announcements(**parsed_arguments)
    if name == 'search_companies_house_company':
        return search_companies_house_company(**parsed_arguments)

    raise ValueError(f'Unknown tool: {name}')