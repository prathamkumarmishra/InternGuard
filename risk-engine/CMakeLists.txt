cmake_minimum_required(VERSION 3.16)
project(internguard_risk_engine LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(risk_engine src/risk_engine.cpp)
target_compile_options(risk_engine PRIVATE -Wall -Wextra -Wpedantic)

enable_testing()
add_executable(risk_engine_tests test/risk_engine_tests.cpp)
target_compile_options(risk_engine_tests PRIVATE -Wall -Wextra -Wpedantic)
add_test(NAME risk_engine_tests COMMAND risk_engine_tests)
