from setuptools import setup
from Cython.Build import cythonize

setup(
    ext_modules=cythonize([
        "EncoderReader.pyx",
        "inputPoller.pyx",
        "EventMaker.pyx",
    ]),
)
