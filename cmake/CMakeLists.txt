cmake_minimum_required(VERSION 3.8)
project(cmake CXX)

set(CMAKE_CXX_STANDARD 14)

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

install (TARGETS cmake DESTINATION .)