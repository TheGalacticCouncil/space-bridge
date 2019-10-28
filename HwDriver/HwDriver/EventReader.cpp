#include "EventReader.h"
#include "BroadcastEventReceiver.h"
#include "includes/nlohmann/json.hpp"
#include <memory>

using json = nlohmann::json;

EventReader::EventReader(std::string eventName, unsigned minValue, unsigned maxValue) :
    _minValue(minValue), _maxValue(maxValue), _eventReceiver{std::make_unique<BroadcastEventReceiver>(eventName)}
{
    _eventReceiver->asyncStart();
}

unsigned EventReader::readCurrentValue()
{
    std::shared_ptr<json> eventJson = _eventReceiver->getEvent();

    if (eventJson == nullptr)
        return 0; // TODO: Should we throw instead?

    return (*eventJson)["payload"]["value"];
}

EventReader::~EventReader() = default;