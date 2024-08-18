cmake_minimum_required(VERSION 3.8)
project(cmake CXX)

# C++14を使用
set(CMAKE_CXX_STANDARD 14)

# ライブラリを作成
add_compile_definitions(STEAM_API_NODLL)
include_directories(cmake
    ./open-steamworks/OpenSteamworks
    ./open-steamworks/OpenSteamAPI/src
    ./src
)
add_library(cmake
    ./open-steamworks/OpenSteamAPI/src/CCallbackMgr.cpp
    ./open-steamworks/OpenSteamAPI/src/ClientWrap.cpp
    ./open-steamworks/OpenSteamAPI/src/Interface_OSW.cpp
    ./src/SteamStuff.cpp
    ./src/RemotePlayInviteHandler.cpp
    ./src/Library.cpp
)

# テスト用の実行ファイルを作成
add_executable(test ./src/Test.cpp)
target_link_libraries(test cmake)

# macOSの場合はOSXPathHelper.mmを追加
if(APPLE)
    target_sources(cmake PRIVATE ./open-steamworks/OpenSteamAPI/src/OSXPathHelper.mm)
    target_link_libraries(test "-framework Foundation")
endif()

# インストール
install (TARGETS cmake DESTINATION .)