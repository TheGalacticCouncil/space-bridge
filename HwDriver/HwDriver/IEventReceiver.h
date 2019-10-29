#pragma once
#include "nlohmann/json_fwd.hpp"
#include <string>
#include <memory>

class IEventReceiver
{
public:
    virtual void addEventToListen(std::string eventName) = 0;
    virtual std::shared_ptr<nlohmann::json> getLatestEvent(std::string eventName) = 0;
};

