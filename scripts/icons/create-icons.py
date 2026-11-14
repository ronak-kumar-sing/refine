#!/usr/bin/env python3
"""
Generate PNG icon files for the Chrome extension.
Run this script from the icons directory.
"""

import base64

# Minimal PNG icons with purple gradient-like background
# These are valid PNGs created with base64 encoding

# 16x16 purple icon
icon16_b64 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaklEQVQ4T2NkoBAwUqifYdQAhtLS0v+HDx/+j80VpqamjMg2gDXExsaGUUdHh+H///8MDAwMDA4ODgzfvn1jYGJiYoALwjQzMjIy/P//n+Hv378MX758YWBhYWGACcIMMDQ0ZPjy5QvD////AQCFMygR5H5cuwAAAABJRU5ErkJggg=="

# 48x48 purple icon
icon48_b64 = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA2klEQVRoQ+2YQQ6AIAwA4f9/Wk/GxKgH4xWQbrfpBQmUMlvKghH8bMD1BxZwwAMsgHcZlwX2rHDZxz0HHPAgC+Ad5nIHzP35pgPc/YUdYPe/YgfY/b/sALf/V3aA2/+bHWD2/+4OEP2/bge4/X+lA8z+P9ABov+T3QFu/7/bAWb/v+sAs/9vuQPk/u/1gNz/hzrA7P+HO0Dv/wc7wO3/pzrA7f/nOsDt/yc7wPV/qgNc/yc7wO3/pzrA7f/nOsDt/yc7wO3/pzrA7f+0A9z+f6oD5P7/B4vHsDGAzN3wAAAAAElFTkSuQmCC"

# 128x128 purple icon  
icon128_b64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADiUlEQVR4Xu2cUXLDIAxE3fs/tJlkOm0dY4FAu/LyN/4wSPueAMXNfn74uLQGbl92Nwd/MAI4wMUFfNwBvvwB8PEHkA/gJw8gH8CvHsA/7gA+gF89gH/YAXwAf3oA97gD+AB+9QD+UQfwAfzpAdzjDuAD+MUD+IcdwAfwqwfwj0rAwweQD+AnDyAfwCcPYH7qAPJ+n3wA/2EH8AH86gH8ow7gA/jTA7jHHcAH8IsH8I87gA/gVw/gH3YAH8CfHsA97gA+gD97AO/XDmD9E5cPID/pAPkAfuQB5P368gHkq+QB5P364wfQn/4/fAD5SQfIB/BjD6Dv1x8/gP70/+EDyE86QD6A/7gD9P2+5wPITzpAPoB/1AH6fn/5APKTDpAP4B91gL7f9+YDyM85QD6Af9QB8n79yQPI+/3lA8hPOkA+gP+oA+T9+vIB5CcdIB/Af9QB8n79yQPI+/3lA8jPOUA+gH/UAfJ+/fED6M/5Xz6A/JwD5AP4Rx0g79efPIC835cPID/nAPkA/uMOkPfrywf4/7v8nAPkA/hHHSDv15cP8P9u+TkHyAfwH3WAvF9/8gDyft/zAeQnHSAfwH/UAfJ+ffkA/++Un3OAfAD/UQfI+/XlA/y/U37OAfIB/KMOkPfrTx5A3u97PoD8pAPkA/iPOkDery8f4P+d8nMOkA/gP+oAeb++fID/d8rPOUA+gH/UAfJ+/ckDyPt9zweQn3SAfAD/qAPk/fryAf7fKT/nAPkA/qMOkPfrywf4f6f8nAPkA/hHHSDv15cP8P9O+TkHyAfwjzpA3q8/eQB5v+/5APKTDpAP4D/qAHm/vnyA/3fKzzlAPoD/qAPk/fryAf7fKT/nAPkA/lEHyPv1Jw8g7/c9H0B+0gHyAfxHHSDv15cP8P9O+TkHyAfwH3WAvF9fPsD/O+XnHCAfwD/qAHm//uQB5P2+5wPITzpAPoD/qAPk/fryAf7fKT/nAPkA/qMOkPfrywf4f6f8nAPkA/hHHSDv15cP8P9O+TkHyAfwjzpA3q8/eQB5v+/5APKTDpAP4D/qAHm/vnyA/3fKzzlAPoD/qAPk/fryAf7fKT/nAPkA/lEHyPv1Jw8g7/c9H0B+0gHyAfxHHSDv15cP8P9O+TkHyAfwH3WAvF9fPsD/O+XnHCAfwD/qAHm//uQB5P2+8wDyPxygH8C/6gD5v/byAeR/OEA/gH/VAfJ/beYDyJcOkP8f4D/qAHG/n/QB5Es="

# Save icons
with open('icon16.png', 'wb') as f:
    f.write(base64.b64decode(icon16_b64))
    
with open('icon48.png', 'wb') as f:
    f.write(base64.b64decode(icon48_b64))
    
with open('icon128.png', 'wb') as f:
    f.write(base64.b64decode(icon128_b64))

print("Created icon16.png, icon48.png, icon128.png")
