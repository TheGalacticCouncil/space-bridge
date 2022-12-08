#include <Python.h>
#include <wiringPi.h>

// Global variable to keep track of the encoder position
static int encoder_position = 0;

// Function to be called when the encoder is rotated
void encoder_callback() {
  // Increment or decrement the encoder position depending on the direction of rotation
  if (digitalRead(0) == 0) {
    encoder_position++;
  } else {
    encoder_position--;
  }
}

static PyObject *
encoder_init(PyObject *self, PyObject *args)
{
  // Initialize the wiringPi library and set the encoder pin as an input
  wiringPiSetup();
  pinMode(0, INPUT);

  // Set up an interrupt to call the encoder_callback function when the encoder is rotated
  wiringPiISR(0, INT_EDGE_BOTH, &encoder_callback);

  Py_RETURN_NONE;
}

static PyObject *
encoder_position(PyObject *self, PyObject *args)
{
  // Return the current encoder position
  return Py_BuildValue("i", encoder_position);
}

static PyMethodDef encoder_methods[] = {
  {"init", encoder_init, METH_VARARGS, "Initialize the encoder"},
  {"position", encoder_position, METH_VARARGS, "Get the current encoder position"},
  {NULL, NULL, 0, NULL}
};

static struct PyModuleDef encoder_module = {
  PyModuleDef_HEAD_INIT,
  "encoder",
  "A C++ extension for reading a digital relative encoder",
  -1,
  encoder_methods
};

PyMODINIT_FUNC
PyInit_encoder(void)
{
  return PyModule_Create(&encoder_module);
}
