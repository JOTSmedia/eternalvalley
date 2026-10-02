"""Mesa EGL validation of Three standard + real terrain onBeforeCompile output.
Requires moderngl; deliberately does not claim WebGL/browser rendering validation.
"""
import pathlib
import sys
import moderngl

folder = pathlib.Path(sys.argv[1])
ctx = moderngl.create_standalone_context(backend='egl', require=330)
program = ctx.program(vertex_shader=(folder / 'terrain.vert').read_text(),
                      fragment_shader=(folder / 'terrain.frag').read_text())
print('Terrain vertex/fragment compile and link passed:', ctx.info['GL_RENDERER'])
print('Active shader bindings:', len(list(program)))
if (folder / 'render.json').exists():
    import json
    import numpy as np
    from PIL import Image
    data = json.loads((folder / 'render.json').read_text())
    for name, matrix in data['matrices'].items():
        if name in program:
            program[name].write(np.array(matrix, dtype='f4').tobytes())
    values = {'diffuse': (1, 1, 1), 'emissive': (0, 0, 0), 'roughness': .92,
              'metalness': 0., 'opacity': 1., 'isOrthographic': False,
              'ambientLightColor': (.34, .38, .43),
              'directionalLights[0].direction': (.35, .85, .3),
              'directionalLights[0].color': (2.1, 1.96, 1.72),
              'cameraPosition': tuple(data['camera']), 'snowRange': tuple(data['snowRange'])}
    # Match a directional light in view space, as Three normally uploads it.
    view = np.array(data['matrices']['viewMatrix']).reshape(4, 4).T
    d = view[:3, :3] @ np.array([.35, .85, .3])
    values['directionalLights[0].direction'] = tuple(d / np.linalg.norm(d))
    for name, value in values.items():
        if name in program:
            program[name].value = value
    textures = []
    for unit, (name, source) in enumerate(data['textures'].items()):
        if name not in program:
            continue
        image = Image.open(source['filename']).convert('RGB')
        pixels = np.asarray(image).astype('f4') / 255.
        if source['srgb']:
            pixels = np.where(pixels <= .04045, pixels / 12.92, ((pixels + .055) / 1.055) ** 2.4)
        texture = ctx.texture(image.size, 3, pixels.astype('f4').tobytes(), dtype='f4')
        texture.repeat_x = texture.repeat_y = True
        texture.build_mipmaps()
        texture.filter = (moderngl.LINEAR_MIPMAP_LINEAR, moderngl.LINEAR)
        texture.use(unit)
        program[name].value = unit
        textures.append(texture)
    attributes = []
    buffers = []
    for name, fmt in [('position', '3f'), ('normal', '3f'), ('aCreviceAO', '1f')]:
        buffer = ctx.buffer((folder / (name + '.bin')).read_bytes())
        buffers.append(buffer)
        attributes.append((buffer, fmt, name))
    index_buffer = ctx.buffer((folder / 'index.bin').read_bytes())
    vao = ctx.vertex_array(program, attributes, index_buffer=index_buffer, index_element_size=4)
    framebuffer = ctx.simple_framebuffer((1280, 720), components=4, dtype='f4')
    framebuffer.use()
    ctx.enable(moderngl.DEPTH_TEST)
    framebuffer.clear(.43, .56, .7, 1.)
    vao.render()
    pixels = np.frombuffer(framebuffer.read(components=3, dtype='f4'), dtype='f4').reshape(720, 1280, 3)[::-1]
    # Display-referred proof render. Geometry, albedo, normal and lighting are real;
    # the browser's sky, CSM, decorations, fog and postprocess are not reproduced.
    pixels = np.maximum(pixels, 0)
    pixels = pixels / (1 + pixels)
    pixels = np.where(pixels <= .0031308, pixels * 12.92, 1.055 * pixels ** (1 / 2.4) - .055)
    Image.fromarray(np.uint8(np.clip(pixels, 0, 1) * 255)).save(data['output'])
    print('Actual terrain/material diagnostic render:', data['output'])
program.release()
ctx.release()
