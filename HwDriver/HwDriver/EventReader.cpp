#include "EventReader.h"
#include "IEventReceiver.h"
#include "includes/nlohmann/json.hpp"
#include "NetworkManager.h"
#include <memory>

using json = nlohmann::json;

EventReader::EventReader(std::shared_ptr<NetworkManager> networkManager, std::string eventName, unsigned minValue, unsigned maxValue) :
    _minValue(minValue), _maxValue(maxValue), _eventName(eventName), _eventReceiver(networkManager->getEventReceiver())
{
    _eventReceiver->addEventToListen(_eventName);
}

unsigned EventReader::readCurrentValue()
{
    std::shared_ptr<json> eventJson = _eventReceiver->getLatestEvent(_eventName);

    if (eventJson == nullptr)
        return 0; // TODO: Should we throw instead?

    return (*eventJson)["payload"]["value"];
}

EventReader::~EventReader() = default;

std::string EventReader::getEventName()
{
    return _eventName;
}
