#include <iostream>
#include <thread>
#include <Steamworks.h>
#include "Library.h"
#include "SteamStuff.h"

int main()
{
	std::cout << "Initializing SteamStuff..." << std::endl;

	if (!SteamStuff_Init())
	{
		std::cout << "Failed to initialize SteamStuff.dll" << std::endl;
		return 1;
	}

	uint64_t gameId = SteamStuff_GetRunningGameID();
	std::cout << "Hello, World! Game ID: " << gameId << std::endl;

	// Check if the game supports Remote Play Together
	std::cout << "PICO PARK 2(expected=1): " << GClientContext()->AppManager()->BCanRemotePlayTogether(2644470) << std::endl;
	std::cout << "Overcooked! 2(expected=1): "  << GClientContext()->AppManager()->BCanRemotePlayTogether(728880) << std::endl;
	std::cout << "shapez(expected=0): "  << GClientContext()->AppManager()->BCanRemotePlayTogether(1318690) << std::endl;
	std::cout << "Sackboy(expected=0): "  << GClientContext()->AppManager()->BCanRemotePlayTogether(1599660) << std::endl;

	if (!CGameID(uint64(gameId)).IsValid())
	{
		std::cout << "No game running" << std::endl;
		return 1;
	}
	if (!CGameID(uint64(gameId)).IsSteamApp())
	{
		std::cout << "Non-steam game running" << std::endl;
		return 1;
	}

	SteamStuff_SetOnRemoteInvited([](uint64_t invitee, uint64_t guestID, const char* connectURL)
		{
			std::cout << "Invite created for " << invitee << " with URL: " << connectURL << " and guest ID: " << guestID << std::endl;
		});
	SteamStuff_SetOnRemoteStarted([](uint64_t invitee, uint64_t guestID)
		{
			std::cout << "Session started for " << invitee << " with guest ID: " << guestID << std::endl;
		});
	SteamStuff_SetOnRemoteStopped([](uint64_t invitee, uint64_t guestID)
		{
			std::cout << "Session stopped for " << invitee << " with guest ID: " << guestID << std::endl;
		});

	uint64_t guestID = SteamStuff_SendInvite(0, gameId);
	std::cout << "Invite sent with guest ID: " << guestID << std::endl;

	while (true)
	{
		SteamStuff_RunCallbacks();
		std::cout << "Running..." << std::endl;
		std::this_thread::sleep_for(std::chrono::seconds(1));
	}

	// Shutdown the Steam client
	SteamStuff_Shutdown();
}