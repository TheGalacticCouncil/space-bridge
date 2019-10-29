#pragma once

#include "IEventReceiver.h"

#define ASIO_STANDALONE

#include "includes/asio.hpp"
#include "nlohmann/json_fwd.hpp"

#include <memory>
#include <thread>
#include <vector>
#include <set>
#include <mutex>
#include <map>

class UdpEventReceiver :
    public IEventReceiver
{
public:
    UdpEventReceiver(std::shared_ptr<asio::io_context> ioContext);
    ~UdpEventReceiver();

    void addEventToListen(std::string eventName);
    std::shared_ptr<nlohmann::json> getLatestEvent(std::string eventName);

    void asyncStart();
    void asyncStop();

    // Should not be called by outsiders. TODO: Check if this can be made private!
    void syncStart();

private:
    void _receiveData();

    // Whether receiving has started. Very hacky way to ensure thread safety :(
    bool _running;

    std::shared_ptr<asio::io_context> _ioContext;

    // Thread for listening for the events
    std::thread _serverThread;
    std::unique_ptr<asio::ip::udp::udp::socket> _socket;

    // Receive buffer
    std::vector<char> _bufferVector;

    // Set of events to listen for
    std::set<std::string> _eventsToListen;

    // Received event are stored in <eventName, event> map
    std::mutex _mu;
    std::map<std::string, std::shared_ptr<nlohmann::json>> _receivedEvents;
};

