#include "ProgramOptions.h"
#include "includes//CLI11.hpp"

ProgramOptions::ProgramOptions()
{
    _app = std::make_unique<CLI::App>("C.C.C.P. - Capacitive Cruncher C++ Program");

    _app->add_option("-m,--motor-pins", pwmPins, "List of pins to use for motor control. Two pins per motor must be given.")->required()->expected(-2);
    _app->add_option("-p,--position-pins", positionPins, "List of pins to use for motor position detection. One pin per motor must be given")->required();
}

int ProgramOptions::parse(int argumentCount, char* argumentVector[])
{
    try {
        _app->parse(argumentCount, argumentVector);
    }
    catch (const CLI::ParseError & e) {
        return _app->exit(e);
    }

    // Validate that config as whole makes sense

    // There must be exactly one position per two motor pins
    if (pwmPins.size() / 2 != positionPins.size())
        return 1001;

    return 0;
}

ProgramOptions::~ProgramOptions() = default;