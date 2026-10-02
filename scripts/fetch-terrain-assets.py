#!/usr/bin/env python3
"""Fetch original 2K CC0 terrain maps from Poly Haven and ambientCG.
Requires Pillow. No upscaling or colorization. All requests finish and images
validate before installed files change. Failed downloads preserve prior assets.
Grass004 is professional procedural PBR; the other three sets are photoscans.
"""
import concurrent.futures, hashlib, io, json, pathlib, urllib.request, zipfile
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / 'images/textures/photographic'
ASSETS = {'leaf':'leafy_grass','rock':'aerial_rocks_02','sand':'coast_sand_01'}
MAPS = {'diff':'Diffuse','nor':'nor_gl','rough':'Rough'}
GRASS_URL='https://ambientcg.com/get?file=Grass004_2K-JPG.zip'

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'EternalValley asset builder'}),timeout=60) as response:
        return response.read()

def encode(kind,suffix,raw,meta):
    image=Image.open(io.BytesIO(raw));image.load()
    if image.size!=(2048,2048):raise ValueError('Expected original 2048 x 2048 source')
    image=image.convert('L' if suffix=='rough' else 'RGB')
    output=io.BytesIO()
    image.save(output,'JPEG',quality=88 if suffix=='nor' else (78 if kind=='leaf' and suffix=='diff' else 82),optimize=True,subsampling=2)
    data=output.getvalue();filename=f'{kind}_{suffix}.jpg'
    meta.update(filename=filename,sha256=hashlib.sha256(data).hexdigest(),dimensions=[2048,2048],bytes=len(data),normal_convention='OpenGL +Y' if suffix=='nor' else None)
    return filename,data,meta

def asset(item):
    kind,slug=item;files=json.loads(get('https://api.polyhaven.com/files/'+slug));results=[]
    for suffix,key in MAPS.items():
        source=files[key]['2k']['jpg'];raw=get(source['url'])
        if hashlib.md5(raw).hexdigest()!=source['md5']:raise ValueError('Source checksum mismatch: '+source['url'])
        results.append(encode(kind,suffix,raw,{'provider':'Poly Haven','technique':'Photoscanned','source_url':source['url'],'source_md5':source['md5'],'asset_url':'https://polyhaven.com/a/'+slug,'physical_width_m':{'leaf':2,'rock':50,'sand':15}[kind],'author':'Charlotte Baglioni' if kind=='leaf' else 'Rob Tuytel','license':'CC0-1.0','license_url':'https://polyhaven.com/license'}))
    return results

def grass(raw=None):
    raw=raw or get(GRASS_URL);archive=zipfile.ZipFile(io.BytesIO(raw));results=[]
    if archive.testzip() is not None:raise ValueError('ambientCG archive failed CRC verification')
    for suffix,mapname in {'diff':'Color','nor':'NormalGL','rough':'Roughness'}.items():
        member=f'Grass004_2K-JPG_{mapname}.jpg';source=archive.read(member)
        results.append(encode('grass',suffix,source,{'provider':'ambientCG','technique':'Procedural PBR; not a photoscan','source_url':GRASS_URL,'archive_member':member,'source_sha256':hashlib.sha256(source).hexdigest(),'archive_sha256':hashlib.sha256(raw).hexdigest(),'asset_url':'https://ambientcg.com/view?id=Grass004','physical_width_m':1.4,'author':'Lennart Demes','license':'CC0-1.0','license_url':'https://docs.ambientcg.com/license/'}))
    return results

def install(results):
    total=sum(len(data) for _,data,_ in results)
    if total>15*1024*1024:raise ValueError('Asset set exceeds 15 MiB transfer budget')
    DEST.mkdir(parents=True,exist_ok=True)
    for filename,data,_ in results:(DEST/filename).write_bytes(data)
    (DEST/'sources.json').write_text(json.dumps({'providers':['Poly Haven','ambientCG'],'resolution':'Original 2K downloads; no upscaling','processing':'JPEG recompression only; unchanged image dimensions','total_bytes':total,'maps':[meta for _,_,meta in results]},indent=2)+'\n')
    print(f'Installed {len(results)} verified 2K maps, {total:,} bytes')

def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        ground=list(pool.map(asset,ASSETS.items()));turf=pool.submit(grass)
        results=[item for group in ground for item in group]+turf.result()
    install(results)
if __name__=='__main__':main()
