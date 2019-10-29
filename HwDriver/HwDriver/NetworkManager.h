#pragma once

#include <memory>

namespace asio {
    class io_context;
}

class UdpEventReceiver;
class IEventReceiver;

class NetworkManager
{
public:
    NetworkManager();
    ~NetworkManager();

    void startServers();

    std::shared_ptr<asio::io_context> getIoContext();
    std::shared_ptr<IEventReceiver> getEventReceiver();

private:
    std::shared_ptr<asio::io_context> _ioContext;
    std::shared_ptr<UdpEventReceiver> _eventReceiver;
};

