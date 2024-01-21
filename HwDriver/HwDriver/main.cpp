#include <csignal>
#include <iostream>
#include <pigpio.h>

#include "Core.h"

#define	LED	1 // bcm 17
#define P1 4
#define P2 17 
#define CPIN 25
#define PWM_MAX 50
#define GPIO 25

#define MAX_READING 1000


void signalHandler(int signalNumber) {
    std::cout << "Received signal:\t" << signalNumber << "\n";

    // TODO: Let ioBase destructor handle this
    gpioTerminate();

    exit(signalNumber);
}

// TODO: Move to class/whatever
//int readCapacitivePin(int pinToMeasure) {
//    // Discharge the pin by setting it off
//    gpioWrite(pinToMeasure, PI_OFF);
//    gpioDelay(200); // wait 200 us to let the pin discharge
//
//    // Make the pin an input 
//    gpioSetMode(pinToMeasure, PI_INPUT);
//
//    // Now check how long it takes to actually get pulled up
//    int count = 20;
//
//    // If the pin is being touched, we'll immediately get 1 from gpioRead. Otherwise not as the pin is floating(?)
//    while (count > 0) {
//        if (gpioRead(pinToMeasure))
//            return count;
//
//        count -= 1;
//    }
//
//    return count;
//}

int main(int argc, char* argv[])
{

    // Handle CTRL+C aka SIGINT
    signal(SIGINT, signalHandler);
    
    Core core;

    return core.start(argc, argv);
    
    
    //CLI::App app( "C.C.C.P. - Capacitive Cruncher C++ Program" );

    //int capacitivePin;
    //std::vector<int> pwmPins;
    //app.add_option("-p,--port", capacitivePin, "GPIO port that the capacitive sensor is attached to")->required();
    //app.add_option("-m,--motor-pins", pwmPins, "Requires two GPIO pin numbers that the motor is attached to")->required();

    //CLI11_PARSE(app, argc, argv);

    //std::cout << "This is fine.\n";
    //gpioCfgClock(2, 1, 0); // sample rate(5), device (1), ignored
    //gpioInitialise();

    //gpioSetMode(P1, PI_OUTPUT);
    //gpioSetMode(P2, PI_OUTPUT);

    //gpioPWM(P1, 0);
    //gpioPWM(P2, 0);
    //gpioSetPWMfrequency(P1, 1000000);
    //gpioSetPWMfrequency(P2, 1000000);

    //while (true) {
    //    //for (int i = 0; i < 10; ++i) {
    //    //for (int j = 0; j < 256; j += 5) {
    //    //    gpioPWM(P1, j);
    //    //    gpioSleep(PI_TIME_RELATIVE, 0, 50000);
    //    //}

    //    gpioPWM(P1, 0);
    //    gpioPWM(P2, 255);
    //    gpioSleep(PI_TIME_RELATIVE, 1, 0);

    //    gpioPWM(P1, 255);
    //    gpioPWM(P2, 0);
    //    gpioSleep(PI_TIME_RELATIVE, 1, 0);

    //    gpioPWM(P1, 0);
    //    gpioPWM(P2, 0);
    //    gpioSleep(PI_TIME_RELATIVE, 3, 0);
    //}

    //gpioTerminate();

    //return 0;

    //return 0;

    // OLD STUFF TO REMEMBER BELOW

    //// Handle CTRL+C aka SIGINT
    //signal(SIGINT, signalHandler);

    //gpioCfgClock(2, 1, 0); // sample rate(5), device (1), ignored
    //
    //int code = gpioInitialise();

    //if (code < 0) {
    //	std::cout << "Failed to launch. Error " << code << "\n";
    //
    //	return 1;
    //}

    //gpioSetMode(P1, PI_OUTPUT);
    //gpioSetMode(P2, PI_OUTPUT);

    //gpioPWM(P1, 0);
    //gpioPWM(P2, 0);

    //std::cout << "P1 freq:\t" << gpioGetPWMfrequency(P1) << "\n";
    //std::cout << "P2 freq:\t" << gpioGetPWMfrequency(P2) << "\n";

    //gpioSetPWMfrequency(P1, 1000000);
    //gpioSetPWMfrequency(P2, 1000000);

    //std::cout << "P1 freq:\t" << gpioGetPWMfrequency(P1) << "\n";
    //std::cout << "P2 freq:\t" << gpioGetPWMfrequency(P2) << "\n";

    ////while (true) {
    //////for (int i = 0; i < 10; ++i) {
    ////	for (int j = 0; j < 256; j += 5) {
    ////		gpioPWM(P1, j);
    ////		gpioSleep(PI_TIME_RELATIVE, 0, 50000);
    ////	}

    ////	gpioPWM(P1, 0);
    ////	gpioPWM(P2, 255);
    ////	gpioSleep(PI_TIME_RELATIVE, 0, 400000);

    ////	gpioPWM(P2, 0);
    ////	gpioSleep(PI_TIME_RELATIVE, 0, 500000);
    ////}
    //while (true) {
    //	std::cout << "Capacitive reading:\t" << readCapacitivePin(CPIN) << "\n";
    //	gpioSleep(PI_TIME_RELATIVE, 0, 50000);
    //}

    //gpioTerminate();

    /*ADC mcp;
    int counter = 0;
    unsigned val;
    while (true)
    {
        val = mcp.read(7);
        counter += 1;

        if (counter > 1000) {
            std::cout << "Reading analog value channel 7:\t" << val << "\n";
            counter = 0;
        }

        gpioDelay(100);
    }*/
}

