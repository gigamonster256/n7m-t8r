{
  lib,
  buildNpmPackage,
  importNpmLock,
  imagemagick,
}:
let
  inherit (lib.importJSON ./package.json) version;
  src = lib.fileset.toSource {
    root = ./.;
    fileset = lib.fileset.intersection (lib.fileset.fromSource (lib.sources.cleanSource ./.)) (
      lib.fileset.unions [
        ./assets
        ./scripts
        ./src
        ./package.json
        ./package-lock.json
        ./vite.config.js
      ]
    );
  };
in
buildNpmPackage (finalAttrs: {
  pname = "n7m-t8r";
  inherit version;

  inherit src;
  npmDeps = importNpmLock { npmRoot = src; };
  inherit (importNpmLock) npmConfigHook;

  nativeBuildInputs = [ imagemagick ];

  installPhase = ''
    mkdir -p $out/
    cp -r dist/* $out/
  '';
})
