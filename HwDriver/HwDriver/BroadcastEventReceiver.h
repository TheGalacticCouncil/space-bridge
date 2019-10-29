#pragma once

// DEPRECATED!!!

#define ASIO_STANDALONE
#include "includes/asio.hpp"
#include "includes/nlohmann/json.hpp"
#include <memory>
#include <thread>
#include <vector>
#include <atomic>

class NetworkManager;

using json = nlohmann::json;

//namespace nlohmann {
//    class json;
//}

class BroadcastEventReceiver
{
public:
    BroadcastEventReceiver(std::shared_ptr<NetworkManager> networkManager, std::string eventToListen = "ANALOG_POSITION");
    ~BroadcastEventReceiver();

	void syncStart();
	void asyncStart();
    void asyncStop();

    std::shared_ptr<json> getEvent();

private:
	void _receiveData();

    // Asio io_context. To be figured out whether it belongs here or not :D
	std::shared_ptr<asio::io_context> _io_context;
    // Thread for listening for the incoming events
	std::thread _serverThread;
	std::unique_ptr<asio::ip::udp::udp::socket> _socket;

    // Receive buffer
    std::vector<char> _bufferVector;

    std::shared_ptr<json> _parsedEvent;

    std::string _eventToListen;
};

