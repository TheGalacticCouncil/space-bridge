#include "UdpEventReceiver.h"

#define ASIO_STANDALONE

#include "includes/asio.hpp"
#include "includes/nlohmann/json.hpp"

#include <memory>
#include <atomic>
#include <vector>
#include <iostream>
#include <thread>
#include <exception>
#include <mutex>

using asio::ip::udp;
using json = nlohmann::json;

const int BUFFER_SIZE = 512;

UdpEventReceiver::UdpEventReceiver(std::shared_ptr<asio::io_context> ioContext) :
    _ioContext(ioContext), _running(false), _bufferVector(BUFFER_SIZE, 0)
{
    // TODO: Get rid of hard-coded port
    _socket = std::make_unique<udp::socket>(*_ioContext, udp::endpoint(udp::v4(), 41114));

    // Add task to context for receiving data
    _receiveData();
}

void UdpEventReceiver::asyncStart()
{
    _running = true;
    _serverThread = std::thread{ &UdpEventReceiver::syncStart, this };
}

void UdpEventReceiver::asyncStop()
{
    // TODO: Shut down properly
    _running = false;
}

void UdpEventReceiver::syncStart()
{
    _ioContext->run();
}

void UdpEventReceiver::addEventToListen(std::string eventName)
{
    std::lock_guard<std::mutex> lock(_mu);

    _receivedEvents[eventName] = nullptr;
    _eventsToListen.insert(eventName);
}

std::shared_ptr<json> UdpEventReceiver::getLatestEvent(std::string eventName)
{
    std::lock_guard<std::mutex> lock(_mu);
    
    // Throws an out_of_bounds exception if trying to get event that is not set!
    return _receivedEvents.at(eventName);
}

void UdpEventReceiver::_receiveData()
{
    _socket->async_receive(
        asio::buffer(_bufferVector),
        [this](std::error_code ec, std::size_t bytes_recvd)
        {
            if (!ec && bytes_recvd > 0)
            {
                std::string string(_bufferVector.begin(), _bufferVector.begin() + bytes_recvd);
                std::shared_ptr<json> processedEvent;

                try {
                    processedEvent = std::make_shared<json>(json::parse(string));
                    
                }
                catch (json::parse_error & ex) {
                    std::cout << "Error while parsing received event!\n"
                        << "message: " << ex.what() << "\n"
                        << "expection id: " << ex.id << "\n"
                        << "byte position of error: " << ex.byte << std::endl;
                }

                std::string receivedEventName = (*processedEvent)["event"];

                {
                    std::lock_guard<std::mutex> lock(_mu);

                    if (_eventsToListen.find(receivedEventName) != _eventsToListen.end()) {
                        _receivedEvents[receivedEventName] = processedEvent;
                    }
                }

                // Add new receive job to queue
                _receiveData();
            }
            else {
                std::cout << "Error receiving data or no data received. Aborting.\n";
            }
        }
    );
}

// TODO: Close thread nicely!
UdpEventReceiver::~UdpEventReceiver() = default;


