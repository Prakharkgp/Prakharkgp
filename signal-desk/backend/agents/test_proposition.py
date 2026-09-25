"""Offline checks for proposition tool wiring; no Azure credentials required."""

import json
import unittest
from types import SimpleNamespace

from agents.proposition.knowledge_base import retrieve_relevant_knowledge
from agents.tools import TOOLS, execute_tool


class FakeResponses:
    def __init__(self, output_text):
        self.output_text = output_text
        self.calls = []

    def create(self, **kwargs):
        self.calls.append(kwargs)
        return SimpleNamespace(output_text=self.output_text)


class FakeClient:
    def __init__(self, output_text):
        self.responses = FakeResponses(output_text)


class PropositionToolsTest(unittest.TestCase):
    def test_tools_are_registered(self):
        tool_names = {tool['name'] for tool in TOOLS}
        self.assertIn('synthesize_kyc_new_information', tool_names)
        self.assertIn('propose_banking_actions', tool_names)

    def test_synthesis_calls_foundry_and_returns_json(self):
        fake_client = FakeClient('{"new_information": [], "contact_priority": "High", "missing_information": []}')
        result = execute_tool(
            'synthesize_kyc_new_information',
            json.dumps({'kyc_delta': {'analysis': {'new_information': []}}}),
            llm_client=fake_client,
            deployment_name='test-deployment',
        )

        self.assertEqual(json.loads(result)['new_information'], [])
        self.assertEqual(fake_client.responses.calls[0]['model'], 'test-deployment')

    def test_action_tool_accepts_future_knowledge_base(self):
        fake_client = FakeClient('{"actions": [], "vigilance_points": [], "limitations": []}')
        result = execute_tool(
            'propose_banking_actions',
            json.dumps({
                'kyc_delta': {'analysis': {'new_information': []}},
                'new_information_summary': {'new_information': []},
                'knowledge_base': {'services': ['example service']},
            }),
            llm_client=fake_client,
            deployment_name='test-deployment',
        )

        self.assertEqual(json.loads(result)['actions'], [])
        payload = json.loads(fake_client.responses.calls[0]['input'])
        self.assertEqual(payload['knowledge_base']['services'], ['example service'])
        self.assertEqual(payload['knowledge_base_status'], 'caller_provided')
        instructions = fake_client.responses.calls[0]['instructions']
        self.assertIn('environ 70 %', instructions)
        self.assertIn('PRIV', instructions)
        self.assertIn('CORPORATE_MA', instructions)
        self.assertIn('IP', instructions)
        self.assertIn('IM', instructions)
        self.assertIn('CREDIT', instructions)
        self.assertIn('RETAIL_BANKING', instructions)
        self.assertIn('strictement nécessaire', instructions)
        self.assertIn('au maximum trois éléments', instructions)
        self.assertIn('HIÉRARCHIE DE RESTITUTION', instructions)
        self.assertIn('Une identité à confirmer ne', instructions)
        self.assertIn('PÉRIMÈTRE STRICT DE `business_proposals`', instructions)
        self.assertIn('Il est', instructions)
        self.assertIn('strictement interdit', instructions)

    def test_action_tool_retrieves_local_knowledge_base(self):
        fake_client = FakeClient('{"business_proposals": [], "vigilance_points": []}')
        execute_tool(
            'propose_banking_actions',
            json.dumps({
                'kyc_delta': {
                    'analysis': {
                        'new_information': [{
                            'description': 'Liquidités à réinvestir après une cession',
                            'is_new': True,
                        }],
                        'opportunities': [{
                            'description': 'Allocation et gestion de portefeuille',
                        }],
                    },
                },
                'new_information_summary': {
                    'new_information': [{
                        'summary': 'Liquidités à réinvestir après une cession',
                    }],
                },
            }),
            llm_client=fake_client,
            deployment_name='test-deployment',
        )

        payload = json.loads(fake_client.responses.calls[0]['input'])
        knowledge_base = payload['knowledge_base']
        self.assertEqual(payload['knowledge_base_status'], 'local_retrieved')
        self.assertGreater(knowledge_base['entry_count'], 0)
        self.assertLessEqual(knowledge_base['entry_count'], 15)
        self.assertIn('kb_entry_id', knowledge_base['entries'][0])
        self.assertIn('source_file', knowledge_base['entries'][0])

    def test_action_tool_requires_synthesis_first(self):
        fake_client = FakeClient('{"business_proposals": []}')

        with self.assertRaisesRegex(ValueError, 'new_information_summary'):
            execute_tool(
                'propose_banking_actions',
                json.dumps({'kyc_delta': {'analysis': {}}}),
                llm_client=fake_client,
                deployment_name='test-deployment',
            )

    def test_flexible_delta_accepts_explicit_database_changes(self):
        fake_client = FakeClient('{"new_information": [], "database_factual_changes": []}')
        result = execute_tool(
            'synthesize_kyc_new_information',
            json.dumps({
                'kyc_delta': {
                    'database_changes': [{
                        'field': 'legal_form',
                        'old_value': 'SARL',
                        'new_value': 'SAS',
                    }],
                },
            }),
            llm_client=fake_client,
            deployment_name='test-deployment',
        )

        self.assertIn('database_factual_changes', json.loads(result))

    def test_current_kyc_output_contract_is_supported(self):
        fake_client = FakeClient(
            '{"new_information": [], "database_factual_changes": [], '
            '"contact_priority": "High"}'
        )
        result = execute_tool(
            'synthesize_kyc_new_information',
            json.dumps({
                'kyc_delta': {
                    'client_name': 'DOMAINE DE CHEZELLES',
                    'analysis': {
                        'summary': 'Une divergence doit etre verifiee.',
                        'kyc_deltas': [{
                            'field': 'forme_juridique',
                            'internal_value': 'EI',
                            'external_value': 'SASU',
                            'severity': 'high',
                        }],
                        'kyc_alert': {
                            'should_review': True,
                            'priority': 'high',
                        },
                    },
                },
            }),
            llm_client=fake_client,
            deployment_name='test-deployment',
        )

        self.assertEqual(json.loads(result)['contact_priority'], 'High')
        instructions = fake_client.responses.calls[0]['instructions']
        self.assertIn('analysis.kyc_deltas', instructions)
        self.assertIn('analysis.kyc_alert', instructions)

    def test_knowledge_retrieval_is_bounded(self):
        result = retrieve_relevant_knowledge({
            'analysis': {
                'new_information': [{
                    'description': 'Besoin de gestion de portefeuille et allocation',
                }],
            },
        })

        self.assertEqual(result['status'], 'local_retrieved')
        self.assertLessEqual(result['entry_count'], 15)


if __name__ == '__main__':
    unittest.main()
