"""Offline checks for proposition tool wiring; no Azure credentials required."""

import json
import unittest
from types import SimpleNamespace

from tools import TOOLS, execute_tool


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
                'knowledge_base': {'services': ['example service']},
            }),
            llm_client=fake_client,
            deployment_name='test-deployment',
        )

        self.assertEqual(json.loads(result)['actions'], [])
        payload = json.loads(fake_client.responses.calls[0]['input'])
        self.assertEqual(payload['knowledge_base']['services'], ['example service'])


if __name__ == '__main__':
    unittest.main()
