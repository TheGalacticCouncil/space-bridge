package pigpio

import (
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net"
	"sync"
)

type GpioMode int

const (
	INPUT  GpioMode = 0
	OUTPUT GpioMode = 1
	ALT0   GpioMode = 4
	ALT1   GpioMode = 5
	ALT2   GpioMode = 6
	ALT3   GpioMode = 7
	ALT4   GpioMode = 3
	ALT5   GpioMode = 2
)

type PigpioCommand int

const (
	PI_CMD_MODES = 0
	PI_CMD_MODEG = 1
	PI_CMD_PUD   = 2
	PI_CMD_READ  = 3
	PI_CMD_WRITE = 4
	PI_CMD_PWM   = 5
	PI_CMD_PRS   = 6
	PI_CMD_PFS   = 7
	PI_CMD_SERVO = 8
	PI_CMD_WDOG  = 9
	PI_CMD_BR1   = 10
	PI_CMD_BR2   = 11
	PI_CMD_BC1   = 12
	PI_CMD_BC2   = 13
	PI_CMD_BS1   = 14
	PI_CMD_BS2   = 15
	PI_CMD_TICK  = 16
	PI_CMD_HWVER = 17
	PI_CMD_NO    = 18
	PI_CMD_NB    = 19
	PI_CMD_NP    = 20
	PI_CMD_NC    = 21
	PI_CMD_PRG   = 22
	PI_CMD_PFG   = 23
	PI_CMD_PRRG  = 24
	PI_CMD_HELP  = 25
	PI_CMD_PIGPV = 26
	PI_CMD_WVCLR = 27
	PI_CMD_WVAG  = 28
	PI_CMD_WVAS  = 29
	PI_CMD_WVGO  = 30
	PI_CMD_WVGOR = 31
	PI_CMD_WVBSY = 32
	PI_CMD_WVHLT = 33
	PI_CMD_WVSM  = 34
	PI_CMD_WVSP  = 35
	PI_CMD_WVSC  = 36
	PI_CMD_TRIG  = 37
	PI_CMD_PROC  = 38
	PI_CMD_PROCD = 39
	PI_CMD_PROCR = 40
	PI_CMD_PROCS = 41
	PI_CMD_SLRO  = 42
	PI_CMD_SLR   = 43
	PI_CMD_SLRC  = 44
	PI_CMD_PROCP = 45
	PI_CMD_MICRO = 46
	PI_CMD_MILLI = 47
	PI_CMD_PARSE = 48
	PI_CMD_WVCRE = 49
	PI_CMD_WVDEL = 50
	PI_CMD_WVTX  = 51
	PI_CMD_WVTXR = 52
	PI_CMD_WVNEW = 53
	PI_CMD_I2CO  = 54
	PI_CMD_I2CC  = 55
	PI_CMD_I2CRD = 56
	PI_CMD_I2CWD = 57
	PI_CMD_I2CWQ = 58
	PI_CMD_I2CRS = 59
	PI_CMD_I2CWS = 60
	PI_CMD_I2CRB = 61
	PI_CMD_I2CWB = 62
	PI_CMD_I2CRW = 63
	PI_CMD_I2CWW = 64
	PI_CMD_I2CRK = 65
	PI_CMD_I2CWK = 66
	PI_CMD_I2CRI = 67
	PI_CMD_I2CWI = 68
	PI_CMD_I2CPC = 69
	PI_CMD_I2CPK = 70
	PI_CMD_SPIO  = 71
	PI_CMD_SPIC  = 72
	PI_CMD_SPIR  = 73
	PI_CMD_SPIW  = 74
	PI_CMD_SPIX  = 75
	PI_CMD_SERO  = 76
	PI_CMD_SERC  = 77
	PI_CMD_SERRB = 78
	PI_CMD_SERWB = 79
	PI_CMD_SERR  = 80
	PI_CMD_SERW  = 81
	PI_CMD_SERDA = 82
	PI_CMD_GDC   = 83
	PI_CMD_GPW   = 84
	PI_CMD_HC    = 85
	PI_CMD_HP    = 86
	PI_CMD_CF1   = 87
	PI_CMD_CF2   = 88
	PI_CMD_NOIB  = 99
	PI_CMD_BI2CC = 89
	PI_CMD_BI2CO = 90
	PI_CMD_BI2CZ = 91
	PI_CMD_I2CZ  = 92
	PI_CMD_WVCHA = 93
	PI_CMD_SLRI  = 94
	PI_CMD_CGI   = 95
	PI_CMD_CSI   = 96
	PI_CMD_FG    = 97
	PI_CMD_FN    = 98
	PI_CMD_WVTXM = 100
	PI_CMD_WVTAT = 101
	PI_CMD_PADS  = 102
	PI_CMD_PADG  = 103
	PI_CMD_FO    = 104
	PI_CMD_FC    = 105
	PI_CMD_FR    = 106
	PI_CMD_FW    = 107
	PI_CMD_FS    = 108
	PI_CMD_FL    = 109
	PI_CMD_SHELL = 110
	PI_CMD_BSPIC = 111
	PI_CMD_BSPIO = 112
	PI_CMD_BSPIX = 113
	PI_CMD_BSCX  = 114
	PI_CMD_EVM   = 115
	PI_CMD_EVT   = 116
	PI_CMD_PROCU = 117
	PI_CMD_WVCAP = 118
)

type PigpioError int

const (
	_PI_INIT_FAILED      = -1
	PI_BAD_USER_GPIO     = -2
	PI_BAD_GPIO          = -3
	PI_BAD_MODE          = -4
	PI_BAD_LEVEL         = -5
	PI_BAD_PUD           = -6
	PI_BAD_PULSEWIDTH    = -7
	PI_BAD_DUTYCYCLE     = -8
	_PI_BAD_TIMER        = -9
	_PI_BAD_MS           = -10
	_PI_BAD_TIMETYPE     = -11
	_PI_BAD_SECONDS      = -12
	_PI_BAD_MICROS       = -13
	_PI_TIMER_FAILED     = -14
	PI_BAD_WDOG_TIMEOUT  = -15
	_PI_NO_ALERT_FUNC    = -16
	_PI_BAD_CLK_PERIPH   = -17
	_PI_BAD_CLK_SOURCE   = -18
	_PI_BAD_CLK_MICROS   = -19
	_PI_BAD_BUF_MILLIS   = -20
	PI_BAD_DUTYRANGE     = -21
	_PI_BAD_SIGNUM       = -22
	_PI_BAD_PATHNAME     = -23
	PI_NO_HANDLE         = -24
	PI_BAD_HANDLE        = -25
	_PI_BAD_IF_FLAGS     = -26
	_PI_BAD_CHANNEL      = -27
	_PI_BAD_PRIM_CHANNEL = -27
	_PI_BAD_SOCKET_PORT  = -28
	_PI_BAD_FIFO_COMMAND = -29
	_PI_BAD_SECO_CHANNEL = -30
	_PI_NOT_INITIALISED  = -31
	_PI_INITIALISED      = -32
	_PI_BAD_WAVE_MODE    = -33
	_PI_BAD_CFG_INTERNAL = -34
	PI_BAD_WAVE_BAUD     = -35
	PI_TOO_MANY_PULSES   = -36
	PI_TOO_MANY_CHARS    = -37
	PI_NOT_SERIAL_GPIO   = -38
	_PI_BAD_SERIAL_STRUC = -39
	_PI_BAD_SERIAL_BUF   = -40
	PI_NOT_PERMITTED     = -41
	PI_SOME_PERMITTED    = -42
	PI_BAD_WVSC_COMMND   = -43
	PI_BAD_WVSM_COMMND   = -44
	PI_BAD_WVSP_COMMND   = -45
	PI_BAD_PULSELEN      = -46
	PI_BAD_SCRIPT        = -47
	PI_BAD_SCRIPT_ID     = -48
	PI_BAD_SER_OFFSET    = -49
	PI_GPIO_IN_USE       = -50
	PI_BAD_SERIAL_COUNT  = -51
	PI_BAD_PARAM_NUM     = -52
	PI_DUP_TAG           = -53
	PI_TOO_MANY_TAGS     = -54
	PI_BAD_SCRIPT_CMD    = -55
	PI_BAD_VAR_NUM       = -56
	PI_NO_SCRIPT_ROOM    = -57
	PI_NO_MEMORY         = -58
	PI_SOCK_READ_FAILED  = -59
	PI_SOCK_WRIT_FAILED  = -60
	PI_TOO_MANY_PARAM    = -61
	PI_SCRIPT_NOT_READY  = -62
	PI_BAD_TAG           = -63
	PI_BAD_MICS_DELAY    = -64
	PI_BAD_MILS_DELAY    = -65
	PI_BAD_WAVE_ID       = -66
	PI_TOO_MANY_CBS      = -67
	PI_TOO_MANY_OOL      = -68
	PI_EMPTY_WAVEFORM    = -69
	PI_NO_WAVEFORM_ID    = -70
	PI_I2C_OPEN_FAILED   = -71
	PI_SER_OPEN_FAILED   = -72
	PI_SPI_OPEN_FAILED   = -73
	PI_BAD_I2C_BUS       = -74
	PI_BAD_I2C_ADDR      = -75
	PI_BAD_SPI_CHANNEL   = -76
	PI_BAD_FLAGS         = -77
	PI_BAD_SPI_SPEED     = -78
	PI_BAD_SER_DEVICE    = -79
	PI_BAD_SER_SPEED     = -80
	PI_BAD_PARAM         = -81
	PI_I2C_WRITE_FAILED  = -82
	PI_I2C_READ_FAILED   = -83
	PI_BAD_SPI_COUNT     = -84
	PI_SER_WRITE_FAILED  = -85
	PI_SER_READ_FAILED   = -86
	PI_SER_READ_NO_DATA  = -87
	PI_UNKNOWN_COMMAND   = -88
	PI_SPI_XFER_FAILED   = -89
	_PI_BAD_POINTER      = -90
	PI_NO_AUX_SPI        = -91
	PI_NOT_PWM_GPIO      = -92
	PI_NOT_SERVO_GPIO    = -93
	PI_NOT_HCLK_GPIO     = -94
	PI_NOT_HPWM_GPIO     = -95
	PI_BAD_HPWM_FREQ     = -96
	PI_BAD_HPWM_DUTY     = -97
	PI_BAD_HCLK_FREQ     = -98
	PI_BAD_HCLK_PASS     = -99
	PI_HPWM_ILLEGAL      = -100
	PI_BAD_DATABITS      = -101
	PI_BAD_STOPBITS      = -102
	PI_MSG_TOOBIG        = -103
	PI_BAD_MALLOC_MODE   = -104
	_PI_TOO_MANY_SEGS    = -105
	_PI_BAD_I2C_SEG      = -106
	PI_BAD_SMBUS_CMD     = -107
	PI_NOT_I2C_GPIO      = -108
	PI_BAD_I2C_WLEN      = -109
	PI_BAD_I2C_RLEN      = -110
	PI_BAD_I2C_CMD       = -111
	PI_BAD_I2C_BAUD      = -112
	PI_CHAIN_LOOP_CNT    = -113
	PI_BAD_CHAIN_LOOP    = -114
	PI_CHAIN_COUNTER     = -115
	PI_BAD_CHAIN_CMD     = -116
	PI_BAD_CHAIN_DELAY   = -117
	PI_CHAIN_NESTING     = -118
	PI_CHAIN_TOO_BIG     = -119
	PI_DEPRECATED        = -120
	PI_BAD_SER_INVERT    = -121
	_PI_BAD_EDGE         = -122
	_PI_BAD_ISR_INIT     = -123
	PI_BAD_FOREVER       = -124
	PI_BAD_FILTER        = -125
	PI_BAD_PAD           = -126
	PI_BAD_STRENGTH      = -127
	PI_FIL_OPEN_FAILED   = -128
	PI_BAD_FILE_MODE     = -129
	PI_BAD_FILE_FLAG     = -130
	PI_BAD_FILE_READ     = -131
	PI_BAD_FILE_WRITE    = -132
	PI_FILE_NOT_ROPEN    = -133
	PI_FILE_NOT_WOPEN    = -134
	PI_BAD_FILE_SEEK     = -135
	PI_NO_FILE_MATCH     = -136
	PI_NO_FILE_ACCESS    = -137
	PI_FILE_IS_A_DIR     = -138
	PI_BAD_SHELL_STATUS  = -139
	PI_BAD_SCRIPT_NAME   = -140
	PI_BAD_SPI_BAUD      = -141
	PI_NOT_SPI_GPIO      = -142
	PI_BAD_EVENT_ID      = -143
	PI_CMD_INTERRUPTED   = -144
	PI_NOT_ON_BCM2711    = -145
	PI_ONLY_ON_BCM2711   = -146
)

type PigpioErrorStringMap map[PigpioError]string

var PigpioErrorStrings = PigpioErrorStringMap{
	_PI_INIT_FAILED:      "pigpio initialisation failed",
	PI_BAD_USER_GPIO:     "GPIO not 0-31",
	PI_BAD_GPIO:          "GPIO not 0-53",
	PI_BAD_MODE:          "mode not 0-7",
	PI_BAD_LEVEL:         "level not 0-1",
	PI_BAD_PUD:           "pud not 0-2",
	PI_BAD_PULSEWIDTH:    "pulsewidth not 0 or 500-2500",
	PI_BAD_DUTYCYCLE:     "dutycycle not 0-range (default 255)",
	_PI_BAD_TIMER:        "timer not 0-9",
	_PI_BAD_MS:           "ms not 10-60000",
	_PI_BAD_TIMETYPE:     "timetype not 0-1",
	_PI_BAD_SECONDS:      "seconds < 0",
	_PI_BAD_MICROS:       "micros not 0-999999",
	_PI_TIMER_FAILED:     "gpioSetTimerFunc failed",
	PI_BAD_WDOG_TIMEOUT:  "timeout not 0-60000",
	_PI_NO_ALERT_FUNC:    "DEPRECATED",
	_PI_BAD_CLK_PERIPH:   "clock peripheral not 0-1",
	_PI_BAD_CLK_SOURCE:   "DEPRECATED",
	_PI_BAD_CLK_MICROS:   "clock micros not 1, 2, 4, 5, 8, or 10",
	_PI_BAD_BUF_MILLIS:   "buf millis not 100-10000",
	PI_BAD_DUTYRANGE:     "dutycycle range not 25-40000",
	_PI_BAD_SIGNUM:       "signum not 0-63",
	_PI_BAD_PATHNAME:     "can't open pathname",
	PI_NO_HANDLE:         "no handle available",
	PI_BAD_HANDLE:        "unknown handle",
	_PI_BAD_IF_FLAGS:     "ifFlags > 4",
	_PI_BAD_CHANNEL:      "DMA channel not 0-14",
	_PI_BAD_SOCKET_PORT:  "socket port not 1024-30000",
	_PI_BAD_FIFO_COMMAND: "unknown fifo command",
	_PI_BAD_SECO_CHANNEL: "DMA secondary channel not 0-14",
	_PI_NOT_INITIALISED:  "function called before gpioInitialise",
	_PI_INITIALISED:      "function called after gpioInitialise",
	_PI_BAD_WAVE_MODE:    "waveform mode not 0-1",
	_PI_BAD_CFG_INTERNAL: "bad parameter in gpioCfgInternals call",
	PI_BAD_WAVE_BAUD:     "baud rate not 50-250000(RX)/1000000(TX)",
	PI_TOO_MANY_PULSES:   "waveform has too many pulses",
	PI_TOO_MANY_CHARS:    "waveform has too many chars",
	PI_NOT_SERIAL_GPIO:   "no bit bang serial read in progress on GPIO",
	PI_NOT_PERMITTED:     "no permission to update GPIO",
	PI_SOME_PERMITTED:    "no permission to update one or more GPIO",
	PI_BAD_WVSC_COMMND:   "bad WVSC subcommand",
	PI_BAD_WVSM_COMMND:   "bad WVSM subcommand",
	PI_BAD_WVSP_COMMND:   "bad WVSP subcommand",
	PI_BAD_PULSELEN:      "trigger pulse length not 1-100",
	PI_BAD_SCRIPT:        "invalid script",
	PI_BAD_SCRIPT_ID:     "unknown script id",
	PI_BAD_SER_OFFSET:    "add serial data offset > 30 minute",
	PI_GPIO_IN_USE:       "GPIO already in use",
	PI_BAD_SERIAL_COUNT:  "must read at least a byte at a time",
	PI_BAD_PARAM_NUM:     "script parameter id not 0-9",
	PI_DUP_TAG:           "script has duplicate tag",
	PI_TOO_MANY_TAGS:     "script has too many tags",
	PI_BAD_SCRIPT_CMD:    "illegal script command",
	PI_BAD_VAR_NUM:       "script variable id not 0-149",
	PI_NO_SCRIPT_ROOM:    "no more room for scripts",
	PI_NO_MEMORY:         "can't allocate temporary memory",
	PI_SOCK_READ_FAILED:  "socket read failed",
	PI_SOCK_WRIT_FAILED:  "socket write failed",
	PI_TOO_MANY_PARAM:    "too many script parameters (> 10)",
	PI_SCRIPT_NOT_READY:  "script initialising",
	PI_BAD_TAG:           "script has unresolved tag",
	PI_BAD_MICS_DELAY:    "bad MICS delay (too large)",
	PI_BAD_MILS_DELAY:    "bad MILS delay (too large)",
	PI_BAD_WAVE_ID:       "non existent wave id",
	PI_TOO_MANY_CBS:      "No more CBs for waveform",
	PI_TOO_MANY_OOL:      "No more OOL for waveform",
	PI_EMPTY_WAVEFORM:    "attempt to create an empty waveform",
	PI_NO_WAVEFORM_ID:    "No more waveform ids",
	PI_I2C_OPEN_FAILED:   "can't open I2C device",
	PI_SER_OPEN_FAILED:   "can't open serial device",
	PI_SPI_OPEN_FAILED:   "can't open SPI device",
	PI_BAD_I2C_BUS:       "bad I2C bus",
	PI_BAD_I2C_ADDR:      "bad I2C address",
	PI_BAD_SPI_CHANNEL:   "bad SPI channel",
	PI_BAD_FLAGS:         "bad i2c/spi/ser open flags",
	PI_BAD_SPI_SPEED:     "bad SPI speed",
	PI_BAD_SER_DEVICE:    "bad serial device name",
	PI_BAD_SER_SPEED:     "bad serial baud rate",
	PI_BAD_PARAM:         "bad i2c/spi/ser parameter",
	PI_I2C_WRITE_FAILED:  "I2C write failed",
	PI_I2C_READ_FAILED:   "I2C read failed",
	PI_BAD_SPI_COUNT:     "bad SPI count",
	PI_SER_WRITE_FAILED:  "ser write failed",
	PI_SER_READ_FAILED:   "ser read failed",
	PI_SER_READ_NO_DATA:  "ser read no data available",
	PI_UNKNOWN_COMMAND:   "unknown command",
	PI_SPI_XFER_FAILED:   "SPI xfer/read/write failed",
	_PI_BAD_POINTER:      "bad (NULL) pointer",
	PI_NO_AUX_SPI:        "no auxiliary SPI on Pi A or B",
	PI_NOT_PWM_GPIO:      "GPIO is not in use for PWM",
	PI_NOT_SERVO_GPIO:    "GPIO is not in use for servo pulses",
	PI_NOT_HCLK_GPIO:     "GPIO has no hardware clock",
	PI_NOT_HPWM_GPIO:     "GPIO has no hardware PWM",
	PI_BAD_HPWM_FREQ:     "invalid hardware PWM frequency",
	PI_BAD_HPWM_DUTY:     "hardware PWM dutycycle not 0-1M",
	PI_BAD_HCLK_FREQ:     "invalid hardware clock frequency",
	PI_BAD_HCLK_PASS:     "need password to use hardware clock 1",
	PI_HPWM_ILLEGAL:      "illegal, PWM in use for main clock",
	PI_BAD_DATABITS:      "serial data bits not 1-32",
	PI_BAD_STOPBITS:      "serial (half) stop bits not 2-8",
	PI_MSG_TOOBIG:        "socket/pipe message too big",
	PI_BAD_MALLOC_MODE:   "bad memory allocation mode",
	_PI_TOO_MANY_SEGS:    "too many I2C transaction segments",
	_PI_BAD_I2C_SEG:      "an I2C transaction segment failed",
	PI_BAD_SMBUS_CMD:     "SMBus command not supported",
	PI_NOT_I2C_GPIO:      "no bit bang I2C in progress on GPIO",
	PI_BAD_I2C_WLEN:      "bad I2C write length",
	PI_BAD_I2C_RLEN:      "bad I2C read length",
	PI_BAD_I2C_CMD:       "bad I2C command",
	PI_BAD_I2C_BAUD:      "bad I2C baud rate, not 50-500k",
	PI_CHAIN_LOOP_CNT:    "bad chain loop count",
	PI_BAD_CHAIN_LOOP:    "empty chain loop",
	PI_CHAIN_COUNTER:     "too many chain counters",
	PI_BAD_CHAIN_CMD:     "bad chain command",
	PI_BAD_CHAIN_DELAY:   "bad chain delay micros",
	PI_CHAIN_NESTING:     "chain counters nested too deeply",
	PI_CHAIN_TOO_BIG:     "chain is too long",
	PI_DEPRECATED:        "deprecated function removed",
	PI_BAD_SER_INVERT:    "bit bang serial invert not 0 or 1",
	_PI_BAD_EDGE:         "bad ISR edge value, not 0-2",
	_PI_BAD_ISR_INIT:     "bad ISR initialisation",
	PI_BAD_FOREVER:       "loop forever must be last chain command",
	PI_BAD_FILTER:        "bad filter parameter",
	PI_BAD_PAD:           "bad pad number",
	PI_BAD_STRENGTH:      "bad pad drive strength",
	PI_FIL_OPEN_FAILED:   "file open failed",
	PI_BAD_FILE_MODE:     "bad file mode",
	PI_BAD_FILE_FLAG:     "bad file flag",
	PI_BAD_FILE_READ:     "bad file read",
	PI_BAD_FILE_WRITE:    "bad file write",
	PI_FILE_NOT_ROPEN:    "file not open for read",
	PI_FILE_NOT_WOPEN:    "file not open for write",
	PI_BAD_FILE_SEEK:     "bad file seek",
	PI_NO_FILE_MATCH:     "no files match pattern",
	PI_NO_FILE_ACCESS:    "no permission to access file",
	PI_FILE_IS_A_DIR:     "file is a directory",
	PI_BAD_SHELL_STATUS:  "bad shell return status",
	PI_BAD_SCRIPT_NAME:   "bad script name",
	PI_BAD_SPI_BAUD:      "bad SPI baud rate, not 50-500k",
	PI_NOT_SPI_GPIO:      "no bit bang SPI in progress on GPIO",
	PI_BAD_EVENT_ID:      "bad event id",
	PI_CMD_INTERRUPTED:   "pigpio command interrupted",
	PI_NOT_ON_BCM2711:    "not available on BCM2711",
	PI_ONLY_ON_BCM2711:   "only available on BCM2711",
}

var (
	ErrInvalidPinNumber     = errors.New(PigpioErrorStrings[PI_BAD_GPIO])
	ErrInvalidUserPinNumber = errors.New(PigpioErrorStrings[PI_BAD_USER_GPIO])
	ErrBadGpioLevel         = errors.New(PigpioErrorStrings[PI_BAD_LEVEL])
	ErrNegativePwmFrequency = errors.New("pwm frequency must be positive")
	ErrBadPwmDutyCycle      = errors.New(PigpioErrorStrings[PI_BAD_DUTYCYCLE])
)

var ErrorCodeToError = map[int]error{
	-1: ErrInvalidPinNumber,
	-5: ErrBadGpioLevel,
	-8: ErrBadPwmDutyCycle,
}

type PigpiodCmdMessage struct {
	Command uint32
	P1      uint32
	P2      uint32
	P3      uint32
}

type PigpiodCmdResponse struct {
	Command uint32
	P1      uint32
	P2      uint32
	Res     int32
}

type Pigpio struct {
	Socket    *net.TCPConn
	Connected bool

	mu sync.Mutex
}

func (p *Pigpio) Close() {
	p.Socket.Close()
	p.Connected = false
}

func (p *Pigpio) SetMode(pin int, mode GpioMode) (int, error) {
	numericMode := int(mode)

	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_MODES, pin, numericMode)

	return CheckPigpiodError(response)
}

// Returns the GPIO level of the specified pin
// The pin parameter should be between 0 and 53.
func (p *Pigpio) Read(pin int) (int, error) {
	// Check if the pin is within the valid range
	if pin < 0 || pin > 53 {
		return 0, ErrInvalidPinNumber
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_READ, pin, 0)

	return CheckPigpiodError(response)
}

// Returns the GPIO level of the specified pin
// The pin parameter should be between 0 and 53.
// The value parameter should be either 0 or 1.
func (p *Pigpio) Write(pin int, value int) (int, error) {
	// Check if the pin is within the valid range
	if pin < 0 || pin > 53 {
		return 0, ErrInvalidPinNumber
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_WRITE, pin, value)

	return CheckPigpiodError(response)
}

// Sets the frequency (in Hz) of the PWM to be used on the GPIO.
// The selectable frequencies depend upon the sample rate which
// may be 1, 2, 4, 5, 8, or 10 microseconds (default 5).  The
// sample rate is set when the pigpio daemon is started. See online documentation for more information.
func (p *Pigpio) SetPwmFrequency(pin int, frequency int) (int, error) {
	// Check if the pin is within the valid range
	if pin < 0 || pin > 31 {
		return 0, ErrInvalidUserPinNumber
	}

	// Check that the PWM frequency is positive (TODO: change the API to use unsigned data type)
	if frequency < 0 {
		return 0, ErrNegativePwmFrequency
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_PFS, pin, frequency)

	return CheckPigpiodError(response)
}

func (p *Pigpio) SetPwmDutyCycle(pin int, dutyCycle int) (int, error) {
	// Check if pin is within valid range (physical pins only)
	if pin < 0 || pin > 31 {
		return 0, ErrInvalidUserPinNumber
	}

	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_PWM, pin, dutyCycle)

	return CheckPigpiodError(response)
}

func (p *Pigpio) GetPwmDutyCycle(pin int) (int, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_GDC, pin, 0)

	return CheckPigpiodError(response)
}

func (p *Pigpio) SpiOpen(channel int, baud int, flags []byte) (int, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommandExtended(p.Socket, PI_CMD_SPIO, channel, baud, len(flags), flags)

	return CheckPigpiodError(response)
}

func (p *Pigpio) SpiClose(handle int) (int, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	response := PigpiodCommand(p.Socket, PI_CMD_SPIC, handle, 0)

	return CheckPigpiodError(response)
}

func (p *Pigpio) SpiXfer(handle int, data []byte) (int, []byte, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	rawResponseBytesCount := PigpiodCommandExtended(p.Socket, PI_CMD_SPIX, handle, 0, len(data), data)
	responseBytesCount, err := CheckPigpiodError(rawResponseBytesCount)
	if err != nil {
		panic(err)
	}

	// If we've more than 0 bytes incoming, read those
	if responseBytesCount > 0 {
		responseData := make([]byte, responseBytesCount)

		if _, err := io.ReadFull(p.Socket, responseData); err != nil {
			panic(err)
		}

		return responseBytesCount, responseData, nil
	}

	return responseBytesCount, nil, nil
}

func NewPigpio() *Pigpio {
	genericSocket, err := net.Dial("tcp", "localhost:8888")
	if err != nil {
		panic(err)
	}

	socket := genericSocket.(*net.TCPConn)
	if err := socket.SetNoDelay(true); err != nil {
		panic(err)
	}

	return &Pigpio{
		Socket:    socket,
		Connected: true,
	}
}

func PigpiodCommand(socket *net.TCPConn, command int, p1 int, p2 int) int {
	// Package the command into a byte buffer
	message := PigpiodCmdMessage{
		Command: uint32(command),
		P1:      uint32(p1),
		P2:      uint32(p2),
		P3:      0,
	}

	messageBytes := make([]byte, 16)
	binary.LittleEndian.PutUint32(messageBytes[0:4], message.Command)
	binary.LittleEndian.PutUint32(messageBytes[4:8], message.P1)
	binary.LittleEndian.PutUint32(messageBytes[8:12], message.P2)
	binary.LittleEndian.PutUint32(messageBytes[12:16], message.P3)

	// Send the command to the pigpiod daemon
	_, err := socket.Write(messageBytes)
	if err != nil {
		panic(err)
	}

	// Read the response from the pigpiod daemon
	responseBytes := make([]byte, 16)
	if _, err := io.ReadFull(socket, responseBytes); err != nil {
		panic(err)
	}
	responseMessage := PigpiodCmdResponse{
		Command: binary.LittleEndian.Uint32(responseBytes[0:4]),
		P1:      binary.LittleEndian.Uint32(responseBytes[4:8]),
		P2:      binary.LittleEndian.Uint32(responseBytes[8:12]),
		Res:     int32(binary.LittleEndian.Uint32(responseBytes[12:16])),
	}

	return int(responseMessage.Res)
}

func PigpiodCommandExtended(socket *net.TCPConn, command int, p1 int, p2 int, p3 int, extents []byte) int {
	// Check that p3 matches the length of the extents
	if p3 != len(extents) {
		panic("p3 does not match length of extents")
	}

	messageBytes := make([]byte, 16+len(extents))
	binary.LittleEndian.PutUint32(messageBytes[0:4], uint32(command))
	binary.LittleEndian.PutUint32(messageBytes[4:8], uint32(p1))
	binary.LittleEndian.PutUint32(messageBytes[8:12], uint32(p2))
	binary.LittleEndian.PutUint32(messageBytes[12:16], uint32(p3))
	copy(messageBytes[16:], extents)

	// Send the command to the pigpiod daemon
	_, err := socket.Write(messageBytes)
	if err != nil {
		panic(err)
	}

	// Read the response from the pigpiod daemon
	responseBytes := make([]byte, 16)
	if _, err := io.ReadFull(socket, responseBytes); err != nil {
		panic(err)
	}
	responseMessage := PigpiodCmdResponse{
		Command: binary.LittleEndian.Uint32(responseBytes[0:4]),
		P1:      binary.LittleEndian.Uint32(responseBytes[4:8]),
		P2:      binary.LittleEndian.Uint32(responseBytes[8:12]),
		Res:     int32(binary.LittleEndian.Uint32(responseBytes[12:16])),
	}

	return int(responseMessage.Res)
}

func CheckPigpiodError(value int) (int, error) {

	if value < 0 {
		errorString, ok := PigpioErrorStrings[PigpioError(value)]
		if !ok {
			return 0, fmt.Errorf("pigpiod command failed with unknown error code %d", value)
		}

		// Try to use typed error
		if err, ok := ErrorCodeToError[value]; ok {
			return value, err
		}

		return value, fmt.Errorf("pigpiod command failed with error: %s", errorString)
	}

	return value, nil
}
