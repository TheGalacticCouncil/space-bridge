#include "BroadcastEventReceiver.h"
#include "includes/asio.hpp"
#include "includes/nlohmann/json.hpp"
#include <iostream>
#include <thread>
#include <memory>
#include <atomic>

using asio::ip::udp;
using json = nlohmann::json;

const int BUFFER_SIZE = 512;

BroadcastEventReceiver::BroadcastEventReceiver(std::string eventToListen) :
    _bufferVector(BUFFER_SIZE, 0), _eventToListen(eventToListen)
{
	// TODO: Make sure that we use only one io_context in the program!!!
	_io_context = std::make_shared<asio::io_context>();

	// TODO: Get rid of hard-coded port
	_socket = std::make_unique<udp::socket>(*_io_context, udp::endpoint(udp::v4(), 41114));

    // Add task to context for receiving data
	_receiveData();
}

BroadcastEventReceiver::~BroadcastEventReceiver()
{
    // TODO: Ensure that _serverThread is nicely closed
}

void BroadcastEventReceiver::syncStart()
{
	_io_context->run();
}

void BroadcastEventReceiver::asyncStart()
{
	_serverThread = std::thread{ &BroadcastEventReceiver::syncStart, this };
}

void BroadcastEventReceiver::asyncStop()
{
    // TODO: shut down properly. Close socket etc.
}

std::shared_ptr<json> BroadcastEventReceiver::getEvent()
{
    return std::atomic_load(&_parsedEvent);
}

void BroadcastEventReceiver::_receiveData()
{
	_socket->async_receive(
		asio::buffer(_bufferVector),
		[this](std::error_code ec, std::size_t bytes_recvd)
		{
			if (!ec && bytes_recvd > 0)
			{
                std::string string(_bufferVector.begin(), _bufferVector.begin() + bytes_recvd);

				//std::cout << "Event oujee!\n" << string << "\nBytes received:\t" << bytes_recvd << "\n";

                //json event;
                
                try {
                    //event = string;
                    //std::cout << event.dump(4) << "\n";

                    std::shared_ptr<json> processedEvent = std::make_shared<json>(json::parse(string));
                    //std::cout << processedEvent->dump(4) << std::endl;

                    if ((*processedEvent)["event"] == _eventToListen)
                        //_parsedEvent = processedEvent;
                        std::atomic_store(&_parsedEvent, processedEvent);
                }
                catch (json::parse_error & ex) {
                    std::cout << "Error while parsing received event!\n"
                        << "message: " << ex.what() << "\n"
                        << "expection id: " << ex.id << "\n"
                        << "byte position of error: " << ex.byte << std::endl;
                }

                // Add new receive job to queue
				_receiveData();
			}
			else {
				std::cout << "Nou gou\n";
			}
		}
	);
}
