# simready-pile

Simplified GLB meshes and convex-hull points for every asset in
[nvidia/simready-assets](https://huggingface.co/datasets/nvidia/simready-assets),
so a phone can drop the whole library in one physics pile.

Each source asset is CC BY 4.0, NVIDIA. These files are scaled, decimated
derivatives. The originals stay on Hugging Face.

`catalog.json` lists `id`, `url`, `mass`, and `hull`.
`glb/` is one mesh per asset.


## App

The pile viewer lives in this repo: a full-screen phone scene that drops the
catalog into one ring, one percent at a time. Tilt tilts gravity. Drag an
object to move it. `more` releases the next percent.

```
npm install
npm run dev
```
