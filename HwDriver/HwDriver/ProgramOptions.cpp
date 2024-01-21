#include "ProgramOptions.h"
#include "includes//CLI11.hpp"

ProgramOptions::ProgramOptions()
{
    _app = std::make_unique<CLI::App>("C.C.C.P. - Capacitive Cruncher C++ Program");

    _app->add_option("--motor",
        motorOptions,
        "Defines a motor. Takes six unsigned integers."
        "Pos 1: drive enables (non-zero = enabled),"
        "Pos 2: Motor pin 1,"
        "Pos 3: Motor pin 2,"
        "Pos 4: Position MCP SPI channel,"
        "Pos 5: Position MCP pin to read,"
        "Pos 6: Touch MCP SPI channel,"
        "Pos 7: Touch MCP pin to read");
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