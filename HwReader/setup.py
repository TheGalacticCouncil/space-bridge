from setuptools import setup
from Cython.Build import cythonize

setup(
    ext_modules=cythonize([
        "EncoderReader.pyx",
        # Add more .pyx files here if you have additional modules
    ]),
)
