#define main risk_engine_program_main
#include "../src/risk_engine.cpp"
#undef main
#include <cassert>
#include <iostream>
#include <sstream>

void test_trie_case_insensitive() {
  internguard::Trie trie;
  trie.insert("registration fee");
  auto matches = trie.find_in_text("Pay a REGISTRATION FEE today");
  assert(matches.size() == 1 && matches[0] == "registration fee");
}

void test_trie_multiple_phrases() {
  internguard::Trie trie;
  trie.insert("registration fee");
  trie.insert("guaranteed placement");
  trie.insert("urgent payment");
  auto matches = trie.find_in_text("Pay registration fee for guaranteed placement. Send urgent payment.");
  assert(matches.size() == 3);
}

void test_trie_no_matches() {
  internguard::Trie trie;
  trie.insert("registration fee");
  auto matches = trie.find_in_text("Normal internship with mentoring and stipend");
  assert(matches.empty());
}

void test_binary_search_found() {
  std::vector<std::string> records{"alpha", "beta", "gamma"};
  assert(internguard::binary_search_identifier(records, "beta") == 1);
  assert(internguard::binary_search_identifier(records, "alpha") == 0);
  assert(internguard::binary_search_identifier(records, "gamma") == 2);
}

void test_binary_search_not_found() {
  std::vector<std::string> records{"alpha", "beta", "gamma"};
  assert(internguard::binary_search_identifier(records, "none") == -1);
  assert(internguard::binary_search_identifier(records, "delta") == -1);
}

void test_graph_connected_count() {
  internguard::RelationshipGraph graph;
  graph.connect("company", "domain");
  graph.connect("domain", "email");
  assert(graph.connected_count("company") == 3);
}

void test_graph_disconnected() {
  internguard::RelationshipGraph graph;
  graph.connect("a", "b");
  graph.connect("c", "d");
  assert(graph.connected_count("a") == 2);
  assert(graph.connected_count("c") == 2);
}

void test_graph_empty() {
  internguard::RelationshipGraph graph;
  assert(graph.connected_count("nonexistent") == 0);
}

void test_clamp_boundaries() {
  assert(internguard::clamp(150, 0, 100) == 100);
  assert(internguard::clamp(-10, 0, 100) == 0);
  assert(internguard::clamp(50, 0, 100) == 50);
  assert(internguard::clamp(0, 0, 100) == 0);
  assert(internguard::clamp(100, 0, 100) == 100);
}

void test_json_string_extraction() {
  auto result = internguard::json_string(R"({"name":"TestCorp","website":"https://test.com"})", "name");
  assert(result.has_value());
  assert(result.value() == "TestCorp");
}

void test_json_int_extraction() {
  int count = internguard::json_int(R"({"complaintCount":5})", "complaintCount");
  assert(count == 5);
}

void test_json_bool_extraction() {
  bool match = internguard::json_bool(R"({"companyNameMatch":true})", "companyNameMatch");
  assert(match == true);
  bool nomatch = internguard::json_bool(R"({"companyNameMatch":false})", "companyNameMatch");
  assert(nomatch == false);
}

void test_escape_json() {
  assert(internguard::escape_json("Hello \"world\"") == "Hello \\\"world\\\"");
  assert(internguard::escape_json("back\\slash") == "back\\\\slash");
}

void test_indicator_sorting() {
  std::vector<internguard::Indicator> indicators = {{18, "first"}, {10, "second"}, {25, "third"}};
  std::sort(indicators.begin(), indicators.end(), [](const internguard::Indicator& a, const internguard::Indicator& b) { return a.weight > b.weight; });
  assert(indicators[0].weight == 25);
  assert(indicators[1].weight == 18);
  assert(indicators[2].weight == 10);
}

void test_priority_queue_ordering() {
  std::priority_queue<internguard::Indicator> pq;
  pq.push({10, "low"});
  pq.push({30, "high"});
  pq.push({20, "mid"});
  assert(pq.top().weight == 30);
  pq.pop();
  assert(pq.top().weight == 20);
  pq.pop();
  assert(pq.top().weight == 10);
}

int main() {
  test_trie_case_insensitive();
  test_trie_multiple_phrases();
  test_trie_no_matches();
  test_binary_search_found();
  test_binary_search_not_found();
  test_graph_connected_count();
  test_graph_disconnected();
  test_graph_empty();
  test_clamp_boundaries();
  test_json_string_extraction();
  test_json_int_extraction();
  test_json_bool_extraction();
  test_escape_json();
  test_indicator_sorting();
  test_priority_queue_ordering();
  std::cout << "All 15 tests passed.\n";
  return 0;
}
